export const _debug = process.env['NODE' + '_ENV'] !== 'production' && process.env['NODE' + '_ENV'] !== 'test';

export const Patterns = {
  phone: /^[0-9]{3}[-]{0,1}[0-9]{3}[-]{0,1}[0-9]{4}$/,
  zipCode: /(^\d{5}$)/,
  fullName: /^[a-zA-Z\u00C0-\u017F\-\\']+(\s+[a-zA-Z\u00C0-\u017F\-\\']{2,}\s*)+$/,
};

export const ValidationMessages = {
  phone: {
    patternMismatch: 'phone pattern error',
  },
  zipCode: {
    patternMismatch: 'zip code must be 5 digits only',
  },
  fullName: {
    patternMismatch: 'Full name should be at least two words long',
  },
};
