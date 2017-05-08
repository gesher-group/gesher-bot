let request = require('request')
let HOOK_URL = 'https://hooks.slack.com/services/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'
let Slack = require('slack-node')
const slack = new Slack(key);

API_TOKEN = '-- api token --'

slack = new Slack(apiToken);

slack.api("users.list", function(err, response) {
  console.log(response);
});

slack.api('chat.postMessage', {
  text:'hello from nodejs',
  channel:'#general'
}, function(err, response){
  console.log(response);
});


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
