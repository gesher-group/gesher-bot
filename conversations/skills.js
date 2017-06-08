// start showSkills
function showSkills (bot, message, db) {
  const user = message.user
  let skills = []

  db.ref(`users/${user}`).once('value').then(snapshot => {
    const v = snapshot.val()
    skills = v.skills
    let skillList = ''

    for (let s in skills) {
      if (+s === skills.length - 1) skillList += `, ${skills[s]}.`
      else if (+s !== 0) skillList += `, ${skills[s]}`
      else skillList = skills[0]
    }

    bot.reply(message, `<@${user}> is great at ${skillList}`)
  })
}
// end showSkills



function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}


// function showMenu(bot, message, db) {
// /// shows Menu options
//   text: ' Which of the following categories has your skills?',
//   response_type: 'in_channel',
//     attachments: [
//         {
//             "text": "Choose a category",
//             "fallback": "Go back to main menu",
//             "color": "#3AA3E3",
//             "attachment_type": "default",
//             "callback_id": "category_selection",
//             "actions": [
//                 {
//                     "name": "maincategory_lsit",
//                     "text": "Pick a category...",
//                     "type": "select",
//                     "options": [
//                         {
//                             "text": "Political Science",
//                             "value": "political science"
//                         },
//                         {
//                             "text": "Life Science",
//                             "value": "life science"
//                         },
//                         {
//                             "text": "Engineering",
//                             "value": "engineering"
//                         },
//                         {
//                             "text": "Sales",
//                             "value": "slaes"
//                         },
//                         {
//                             "text": "Finance",
//                             "value": "finance"
//                         },
//                         {
//                             "text": "Marketing",
//                             "value": "marketing"
//                         },
//                         {
//                             "text": "Law",
//                             "value": "law"
//                         },
//                         {
//                             "text" : "Mangement",
//                             "value": "management"
//                         }
//
//                     ]
//                 }
//             ]
//         }
//     ]
// }



const direct = ['direct_mention', 'direct_message']
controller.hears(['ping'], direct, (bot, message) => {
var cat1 = 'Tell me which categories most closely fits your skills?\n' +
          ':one:Political Science\n' + ':two:Life Science\n' +
          ':three:Engineering\n' + ':four:Sales\n' +
          ':five:Finance\n' + ':six:Marketing\n' + ':seven:Law\n' +
          ':eight:Managment\n'

var eng = 'OK Thanks! Now what about these?'+
            ':one:Software\n' + ':two: Hardware\n' +
            ':three:Civil\n' + ':four:Mechanical\n' +
            ':five:Chemical\n' + ':six:Biomedical\n' + ':seven:Environmental\n' +
            ':eight:Agricultural\n'

var market = 'OK Thanks! Now what about these?'+
            ':one:Public Speaking\n' + ':two: Creativity\n' +
            ':three:Negotiation\n' + ':four:Case Study\n' +
            ':five:Social Media Stradegy\n' + ':six:Event Planning\n' +
            ':seven:Focus Groups\n' +
            ':eight:Consumer Service\n'


  var emojiArray = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

  console.log('Initiating Skills Interview, my favorite!')


  bot.startConversation(message, (err, convo) => {


    bot.reply(message,cat1 ,(err, res) => {
      for (let em in emojiArray){
      bot.api.reactions.add({

        timestamp: res.ts,
        //do I add the unique id
        channel: message.channel,
        name: emojiArray[em]


      })
    }


    })

  })
  controller.on('reaction_added', (bot, event) => {
    if(event = 'one'){bot.reply(message,'')}

    console.log(event) // this will listen to future reactions, see console
  })
})




















// start writeSkills
function writeSkillsHelper (newSkills, uid, db) {
  for (let s in newSkills) {
    if (newSkills[s].charAt(0) === ' ') newSkills[s].substring(1)
  }

  db.ref(`users/${uid}`).once('value').then(snapshot => {
    if (snapshot.val() !== null) {
      let oldSkills = snapshot.val().skills
      for (let s in oldSkills) newSkills.push(oldSkills[s])
    }

    db.ref('users').child(uid).set({ 'skills': newSkills })
  })
}

function writeSkills (bot, message, db) {
  bot.startConversation(message, (err, convo) => {
    if (err) console.log('ERROR!', err)
    convo.ask(`Okay, let's add skills to your account. Tell me what skills you'd like to add, seperated by commas. _(ex: cat herding, goat racing)_\n\nOr, type \`cancel\` to exit.`, [
      {
        pattern: 'cancel',
        callback: (response, convo) => {
          convo.say('Okay, cancelled.')
          convo.next()
        }
      }, {
        pattern: '(*)',
        default: true,
        callback: (response, convo) => {
          writeSkillsHelper(response.text.split(','), response.user, db)
          convo.say('Skills saved!')
          convo.next()
        }
      }
    ])
  })
}
// end writeSkills

module.exports = {
  showSkills: showSkills,
  writeSkills: writeSkills,
  sendMessageToSlackResponseURL : sendMessageToSlackResponseURL
}
