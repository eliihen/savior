export const escape = string => string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeAttribute = string => string.replace(/"/g, '&quot;');
export const className = status => {
  if (status >= 200 && status < 300) return 'ok';
  if (status >= 400 && status < 600) return 'failed';
  return 'other';
}

