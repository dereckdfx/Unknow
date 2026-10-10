const { getCode, makeToken, cookieOpts } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }
  const expected = getCode();
  if (!expected || expected.length !== 16) {
    res.status(500).json({ ok: false, error: 'Código no configurado' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const code = String(body?.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 16 || code !== expected) {
    res.status(401).json({ ok: false, error: 'Código incorrecto.' });
    return;
  }
  const token = makeToken();
  res.setHeader('Set-Cookie', `unknow_auth=${token}; ${cookieOpts()}`);
  res.status(200).json({ ok: true });
};
