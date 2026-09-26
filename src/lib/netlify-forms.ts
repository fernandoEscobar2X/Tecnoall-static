export async function submitNetlifyForm(formName: string, data: FormData): Promise<void> {
  const payload = new URLSearchParams();
  payload.set('form-name', formName);

  for (const [name, value] of data.entries()) {
    if (typeof value === 'string' && name !== 'form-name') payload.append(name, value);
  }

  const response = await fetch('/api/formulario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
  });

  if (!response.ok) throw new Error(`Netlify Forms respondió ${response.status}.`);
}
