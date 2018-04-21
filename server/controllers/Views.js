const getBrowser = (request, response) => {
  const res = response;

  return res.render('app');
};
const getNotFound = (request, response) => {
  const req = request;
  const res = response;

  return res.render('notfound', { url: req.url, host: req.headers.host });
};

module.exports.getBrowser = getBrowser;
module.exports.getNotFound = getNotFound;
