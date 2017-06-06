// function getSkills (user, db) {
//   db.ref(`users/${user}`).once('value').then(snapshot => {
//     const v = snapshot.val()
//     return v.skills
//   })
// }

function getRandomMatch (userList, db) {
  let user1 = getRandomUser(userList)
  let user2 = getRandomUser(userList)

  while (user2.id === user1.id) user2 = getRandomUser(userList)
  const match = [user1.id, user2.id]
  // if (previouslyMatched(match)) return getRandomMatch(userList)
  // else{
  return match
  // let user1data = user1.map((userId) => {
  //   return {
  //     [userId]: {
  //       skills: getSkills(userId, db),
  //       classes: getClasses(userId, db)
  //     }
  //   }
  // })
  // let user2data = user2.map((userId) => {
  //   return {
  //     [userId]: {
  //       skills: getSkills(userId, db),
  //       classes: getClasses(userId, db)
  //     }
  //   }
  // })
}
// while (userList.length() > 1) {
//   match.push(getRandomMatch(userList))
// }
// if (userList.length() === 1) {
//   // sorry message!
// }

// do stuff with matches
// function printClassMatches (match) {
// Print to matched users the similar Classes
// }
// function printSkillMatches (match) {
// Print to matched users the similar Skills
// }

// Returns a random user from the provided list
// TODO: after you've created a single match, make sure to remove both users form userList. Also, watch the type of data you're dealing with. An array is not an object, and vice versa.
function getRandomUser (userList) {
  const randomIndex = Math.floor(Math.random() * userList.length)
  const user = userList[randomIndex]
  return user
}

module.exports = {
  getRandomMatch: getRandomMatch
}
