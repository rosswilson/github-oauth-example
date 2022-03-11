import fetch from "node-fetch";

export default async function apiRequest(url, opts = {}) {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "http://localhost:3000",
  };

  const { method = "GET", accessToken, body } = opts;

  if (accessToken) {
    headers = { ...headers, Authorization: `Bearer ${accessToken}` };
  }

  console.log(`Making ${method} request to url=${url} with body ${body}`);

  const res = await fetch(url, { method, body, headers });

  if (res.ok) {
    return res.json();
  }

  const textBody = await res.text();

  return { error: textBody };
}
