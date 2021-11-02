const withTM = require('next-transpile-modules')(['ark-forms']);
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const isExport = process.env.NODE_ENV === 'export';
console.log(`\nprocess.env.NODE_ENV:`, process.env.NODE_ENV, '\n');

const baseConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  assetPrefix: isExport ? 'https://dmytroyeremieiev.github.io/ark-form' : '',
};

module.exports = phase => {
  return withTM(baseConfig);
};
