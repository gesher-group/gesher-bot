var TOKEN = 'xnl6CvlwJ6bGM5QEg4UVuyOb';

module.exports = function (req, res, next) {
  var token = req.body.token;
  if (token !== TOKEN) {
    return res.status(200).end();
  }

  var roll = Math.floor(Math.random()*6) + 1;
  var botPayload = 'You got ' + roll + ', dude!';
  return res.status(200).json(botPayload);
};
