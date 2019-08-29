export async function postRequest(url, data) {
  const baseUrl = process.env.GATSBY_API_URL
  return await fetch(`${baseUrl}${url}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}
