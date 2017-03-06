// Safari 10 and mobile devices doesn't support fetch: http://caniuse.com/#search=fetch
export default function shortener(url) {
  return fetch('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA20hdW0mgN9sdnfdMvKF0S63-QxwfazAU', {
    method:'POST',
    body: `{"longUrl": "${url}"}`,
    mode: 'cors',
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.json())
  .then(json => json.id)
}
