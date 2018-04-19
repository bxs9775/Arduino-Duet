const getBrowser = (request,response) => {
  return true;
};

const getArduino = (request,response) => {
  return true;
};

const getNotFound = (request,response) => {
  return true;
}

module.exports.getBrowser = getBrowser;
module.exports.getArduino = getArduino;
module.exports.getNotFound = getNotFound;