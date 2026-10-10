const crypto = require('crypto');

function getSecret() {
  return process.env.ACCESS_SECRET || '';
}

function getCode() {
  return (process.env.ACCESS_CODE || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function makeToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `ok.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function checkToken(token) {
  if (!token || !getSecret()) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [ok, exp, sig] = parts;
  if (ok !== 'ok') return false;
  if (Number(exp) < Date.now()) return false;
  const payload = `${ok}.${exp}`;
  const expected = sign(payload);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function cookieOpts() {
  return [
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${7 * 24 * 60 * 60}`,
  ].join('; ');
}

module.exports = { getCode, makeToken, checkToken, cookieOpts };
