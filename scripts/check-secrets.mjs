#!/usr/bin/env node
/**
 * Puerta de deteccion de secretos.
 *
 * POR QUE POR DOCKER Y NO UN BINARIO INSTALADO: se trabaja en Windows y en
 * macOS. Una imagen fijada da la MISMA version de reglas en las dos maquinas
 * y en CI, sin que nadie instale nada aparte ni se pregunte por que su
 * resultado difiere del de CI.
 *
 * QUE NO SUSTITUYE: .gitignore evita el commit accidental; esto atrapa el
 * descuido cuando .gitignore no alcanzo. Ninguna de las dos protege de una
 * laptop robada. Este repositorio no maneja credenciales de servidor -sirve
 * un sitio estatico/SSR sin base de datos propia-, pero si puede llevarse por
 * delante una clave de API de terceros (mapas, analitica, el token de la API
 * de catalogo) pegada a mano durante una prueba local.
 *
 * DOS PASADAS, cada una por su motivo:
 *   - historial: verifica que nunca haya entrado un secreto a un commit. Lo que
 *     esta en la historia sigue ahi aunque el archivo se haya borrado despues.
 *   - preparado (--staged): atrapa lo que estas a punto de commitear, que es el
 *     unico momento en que corregir todavia es barato.
 *
 * --redact es obligatorio: sin el, la puerta imprimiria el secreto encontrado en
 * la terminal y en el registro de CI, que es publico para quien tenga el repo.
 * Una puerta que filtra lo que detecta no protege nada.
 *
 * POR QUE NO BASTA CON EL CODIGO DE SALIDA DE GITLEAKS (leccion real, no
 * teorica): corrido dentro de un `git worktree` -donde `.git` no es un
 * directorio propio, es un ARCHIVO que apunta a una ruta absoluta del host
 * fuera de lo que aqui se monta-, Gitleaks no podia abrir el repositorio,
 * imprimia un error de git en stderr... y terminaba con codigo 0 de todas
 * formas. El resultado visible era "sin secretos", pero no habia escaneado
 * nada. Por eso este script NUNCA confia solo en que Gitleaks haya dicho que
 * si: antes de aceptar cualquier resultado, comprueba por su cuenta -con git
 * de verdad, en el MISMO contenedor e imagen que hara el escaneo real- que el
 * commit HEAD resuelve y que el historial completo se puede recorrer. Si eso
 * falla, el script se detiene ahi, con un mensaje que dice explicitamente que
 * es un fallo del escaner y no un secreto encontrado, y un codigo de salida
 * que nunca es 0.
 *
 * COMO SE RESUELVE EL LAYOUT DE UN WORKTREE, en vez de solo detectarlo y
 * fallar: `git rev-parse --git-dir` / `--git-common-dir` ya saben resolver el
 * puntero del archivo `.git` -no hace falta parsearlo a mano-. En un checkout
 * normal ambos son el mismo directorio. En un worktree, el git-dir vive
 * DENTRO del comun, en `worktrees/<nombre>`. Se monta el directorio COMUN
 * -una sola vez, de solo lectura- y se le dice a git donde esta cada cosa por
 * variables de entorno (`GIT_DIR`, `GIT_COMMON_DIR`), que es el mecanismo que
 * el propio git usa para soportar worktrees. Si la relacion entre ambos
 * directorios no es la que git worktree genera por si mismo, el script FALLA
 * antes de montar nada, en vez de adivinar una ruta que podria no existir.
 *
 * TODOS los montajes son de solo lectura (`:ro`): esta puerta solo necesita
 * leer objetos, referencias e indice. Nada de lo que hace requiere escribir
 * en el repositorio.
 *
 * EL PREFLIGHT NO ES SUFICIENTE POR SI SOLO: prueba que EL REPOSITORIO se
 * puede abrir y recorrer, pero eso no prueba que GITLEAKS, al escanearlo de
 * verdad, vaya a reportar bien su propio resultado -son dos programas
 * distintos, y el defecto original fue precisamente que Gitleaks devolvia
 * codigo 0 pese a un error real impreso en stderr-. Por eso las dos pasadas
 * reales se capturan enteras (nunca `stdio: 'inherit'`, ni siquiera cuando
 * salen bien) y se exige TODO junto para aceptar un resultado como limpio:
 * codigo 0, sin senal, sin error de spawn, Y stdout Y stderr genuinamente
 * vacios. Con `--no-banner --log-level warn` fijos, una pasada limpia de
 * verdad no imprime nada -ni el banner, ni un aviso-, verificado antes de
 * escribir esta regla; cualquier byte de salida junto a un codigo 0 se trata
 * como la misma anomalia que causo el falso verde, no como "limpio con
 * ruido". Tambien se compara el HEAD visto desde el host contra el visto
 * desde el contenedor de escaneo: si no coinciden, el contenedor no esta
 * viendo el mismo repositorio, y eso tambien es fallo operacional.
 */

