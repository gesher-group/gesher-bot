var request = require('request')

module.exports = (req, res, next) => {
  console.log('in.js / req ', req)
  let text = req.body.text
  let botPayload = {
    text: text
  }

  let options = {
    url: HOOK_URL,
    method: 'POST',
    headers: {'Content-Type': 'urlencode'},
    form: 'payload=' + JSON.stringify(botPayload)
  }

  // Start the request
  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      return res.status(200).end()
    }
  })
}
