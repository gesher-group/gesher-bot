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

module.exports = { showSkills: showSkills }
