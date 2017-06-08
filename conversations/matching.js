require('dotenv').load()
// var request = require('request')
var _ = require('lodash')
var WebClient = require('@slack/client').WebClient
var slack = new WebClient(process.env.SLACK_BOT_TOKEN)

function getRandomUser (userList) {
  const randomIndex = Math.floor(Math.random() * userList.length)
  const user = userList[randomIndex]
  return user
}

function matchUsers (userList, db) {
  let matches = []

  while (userList.length > 1) {
    let user1 = getRandomUser(userList)
    let user2 = getRandomUser(userList)

    while (user2.id === user1.id) user2 = getRandomUser(userList)
    const match = [user1.id, user2.id]
    matches.push(match)

    userList.splice(_.findIndex(userList, (u) => u.id === user1.id), 1)
    userList.splice(_.findIndex(userList, (u) => u.id === user2.id), 1)

    // introduce match
    // remove from userList

    // - confirm not previously matched
    // - add match data to Firebase
  }

  return matches

  // if (previouslyMatched(match)) return getRandomMatch(userList)
  // else{
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

module.exports = {
  matchUsers: matchUsers
}
