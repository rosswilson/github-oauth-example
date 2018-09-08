const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const uuidv4 = require('uuid/v4')
const querystring = require('querystring')

const config = require('./config')
const { apiRequest } = require('./api')

app.use(cookieParser())

app.get('/', (req, res) => {
  const { accessToken } = req.cookies

  // If there is an access token in the session, then the user is already logged in
  if (accessToken) {
    res.send('Logged in!')
  } else {
    res.send('Not logged in! <a href="/login">Login</a>')
  }
})

app.get('/repos', (req, res) => {
  const { accessToken } = req.cookies

  // If there is no access token, redirect to root
  if (!accessToken) {
    res.redirect('/')
  }

  const apiOpts = { accessToken }

  apiRequest(`${config.apiURLBase}/user/repos?sort=created&direction=desc&limit=5`, apiOpts)
    .then(apiRes => {
      if (!apiRes.length) {
        return res.send('Couldn\'t fetch your repos')
      }

      const html = apiRes.map(repo => `<li>${repo.name}</li>`).join('\n')
      res.send(`<ul>${html}</ul>`)
    })
})

app.get('/login', (req, res) => {
  res.clearCookie('accessToken')

  const state = uuidv4()

  res.cookie('state', state, {
    maxAge: 1000 * 60 * 15,
    httpOnly: true
  })

  const params = {
    'response_type': 'code',
    'client_id': config.clientId,
    'redirect_uri': config.redirectUrl,
    scope: 'user public_repo',
    state
  }

  const redirectUrl = `${config.authorizeURL}?${querystring.stringify(params)}`

  // Redirect the user to Github's authorization page
  res.redirect(redirectUrl)
})

app.get('/callback', (req, res) => {
  const { code, state } = req.query

  if (!code || !state) {
    return res.status(400).send('Callback was missing either code or state')
  }

  const { state: expectedState } = req.cookies

  // This ensures our app can’t be tricked into sending an attacker’s authorization code to GitHub
  if (state !== expectedState) {
    return res.status(400).send('State param did not match expected state')
  }

  const postBody = JSON.stringify({
    'grant_type': 'authorization_code',
    'client_id': config.clientId,
    'client_secret': config.clientSecret,
    'redirect_uri': config.redirectUrl,
    code
  })

  apiRequest(config.tokenURL, { method: 'POST', body: postBody })
    .then(apiRes => {
      res.clearCookie('state')

      if (!apiRes['access_token']) {
        return res.status(400).send('Didn\'t receive an access_token from GitHub')
      }

      res.cookie('accessToken', apiRes['access_token'], {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
      })

      res.redirect('/repos')
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
