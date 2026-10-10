const { checkToken } = require('./_auth');

module.exports = async (req, res) => {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)unknow_auth=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : '';
  if (!checkToken(token)) {
    res.status(401).json({ ok: false });
    return;
  }
  res.status(200).json({ ok: true });
};
