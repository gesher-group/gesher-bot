var request = require('request')
var env = require('../tokens.js')
var slack = require('slack')
var HOOK_URL = 'https://hooks.slack.com/services/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'


let bot = slack.rtm.client()
let token = env.SLACK_BOT_TOKEN

bot.hello(message => {
  console.log(message)
  // console.log(`Got a message: ${message}`)
  bot.close()
})

bot.listen({token})

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
