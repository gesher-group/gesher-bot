require('dotenv').load()
if (!process.env.SLACK_BOT_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

var Botkit = require('botkit')
var os = require('os')

var controller = Botkit.slackbot({
  debug: true,
})

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM()

controller.hears(['hello', 'hi'], 'direct_message, direct_mention, mention', (bot, message) => {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  }, (err, res) => {
    if (err) bot.botkit.log('Failed to add emoji reaction :(', err)
  })


  controller.storage.users.get(message.user, (err, user) => {
    if (user && user.name) bot.reply(message, `'Hello, ${user.name}.`)
    else bot.reply(message, 'Hello.')
  })
})

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
  let name = message.match[1]

  controller.storage.users.get(message.user, (err, user) => {
    if (!user) user = { id: message.user }
    user.name = name

    controller.storage.users.save(user, (err, id) => {
      bot.reply(message, `Got it. I will call you ${user.name} from now on.'`)
    })
  })
})

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', (bot, message) => {

  controller.storage.users.get(message.user, (err, user) => {
    if (user && user.name) bot.reply(message, `Your name is ${user.name}`)
    else {
      bot.startConversation(message, (err, convo) => {
        if (!err) {
          convo.say('I do not know your name yet!')
          convo.ask('What should I call you?', (response, convo) => {
            convo.ask('You want me to call you `' + response.text + '`?', [
              {
                pattern: 'yes',
                callback: (response, convo) => {
                  // since no further messages are queued after this,
                  // the conversation will end naturally with status == 'completed'
                  convo.next()
                }
              },
              {
                pattern: 'no',
                callback: (response, convo) => {
                  // stop the conversation. this will cause it to end with status == 'stopped'
                  convo.stop()
                }
              },
              {
                default: true,
                callback: (response, convo) => {
                  convo.repeat()
                  convo.next()
                }
              }
            ])
            convo.next()
          }, {'key': 'nickname'}) // store the results in field "nickname"

          convo.on('end', (convo) => {
            if (convo.status == 'completed') {
              bot.reply(message, 'OK! I will update my dossier...')

              controller.storage.users.get(message.user, (err, user) => {
                if (!user) user = { id: message.user, }
                user.name = convo.extractResponse('nickname')
                controller.storage.users.save(user, (err, id) => {
                  bot.reply(message, `Got it. I will call you ${user.name} from now on.'`)
                })
              })
            } else {
              // if the conversation ended prematurely for some reason
              bot.reply(message, 'OK, nevermind!')
            }
          })
        }
      })
    }
  })
})


controller.hears(['shutdown'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.ask('Are you sure you want me to shutdown?', [
      {
        pattern: bot.utterances.yes,
        callback: (response, convo) => {
          convo.say('Bye!')
          convo.next()
          setTimeout(() => { process.exit() }, 3000)
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: (response, convo) => {
          convo.say('*Phew!*')
          convo.next()
        }
      }
    ])
  })
})


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'direct_message,direct_mention,mention', (bot, message) => {
  const hostname = os.hostname()
  const uptime = formatUptime(process.uptime())

  bot.reply(message,
    `:robot_face: I am a bot named <@ ${bot.identity.name}.` +
    `I have been running for ${uptime} on ${hostname}.`)
})

function formatUptime (uptime) {
  let unit = 'second'
  if (uptime > 60) {
    uptime = uptime / 60
    unit = 'minute'
  }

  if (uptime > 60) {
    uptime = uptime / 60
    unit = 'hour'
  }

  if (uptime != 1) unit = unit + 's'
  return `${uptime} ${unit}`
}
