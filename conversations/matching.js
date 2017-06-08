require('dotenv').load()
var WebClient = require('@slack/client').WebClient
var web = new WebClient(process.env.SLACK_OAUTH)
var _ = require('lodash')

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

    const channelName = `${user1.id}_${user2.id}`.toLowerCase()
    web.groups.create(channelName, (err, res) => {
      if (err) console.log('error creating group: ', err)
      console.log('Success!', res)
    })

    // introduce match

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
