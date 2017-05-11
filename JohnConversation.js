controller.hears(['Tell me your story'], 'direct_message,direct_mention,mention', (bot,
  message) => {
    bot.startConversation(message, (err, convo) => {
      if (err) console.log('Error!', err)
      convo.ask('My whole story?', [
        {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
            convo.say('West Philadelphia born and raised...')
            convo.next()
            setTimeout(() => {process.exit() }, 3000)
          }
        },
        {
          pattern: bot.utterances.no,
          default: true,
          callback: (response, convo) => {
            convo.say('K then')
            convo.next()
          }
        }
      ])
    })
  })
