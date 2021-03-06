// Load environment variables
require('dotenv').load()

if (!process.env.SLACK_BOT_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

// Instantiate Firebase
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
const controller = Botkit.slackbot({
  interactive_replies: true,
  debug: false
})

const bot = controller.spawn({
  interactive_replies: true,
  token: process.env.SLACK_BOT_TOKEN
}).startRTM()

if (!bot) console.log('ERR: Bot failed to load.')


controller.hears(['test'],'direct_message, direct_mention, mention',function(bot, message) {

  // do something!
  bot.reply(message, 'I heard a message. You are ' + message.user)

//message.user is the USER ID

  

});


const { matchUsers } = require('./conversations/matching')
controller.hears(['random'], 'direct_message, direct_mention, mention', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    if (err) console.log('ERROR!', err)
    db.ref(`users`).once('value').then(snapshot => {
      let userList = []

      // Converts to array of users
      for (let i in snapshot.val()) {
        let props = snapshot.val()[i]
        props.id = i
        userList.push(props)
      }

      bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user
        user = real_name
    
      console.log(user + "user's real name" + "" + name)

      const matches = matchUsers(user,userList).map((m) => {
        return m.map((u) => ` ${u}`)
      })
      console.log(matches + 'found')

      const failed = userList[0] ? `Failed to find  a match for <@${userList[0].id}>` : 'Everyone was matched!'
      
      if (matches) {
        convo.say(`All done! \n\n${matches[0][0]} you are now matched with${matches[0][1]}. \n\n Don't be a stranger! A new channel has been made between you two.`)
        convo.next()
      } else {
        convo.say('An error occurred, check the logs.')
        convo.next()
      }
    })
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
          }, {'key': 'nickname'}) // store the results in field 'nickname'

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

require('dotenv').load()
var WebClient = require('@slack/client').WebClient
var web = new WebClient(process.env.SLACK_BOT_TOKEN)

//const {listUsersInSlack} = require('./conversations/onboarding')
controller.hears(['list'], 'direct_message',(bot,message) => {
  bot.reply(message, 'Hello <@'+message.user+'>' + '\n' + 'your slack id is: ' + message.user);
 var ref = db.ref('users')
  web.users.list(function(err,res){
    let arrayOfUsers = res.members
    for(let i in arrayOfUsers){
      if(!arrayOfUsers[i].deleted ){ // need to check if the profile still exits or not
        console.log(arrayOfUsers[i].profile.real_name_normalized + " " + arrayOfUsers[i].id) // real_name may not have been filled by user,
                                                                  //so we must use real_name_normalized inside the profile object.
        
         db.ref('users').once('value', function(snapshot){
          if(snapshot.val() == null){
            var name = arrayOfUsers[i].profile.real_name_normalized
            var id = arrayOfUsers[i].id
            
            ref.child(name).set({
              name: name,
              id: id,
              matches: 0

            })
          }
          
        })
       
                                                                }

    }
  })
})

// function httpGet(url){
//   var xmlHTTP = new XMLHttpRequest()
//   xmlHTPP.open("GET", url, false)
//   xmlHTTP.send( null )
//   return xmlHTTP.responseText;
// }
