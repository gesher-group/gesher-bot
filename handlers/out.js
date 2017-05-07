var BOT_NAME = 'yesdoubt';
var TOKEN = '80xdkjKkn02JgCic18Vmwe7M';

module.exports = function (req, res, next) {
  var token = req.body.token;
  if (token !== TOKEN) {
    return res.status(200).end();
  }

  var userName = req.body.user_name;
  if (userName === BOT_NAME) {
    return res.status(200).end();
  }

  var text = req.body.text;
  if (text.indexOf('bruno mars') === -1) {
    return res.status(200).end();
  }

  var botPayload = {
    text: 'http://goo.gl/GL8UGi'
  };
  return res.status(200).json(botPayload);
};
