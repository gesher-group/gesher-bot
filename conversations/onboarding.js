var WebClient = require('@slack/client').WebClient
var web = new WebClient(process.env.SLACK_BOT_TOKEN)

/*
  Returns a JSON object of users in the Slack channel
*/
function listOfSlackUsers(){
  var JSONObj
  web.users.list(function(err,res){
    JSOBObj = res
  })

  return JSONObj
}

module.exports = {
  listOfSlackUsers : listOfSlackUsers
}
