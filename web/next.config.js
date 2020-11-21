const withTM = require('next-transpile-modules')(['shared']);
const path = require('path');

const baseConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = phase => {
  return withTM(baseConfig);
};
