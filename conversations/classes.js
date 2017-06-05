// start showClasses
function showClasses (bot, message, db) {
  const user = message.user
  let classes = []

  db.ref(`users/${user}`).once('value').then(snapshot => {
    const v = snapshot.val()
    classes = v.classes
    let classesList = ''

    for (let s in classes) {
      if (+s === classes.length - 1) classesList += `, ${classes[s]}.`
      else if (+s !== 0) classesList += `, ${classes[s]}`
      else classesList = classes[0]
    }

    bot.reply(message, `<@${user}> is great at ${classesList}`)
  })
}
// end showClasses

// start writeClasses
function writeClassesHelper (newclasses, uid, db) {
  for (let s in newclasses) {
    if (newclasses[s].charAt(0) === ' ') newclasses[s].substring(1)
  }

  db.ref(`users/${uid}`).once('value').then(snapshot => {
    if (snapshot.val() !== null) {
      let oldclasses = snapshot.val().classes
      for (let s in oldclasses) newclasses.push(oldclasses[s])
    }

    db.ref('users').child(uid).set({ 'classes': newclasses })

    const school = 'cmps'
    for (let c in cources) {
      const { code, title } = c
      db.ref('courses').child(school).set({ [code]: title })
    }
  })
}

function writeClasses (bot, message, db) {
  bot.startConversation(message, (err, convo) => {
    if (err) console.log('ERROR!', err)
    convo.ask(`Okay, let's add classes to your account. Tell me what classes you'd like to add, seperated by commas. _(ex: cat herding, goat racing)_\n\nOr, type \`cancel\` to exit.`, [
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
          writeClassesHelper(response.text.split(','), response.user, db)
          convo.say('classes saved!')
          convo.next()
        }
      }
    ])
  })
}
// end writeClasses

module.exports = {
  showClasses: showClasses,
  writeClasses: writeClasses
}
