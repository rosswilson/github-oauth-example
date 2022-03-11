// This is the URL we'll send the user to first to get their authorization
export const authorizeURL = "https://github.com/login/oauth/authorize";

// This is the endpoint we'll request an access token from
export const tokenURL = "https://github.com/login/oauth/access_token";

// This is the Github base URL for API requests
export const apiURLBase = "https://api.github.com";

// The callback URL for the redirect URL
export const redirectUrl = "http://localhost:3000/callback";

// The URL to redirect the user upon successful login
export const baseUrl = "http://localhost:3000";

// OAuth secret values
export const clientId = process.env.CLIENT_ID;
export const clientSecret = process.env.CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.log(
    "You should set the CLIENT_ID and CLIENT_SECRET environment variables"
  );
  process.exit();
}
