var request = require('request');

var HOOK_URL = 'https://hooks.slack.com/services/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';

module.exports = function (req, res, next) {
  var text = req.body.text;
  var botPayload = {
    text: text
  }; 

  var options = {
      url: HOOK_URL,
      method: 'POST',
      headers: {'Content-Type': 'urlencode'},
      form: 'payload=' + JSON.stringify(botPayload)
  };

  // Start the request
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        return res.status(200).end();
      }
  });
};
