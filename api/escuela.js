const { checkToken } = require('./_auth');
const data = require('./_escuela.json');

module.exports = async (req, res) => {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/(?:^|;\s*)unknow_auth=([^;]+)/);
  const token = m ? decodeURIComponent(m[1]) : '';
  if (!checkToken(token)) {
    res.status(401).json({ ok: false });
    return;
  }
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json(data);
};