import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const IMAGEN = 'zricethezav/gitleaks:v8.30.1';

// Codigo de salida propio para "se encontraron secretos", distinto del que
// Gitleaks podria usar para sus propios errores internos (que por omision
// tambien caeria en 1). Con esto, el codigo de salida de la pasada real ya
// distingue por si solo un hallazgo de un fallo del escaner, sin tener que
// leer ningun texto.
const CODIGO_HALLAZGO = 3;

const raiz = process.cwd();

function git(args) {
  return spawnSync('git', args, { cwd: raiz, encoding: 'utf8', shell: false });
}

function fallarOperacional(mensaje) {
  console.error(
    `\nFALLO OPERACIONAL DEL ESCANER -esto NO significa que se haya encontrado ` +
      `un secreto, significa que la puerta no pudo hacer su trabajo-:\n\n${mensaje}`,
  );
  process.exit(2);
}

const disponible = spawnSync('docker', ['version', '--format', '{{.Server.Version}}'], {
  stdio: 'ignore',
  shell: false,
});
if (disponible.status !== 0) {
  fallarOperacional('No se pudo hablar con Docker.\nLevanta Docker Desktop y vuelve a intentar.');
}

// --- Resolver el layout real de git ---------------------------------------

const dGit = git(['rev-parse', '--git-dir']);
const dComun = git(['rev-parse', '--git-common-dir']);

if (dGit.error || dGit.status !== 0 || dComun.error || dComun.status !== 0) {
  fallarOperacional(
    'No se pudo determinar el directorio de git de este checkout.\n' +
      (dGit.stderr || dComun.stderr || '').trim(),
  );
}

const gitDirHost = path.resolve(raiz, dGit.stdout.trim());
const comunDirHost = path.resolve(raiz, dComun.stdout.trim());

const sufijo = path.relative(comunDirHost, gitDirHost);
const layoutValido = sufijo === '' || (!sufijo.startsWith('..') && !path.isAbsolute(sufijo));

if (!layoutValido) {
  fallarOperacional(
    `El directorio de git de este checkout (${gitDirHost}) no vive dentro de ` +
      `su directorio comun (${comunDirHost}). Esto no coincide con un checkout ` +
      `normal ni con el layout que "git worktree" genera por si mismo, asi que ` +
      `no hay una forma segura de montarlo. La puerta se detiene aqui en vez de ` +
      `escanear un repositorio a medias.`,
  );
}

const gitDirContenedor = sufijo === '' ? '/comun' : `/comun/${sufijo.split(path.sep).join('/')}`;

function docker(argsDocker, { capturar = false } = {}) {
  return spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '-v',
      `${raiz}:/repo:ro`,
      '-v',
      `${comunDirHost}:/comun:ro`,
      '-e',
      `GIT_DIR=${gitDirContenedor}`,
      '-e',
      'GIT_COMMON_DIR=/comun',
      ...argsDocker,
    ],
    capturar ? { encoding: 'utf8', shell: false } : { stdio: 'inherit', shell: false },
  );
}

// --- Verificacion previa: que el repositorio de verdad se puede leer ------
//
// Esto es lo que reemplaza la confianza ciega en el codigo de salida de
// Gitleaks. Usa el git REAL empaquetado en la misma imagen -confirmado que
// existe, `docker run --entrypoint git zricethezav/gitleaks:v8.30.1
// --version`- con los mismos montajes y variables que va a usar el escaneo,
// asi que si esto pasa, el escaneo que sigue tiene con que trabajar de
// verdad.

const cabezaHost = git(['rev-parse', 'HEAD']);
const shaHeadHost = (cabezaHost.stdout || '').trim();
if (cabezaHost.error || cabezaHost.status !== 0 || !/^[0-9a-f]{40}$/.test(shaHeadHost)) {
  fallarOperacional(
    'No se pudo leer el commit HEAD en el host.\n' + (cabezaHost.stderr || '').trim(),
  );
}

const cabeza = docker(['--entrypoint', 'git', IMAGEN, '-C', '/repo', 'rev-parse', 'HEAD'], {
  capturar: true,
});
const shaHead = (cabeza.stdout || '').trim();
if (cabeza.status !== 0 || !/^[0-9a-f]{40}$/.test(shaHead)) {
  fallarOperacional(
    'No se pudo leer el commit HEAD desde el contenedor de escaneo.\n' +
      (cabeza.stderr || '').trim(),
  );
}

// El contenedor podria, en teoria, estar viendo un repositorio DISTINTO al
// del host -un montaje mal resuelto que apunta a otra parte, por ejemplo-
// y aun asi devolver un SHA valido de 40 hex. Comparar contra lo que el
// propio host ve es la unica forma de confirmar que es el MISMO repositorio.
if (shaHead !== shaHeadHost) {
  fallarOperacional(
    `El HEAD visto desde el host (${shaHeadHost}) no coincide con el HEAD visto ` +
      `desde el contenedor de escaneo (${shaHead}). El contenedor no esta viendo ` +
      `el mismo repositorio que el host.`,
  );
}

