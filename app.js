require('dotenv').load()
if (!process.env.SLACK_BOT_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

var Botkit = require('botkit')
var os = require('os')

var controller = Botkit.slackbot({
  debug: true
})

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM()

if (!bot) console.log('ERR: Bot failed to load.')

controller.hears(['hello', 'hi'], 'direct_message, direct_mention, mention', (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face'
  }, (err, res) => {
    if (err) bot.botkit.log('Failed to add emoji reaction :(', err)
  })

  controller.storage.users.get(message.user, (err, user) => {
    if (err) console.log('ERROR!', err)
    if (user && user.name) bot.reply(message, `'Hello, ${user.name}.`)
    else bot.reply(message, 'Hello.')
  })
})

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
  let name = message.match[1]

  controller.storage.users.get(message.user, (err, user) => {
    if (err) console.log('ERROR!', err)
    if (!user) user = { id: message.user }
    user.name = name

    controller.storage.users.save(user, (err, id) => {
      if (err) console.log('ERROR!', err)
      bot.reply(message, `Got it. I will call you ${user.name} from now on.'`)
    })
  })
})

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    if (err) console.log('ERROR!', err)
    if (user && user.name) bot.reply(message, `You are ${user.name}!`)
    else {
      bot.startConversation(message, (err, convo) => {
        if (!err) {
          convo.say('I do not know your name yet!')
          convo.ask('What should I call you?', (response, convo) => {
            convo.ask(`You want me to call you _${response.text}?_`, [
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
            if (convo.status === 'completed') {
              bot.reply(message, 'OK! I will update my dossier...')

              controller.storage.users.get(message.user, (err, user) => {
                if (err) console.log('ERROR!', err)
                if (!user) user = { id: message.user }
                user.name = convo.extractResponse('nickname')
                controller.storage.users.save(user, (err, id) => {
                  if (err) console.log('ERROR!', err)
                  bot.reply(message, `Got it. I will call you ${user.name} from now on.`)
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

controller.hears(['What is your favorite drink'], 'direct_message, direct_mention, mention', (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'grinning'
  }, (err, res) => {
    if (err) bot.botkit.log('Failed to add emoji reaction :(', err)
  })

  controller.storage.users.get(message.user, (err, user) => {
    console.log(err)
    bot.startConversation(message, (err, convo) => {
      console.log(err)
      convo.say('That is a really nice drink')
      convo.ask('Can you get me one?', (response, convo) => {
        convo.ask('Wait, sorry I did not hear you was that a yes or a no?', [
          {
            pattern: 'yes',
            callback: (response, convo) => {
              convo.say('Thank You!')
              convo.stop()
            }
          },
          {
            pattern: 'no',
            callback: (response, convo) => {
              convo.say('Wow you are mean')
              convo.stop()
            }
          },
          {
            default: true,
            callback: (response, convo) => {
              convo.repeat()
              convo.stop()
            }
          }
        ])
      })
    })
  })
})

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    if (err) console.log('ERROR!', err)
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

controller.hears(['tell me a secret'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    console.log('Tell me a secret threw an error: ', err)
    convo.ask('Are you sure you want to know?', [
      {
        pattern: bot.utterances.yes,
        callback: (response, convo) => {
          convo.say('I know how to count all the way to schfifty five.')
          convo.next()
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: (response, convo) => {
          convo.say('...awkward. *coughs*')
          convo.next()
        }
      }
    ])
  })
})

controller.hears(['Tell me your story'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    console.log(err)
    convo.ask('My whole story?', [
      {
        pattern: bot.utterances.yes,
        callback: (response, convo) => {
          convo.say('I was made in Santa Cruz, California like 3 days ago, theres not much to say!')
          convo.next()
          setTimeout(() => { process.exit() }, 3000)
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: (response, convo) => {
          convo.say('K then')
          convo.next()
        }
      }
    ])
  })
})

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'direct_message, direct_mention, mention', (bot, message) => {
  const hostname = os.hostname()
  const uptime = formatUptime(process.uptime())

  bot.reply(message,
    `:robot_face: I'm ${bot.identity.name}, a bot built by the Gesher Labs team. I have been running for ${uptime} on ${hostname}.`)
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

  if (uptime !== 1) unit = unit + 's'
  return `${uptime} ${unit}`
}
