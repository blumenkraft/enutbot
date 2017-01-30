const fetch = require('node-fetch');

const root = 'https://api.pnut.io/v0'

const pnut = {
  root: root,
  global: `${root}/posts/streams/global`
}

function call(uri) {
  return fetch(uri, {
    method: 'GET'
  }).then(function (res) {
    return res.json();
  });
}

module.exports = {
  root: () => call(pnut.root),
  global: () => call(pnut.global)
}