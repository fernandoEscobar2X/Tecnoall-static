const MAX_BODY_BYTES = 12_000;

const allowedFields = new Set([
  'form-name',
  'productos_seleccionados',
  'subject',
  'origen',
  'pagina',
  'fecha_envio',
  'website',
  'nombre',
  'empresa',
  'email',
  'telefono',
  'tipo_solicitud',
  'requerimiento',
  'canal',
]);

const allowedFormNames = new Set(['contacto', 'solicitud-cotizacion']);
const allowedRequestTypes = new Set([
  'Proyecto de automatización',
  'Suministro industrial',
  'Servicio o mantenimiento',
  'Otro',
]);

type ValidResult = { ok: true; payload: URLSearchParams };
type InvalidResult = { ok: false; status: number; code: string; spam?: boolean };
export type FormValidationResult = ValidResult | InvalidResult;

const hasForbiddenControls = (value: string, allowLines = false) => {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    const allowedWhitespace = allowLines && (code === 9 || code === 10 || code === 13);
    if (!allowedWhitespace && (code < 32 || code === 127)) return true;
  }
  return false;
};

const readSingle = (params: URLSearchParams, name: string) => {
  const values = params.getAll(name);
  return values.length === 1 ? values[0]?.trim() : undefined;
};

const isLengthBetween = (value: string, minimum: number, maximum: number) =>
  value.length >= minimum && value.length <= maximum;

export function validateFormBody(rawBody: string): FormValidationResult {
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, code: 'payload_too_large' };
  }

  const input = new URLSearchParams(rawBody);
  for (const key of input.keys()) {
    if (!allowedFields.has(key)) return { ok: false, status: 400, code: 'unexpected_field' };
    if (input.getAll(key).length > 1) {
      return { ok: false, status: 400, code: 'duplicate_field' };
    }
  }

  const honeypot = readSingle(input, 'website') ?? '';
  if (honeypot) return { ok: false, status: 200, code: 'accepted', spam: true };

  const formName = readSingle(input, 'form-name') ?? '';
  const name = readSingle(input, 'nombre') ?? '';
  const company = readSingle(input, 'empresa') ?? '';
  const email = readSingle(input, 'email')?.toLowerCase() ?? '';
  const phone = readSingle(input, 'telefono') ?? '';
  const requestType = readSingle(input, 'tipo_solicitud') ?? '';
  const requirement = readSingle(input, 'requerimiento') ?? '';
  const products = readSingle(input, 'productos_seleccionados') ?? '';
  const channel = readSingle(input, 'canal') ?? '';

  if (!allowedFormNames.has(formName)) {
    return { ok: false, status: 400, code: 'invalid_form' };
  }
  if (!isLengthBetween(name, 2, 100) || hasForbiddenControls(name)) {
    return { ok: false, status: 422, code: 'invalid_name' };
  }
  if (company.length > 120 || hasForbiddenControls(company)) {
    return { ok: false, status: 422, code: 'invalid_company' };
  }
  if (
    !isLengthBetween(email, 3, 254) ||
    hasForbiddenControls(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)
  ) {
    return { ok: false, status: 422, code: 'invalid_email' };
  }
  if (phone && (!isLengthBetween(phone, 7, 30) || !/^[0-9+().\s-]+$/u.test(phone))) {
    return { ok: false, status: 422, code: 'invalid_phone' };
  }
  if (!allowedRequestTypes.has(requestType)) {
    return { ok: false, status: 422, code: 'invalid_request_type' };
  }
  if (!isLengthBetween(requirement, 10, 4_000) || hasForbiddenControls(requirement, true)) {
    return { ok: false, status: 422, code: 'invalid_requirement' };
  }
  if (products.length > 4_000 || hasForbiddenControls(products, true)) {
    return { ok: false, status: 422, code: 'invalid_products' };
  }
  if (channel !== 'Correo') {
    return { ok: false, status: 422, code: 'invalid_channel' };
  }

  const payload = new URLSearchParams({
    'form-name': formName,
    nombre: name,
    empresa: company,
    email,
    telefono: phone,
    tipo_solicitud: requestType,
    requerimiento: requirement,
    canal: 'Correo',
    origen: formName === 'contacto' ? 'Sobre nosotros' : 'Cotizador corporativo',
    fecha_envio: new Date().toISOString(),
    subject:
      formName === 'contacto'
        ? '[Tecno All] Nuevo contacto · %{submissionId}'
        : '[Tecno All] Nueva solicitud de cotización · %{submissionId}',
  });

  if (products) payload.set('productos_seleccionados', products);
  return { ok: true, payload };
}
