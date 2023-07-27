const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/7oR9ynsiv0lYIoKg',
  target: 'http://localhost:3000/api/github/webhooks',
  logger: console
})

smee.start()