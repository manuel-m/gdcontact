export default {
  get,
  post,
};

async function get(url) {
  const rawResponse = await fetch(url);
  const json = await rawResponse.json();
  return json;
}

async function post(url, payload) {
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      payload,
    }),
  });
  const json = await rawResponse.json();
  return json;
}
