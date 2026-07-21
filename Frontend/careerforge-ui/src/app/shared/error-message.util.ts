/**
 * ASP.NET Core error responses are usually JSON objects (ProblemDetails,
 * ValidationProblemDetails, or a custom { message } body) — not plain
 * strings. Rendering `err.error` directly in a template can show
 * "[object Object]" instead of a real message. This pulls out the most
 * useful readable string, falling back to a generic message.
 */
export function extractErrorMessage(err: any, fallback: string): string {
  const body = err?.error;

  if (!body) {
    return fallback;
  }
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body.message === 'string') {
    return body.message;
  }
  if (typeof body.title === 'string') {
    return body.title;
  }
  if (body.errors && typeof body.errors === 'object') {
    const firstField = Object.values(body.errors)[0];
    if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
      return firstField[0];
    }
  }
  return fallback;
}
