import assert from 'node:assert/strict';
import test from 'node:test';
import { validateFormBody } from '../netlify/lib/form-validation.ts';

const validPayload = (overrides: Record<string, string> = {}) =>
  new URLSearchParams({
    'form-name': 'contacto',
    nombre: 'Ana Pérez',
    empresa: 'Industria Ejemplo',
    email: 'ana@example.com',
    telefono: '+52 664 123 4567',
    tipo_solicitud: 'Proyecto de automatización',
    requerimiento: 'Necesitamos automatizar una línea de producción.',
    canal: 'Correo',
    website: '',
    ...overrides,
  }).toString();

test('acepta y normaliza una solicitud válida', () => {
  const result = validateFormBody(validPayload({ email: 'ANA@EXAMPLE.COM' }));
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.payload.get('email'), 'ana@example.com');
});

test('rechaza campos no autorizados y duplicados', () => {
  assert.deepEqual(validateFormBody(`${validPayload()}&admin=true`), {
    ok: false,
    status: 400,
    code: 'unexpected_field',
  });
  assert.deepEqual(validateFormBody(`${validPayload()}&email=otro@example.com`), {
    ok: false,
    status: 400,
    code: 'duplicate_field',
  });
});

test('aplica límites aunque se omita la validación del navegador', () => {
  const result = validateFormBody(validPayload({ requerimiento: 'x'.repeat(4_001) }));
  assert.deepEqual(result, { ok: false, status: 422, code: 'invalid_requirement' });
});

test('rechaza correo, teléfono y tipo fuera de contrato', () => {
  assert.equal(validateFormBody(validPayload({ email: 'incorrecto' })).ok, false);
  assert.equal(validateFormBody(validPayload({ telefono: '<script>' })).ok, false);
  assert.equal(validateFormBody(validPayload({ tipo_solicitud: 'Ataque' })).ok, false);
});

test('el honeypot responde como aceptado sin generar una entrega', () => {
  assert.deepEqual(validateFormBody(validPayload({ website: 'spam' })), {
    ok: false,
    status: 200,
    code: 'accepted',
    spam: true,
  });
});

test('rechaza cuerpos que exceden el máximo en bytes', () => {
  const result = validateFormBody(`requerimiento=${'á'.repeat(12_001)}`);
  assert.deepEqual(result, { ok: false, status: 413, code: 'payload_too_large' });
});
