const { postToChannel } = require('../lib/slack')

const handleTurrinator = (req, res) => {
  res.status(200).send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            "Oído turri-cocina!! :female-cook::skin-tone-2: We're calculating the master of turras for this week!",
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Show me!',
              emoji: true,
            },
            value: 'click_me_123',
          },
        ],
      },
    ],
  })
}

const handleInteractive = (req, res) => {
  const payload = JSON.parse(req.body.payload)
  const mockedChannelMessages = [
    {
      user: 'US5ETCPP0',
      text: "Let's try trunk based development! :awthanks:",
    },
    { user: 'US5ETCPP0', text: 'Just test it in Production! #yolo :wat:' },
    {
      user: 'US5ETCPP0',
      text: "Have you seen the hives initiatives? They're amazing! 💎",
    },
    {
      user: 'US5ETCPP0',
      text: 'Deploying on Fridays is my favorite extreme sport! :snowboarder:',
    },
  ]

  const message = `The 🏆*TURRINATOR of the WEEK*🏆 is in!\n\n This week's MASTER OF THE TURRAS IS... <@${mockedChannelMessages[2]
    .user}> for their work in: \n\n>"${mockedChannelMessages[
    Math.floor(Math.random() * mockedChannelMessages.length)
  ].text}"`

  postToChannel(payload.channel.id, message)
  res.sendStatus(200)
}

module.exports = {
  handleTurrinator,
  handleInteractive,
}
