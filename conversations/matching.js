//
// function getSkills (user, db) {
//   db.ref(`users/${user}`).once('value').then(snapshot => {
//     const v = snapshot.val()
//     return v.skills
//   })
// }

function getRandomMatch (userList, db) {
  let user1 = getRandomIndex(userList)
  let user2
  while (user2 === user1) user2 = getRandomIndex(userList)
  const match = [userList[user1], userList[user2]]
  // if (previouslyMatched(match)) return getRandomMatch(userList)
  // else{
  userList.splice(user1, 1) // first arg is starting index, second arg is how many to be deleted from index onward of object array.
  userList.splice(user2, 1)
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

function getRandomIndex (userList) {
  return userList[Math.floor(Math.random() * userList.length)]
}

module.exports = {
  getRandomMatch: getRandomMatch
}
