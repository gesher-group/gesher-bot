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
  writeSkills: writeSkills
}
