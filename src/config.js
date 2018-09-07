// This is the URL we'll send the user to first to get their authorization
module.exports.authorizeURL = 'https://github.com/login/oauth/authorize'

// This is the endpoint we'll request an access token from
module.exports.tokenURL = 'https://github.com/login/oauth/access_token'

// This is the Github base URL for API requests
module.exports.apiURLBase = 'https://api.github.com'

// The callback URL for the redirect URL
module.exports.redirectUrl = 'http://localhost:3000/callback'

// The URL to redirect the user upon successful login
module.exports.baseUrl = 'http://localhost:3000'

// OAuth secret values
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.log('You should set the CLIENT_ID and CLIENT_SECRET environment variables')
  process.exit()
}

module.exports.clientId = clientId
module.exports.clientSecret = clientSecret
