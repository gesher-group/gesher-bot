// Load environment variables
require('dotenv').load()

if (!process.env.SLACK_BOT_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

// Instantiate Firebase DB
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('./firebase-service-account-key.json')
const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://gesher-bot.firebaseio.com'
})
const db = firebase.database()

// Instantiate Botkit
const Botkit = require('botkit')
const os = require('os')
const controller = Botkit.slackbot({ debug: false })
const bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM()

if (!bot) console.log('ERR: Bot failed to load.')

controller.hears(['ping'], 'direct_mention', (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'table_tennis_paddle_and_ball'
  })
})

controller.hears(['invite'], 'direct_mention', (bot, message) => {
  //
})

controller.hears(['help', 'roadmap', 'what do you do'], ['direct_message', 'mention'], (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'wave'
  })

  bot.reply(message, `Hey there <@${message.user}>, I'm Gesher bot. :robot_face:
  I'm here to help connect you to other Gesher members. I'm in development right now, but soon, I'll be able to:
  • find members by skills (marketing, sales, strategy)
  • introduce you to people I think you might benefit from meeting
  • more? Talk to someone in #labs if you have a suggestion

  :wave: :robot_face:`)
})

// Helper, add courses // Disabled! Uncomment two lines below to re-enable
// This is a super-user tool to add formatted department data to Firebase.
// const { addCourses } = require('./helpers/add-courses')
// controller.hears(['add courses'], 'direct_message', (bot, message) => addCourses(controller, bot, message, db))

// Conversation, Show Skills
// This conversation allows the user to see a list of skills they've added to gesher-bot's database.
const { showSkills, writeSkills } = require('./conversations/skills')
controller.hears(['show skills'], 'direct_message', (bot, message) => showSkills(bot, message, db))

// Conversation, Write Skills
// This conversation allows the user to add skills to gesher-bot's database.
controller.hears(['write skills'], 'direct_message', (bot, message) => writeSkills(bot, message, db))

// Conversation, Show Classes
// This conversation allows the user to see a list of classes they've added to gesher-bot's database.
const { showClasses, writeClasses } = require('./conversations/classes')
controller.hears(['show classes'], 'direct_message', (bot, message) => showClasses(bot, message, db))

// Conversation, Write Classes
// This conversation allows the user to add classes to gesher-bot's database.
controller.hears(['write classes'], 'direct_message', (bot, message) => writeClasses(bot, message, db))

// Conversation, Random matching
// This conversation allows certain users the ability to generate random matches for other Users.
const { matchUsers } = require('./conversations/matching')
controller.hears(['random'], 'direct_message', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    if (err) console.log('ERROR!', err)
    convo.ask(`What's the password?`, [
      {
        pattern: `friend`,
        callback: (response, convo) => {
          console.log('Password accepted')
          convo.say(`Password accepted.`)
          db.ref(`users`).once('value').then(snapshot => {
            let userList = []

            // Converts to array of users
            for (let i in snapshot.val()) {
              let props = snapshot.val()[i]
              props.id = i

              userList.push(props)
            }

            const matches = matchUsers(userList).map((m) => {
              return m.map((u) => ` <@${u}>`)
            })

            const failed = userList[0] ? `Failed to find  a match for <@${userList[0].id}>` : 'Everyone was matched!'

            console.log(userList)

            if (matches) {
              convo.say(`All done... \n\n Matched: ${matches}\n\n${failed}`)
              convo.next()
            } else {
              convo.say('An error occurred, check the logs.')
              convo.next()
            }
          })
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: (response, convo) => {
          convo.say('Sorry, wrong password')
          convo.next()
        }
      }
    ])
  })
})

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
    console.log('USER : ', user)
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

const favDrinkTriggers = [
  'What is your favorite drink',
  'What\'s your favorite drink',
  'favorite drink'
]

controller.hears(favDrinkTriggers, 'direct_message, direct_mention, mention', (bot, message) => {
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
      convo.say('I love Pepsi mixed with Sprite!')
      convo.ask('Do you think you could get me one?', (response, convo) => {
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

controller.hears(['wake up'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    console.log(err)
    convo.ask('When you wake regain consciousness you feel yourself falling. Around you are rings of fire. As you go down the flames seem to raise higher. And it burns! Eventually you land and see a lake and a bridge', [
      {
        pattern: bot.utterances.lake,
        callback: (response, convo) => {
          convo.say('A lady raises up out of the lake and offers you a weapon. Do you take a sword or bow?')
          convo.next()
        }
      },
      {
        pattern: bot.utterances.sword,
        callback: (response, convo) => {
          convo.say('You grab the sword. Maybe you should practice.')
          convo.next()
        }
      },
      {
        pattern: bot.utterances.bridge,
        default: true,
        callback: (response, convo) => {
          convo.say('U ded sorry :/')
          convo.next()
        }
      }
    ])
  })
})

controller.hears(['Fight ME'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    console.log('Dobrota messed up! :() ', err)
    convo.ask('With just you?', [
      {
        pattern: bot.utterances.yes,
        callback: (response, convo) => {
          convo.say('Hold on then, let me get my baseball bat')
          convo.next()
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: (response, convo) => {
          convo.say('AWW Dont be a such a chicken, son')
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