const cuenta = docker(
  ['--entrypoint', 'git', IMAGEN, '-C', '/repo', 'rev-list', '--count', 'HEAD'],
  { capturar: true },
);
const totalCommits = Number((cuenta.stdout || '').trim());
if (cuenta.status !== 0 || !Number.isInteger(totalCommits) || totalCommits < 1) {
  fallarOperacional(
    'No se pudo recorrer el historial de commits desde el contenedor de escaneo.\n' +
      (cuenta.stderr || '').trim(),
  );
}

// --- El escaneo real --------------------------------------------------------
//
// El preflight de arriba prueba que EL REPOSITORIO se puede abrir y recorrer.
// No prueba que GITLEAKS, al escanearlo, vaya a reportar bien su propio
// resultado -son dos programas distintos, y el bug original fue precisamente
// que Gitleaks devolvia 0 pese a un error real-. Por eso esta pasada se
// captura entera (nunca `stdio: 'inherit'') y se exige TODO lo siguiente para
// aceptarla como limpia: codigo 0, SIN senal, SIN error de spawn, Y stdout Y
// stderr genuinamente vacios. Verificado por separado: con `--no-banner
// --log-level warn` fijos, una pasada limpia de verdad no imprime nada -ni el
// banner, ni un aviso-; cualquier byte de salida en una pasada que dice
// "codigo 0" es la misma anomalia que causo el falso verde original, solo
// que esta vez el script la detecta en vez de confiar en el codigo a secas.

const pasadas = [
  {
    nombre: 'historial de commits',
    args: ['git', '/repo', '--redact', '--no-banner', '--exit-code', String(CODIGO_HALLAZGO)],
  },
  {
    nombre: 'cambios preparados',
    args: [
      'git',
      '/repo',
      '--staged',
      '--redact',
      '--no-banner',
      '--exit-code',
      String(CODIGO_HALLAZGO),
    ],
  },
];

for (const pasada of pasadas) {
  const r = docker([IMAGEN, ...pasada.args, '--log-level', 'warn'], { capturar: true });

  // Se encontraron secretos: es el UNICO caso donde un codigo distinto de 0
  // no es fallo del escaner. Nunca se imprime la salida cruda de Gitleaks.
  if (r.status === CODIGO_HALLAZGO) {
    console.error(
      `\nSecreto detectado en ${pasada.nombre}.\n\n` +
        'NO lo quites y ya: si llego a un commit, sigue en la historia aunque\n' +
        'borres el archivo. Da por filtrada la credencial y ROTALA primero;\n' +
        'limpiar el historial viene despues y es lo menos urgente.',
    );
    process.exit(CODIGO_HALLAZGO);
  }

  // Termino de forma anormal: senal, error al lanzar el proceso, sin codigo,
  // o un codigo que no es ni el limpio ni el de hallazgo.
  if (r.error || r.signal || r.status === null || r.status !== 0) {
    fallarOperacional(
      `El escaneo de ${pasada.nombre} termino de forma anormal ` +
        `(status=${JSON.stringify(r.status)}, signal=${JSON.stringify(r.signal)}` +
        `${r.error ? `, error=${r.error.message}` : ''}). No es ni "limpio" (0) ni ` +
        `"secretos encontrados" (${CODIGO_HALLAZGO}): es un fallo del escaner mismo, ` +
        `no una filtracion confirmada.`,
    );
  }

  // Codigo 0 pero con algo en stdout o stderr: la misma anomalia que causo el
  // falso verde original -Gitleaks reportando "todo bien" con un error real
  // impreso al lado-. No se imprime ese contenido, solo su longitud.
  const stdoutBytes = Buffer.byteLength(r.stdout || '', 'utf8');
  const stderrBytes = Buffer.byteLength(r.stderr || '', 'utf8');
  if (stdoutBytes > 0 || stderrBytes > 0) {
    fallarOperacional(
      `El escaneo de ${pasada.nombre} termino con codigo 0, pero produjo salida ` +
        `que una pasada limpia nunca produce (stdout: ${stdoutBytes} bytes, stderr: ` +
        `${stderrBytes} bytes). Un "limpio" que ademas dice algo no es confiable: es ` +
        `exactamente el patron que causo el falso verde original. Se trata como fallo ` +
        `del escaner, no como ausencia de secretos.`,
    );
  }
}

console.warn(
  `Git accesible: ${totalCommits} commits en HEAD ${shaHead.slice(0, 12)}; ` +
    'Gitleaks termino sin hallazgos en historial y staged.',
);
