
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ark-forms.cjs.production.min.js')
} else {
  module.exports = require('./ark-forms.cjs.development.js')
}
