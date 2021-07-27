
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./aws-service.cjs.production.min.js')
} else {
  module.exports = require('./aws-service.cjs.development.js')
}
