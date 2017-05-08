let BOT_NAME = 'gesher_bot'
let TOKEN = 'xoxp-8865289046-24564848853-180763456119-8f7b4f0208b0b27449f7f1641ac41dd1'

module.exports = (req, res, next) => {
  console.log('out.js / req ', req.body)
  let token = req.body.token

  if (req.body.type === 'url_verification') {
    console.log('A challenger approaches!', req.body)
    const payload = {
      challenge: req.body.challenge
    }
    return res.status(200).json(payload)
  }

  if (token !== TOKEN) {
    return res.status(400).end()
  }

  let userName = req.body.user_name
  if (userName === BOT_NAME) {
    return res.status(200).end()
  }

  let text = req.body.text
  if (text.indexOf('bruno mars') === -1) {
    return res.status(200).end()
  }

  let botPayload = {
    text: 'http://goo.gl/GL8UGi'
  }

  return res.status(200).json(botPayload)
}
