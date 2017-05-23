/*
 * Matching algorithm for gesher-bot
 * Created by Daniel Boles
 * in collaboration with Gesher Labs
 *
 */

function getSkills (user, db) {
  db.ref(`users/${user}`).once('value').then(snapshot => {
    const v = snapshot.val()
    return v.skills
  })
}

function match (users, db) {
  let usersWithData = users.map((userId) => {
    return {
      [userId]: {
        skills: getSkills(userId, db),
        classes: []
      }
    }
  })

  console.log(usersWithData)
}

module.exports = {
  match: match
}
