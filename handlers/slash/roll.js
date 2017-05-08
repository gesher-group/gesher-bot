var TOKEN = 'xoxp-8865289046-24564848853-180763456119-8f7b4f0208b0b27449f7f1641ac41dd1'

module.exports = (req, res, next) => {
  var token = req.body.token
  if (token !== TOKEN) {
    return res.status(200).end()
  }

  var roll = Math.floor(Math.random() * 6) + 1
  var botPayload = `You got ${roll}, dude!`
  return res.status(200).json(botPayload)
}
