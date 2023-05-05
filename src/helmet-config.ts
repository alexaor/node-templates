import helmet from 'helmet'

helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    'font-src': ["'self'", 'external-website.com'],
    // allowing styles from any website
    'style-src': null,
  },
})

export default helmet
