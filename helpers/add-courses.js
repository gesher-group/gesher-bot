require('dotenv').load()
var request = require('request')
var WebClient = require('@slack/client').WebClient
var slack = new WebClient(process.env.SLACK_BOT_TOKEN)

module.exports = function addCourses (controller, bot, message, db) {
  bot.reply(message, `Okay, let's add some courses. Post a formatted JSON snippet of the department you'd like to add?`)

  controller.on('file_shared', (bot, message) => {
    slack.files.info(message.file_id, null, (err, res) => {
      if (err) console.log(`⚠️ `, err)
      else {
        const options = {
          url: res.file.url_private,
          headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` }
        }

        request(options, (error, response, body) => {
          if (error) console.log(`⚠️ `, err)
          else {
            body = JSON.parse(body)
            for (let department in body) {
              let courseList = {}
              const courses = body[department]
              for (let c in courses) courseList[c] = courses[c]
              db.ref(`courses`).update({ [department]: courseList })
            }
          }
        })
      }
    })
  })
}
