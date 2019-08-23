const GREETINGS = require('../constants/greetings')
const MESSAGES = require('../constants/messages')

const generateImmediateResponsePayload = typeformers => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text: MESSAGES['sender.allowed.title'],
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${MESSAGES['sender.allowed.list']}${typeformers.join('\n')}`,
      },
    },
  ],
})

const generateDelayedResponsePayload = resultPerTypeformer => {
  const failedResults = resultPerTypeformer.filter(result => !result[1])

  if (!failedResults.length) {
    return {
      blocks: [
        { type: 'divider' },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: MESSAGES['sender.allowed.success'],
          },
        },
      ],
    }
  }

  const failedMessagedIntroBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: MESSAGES['sender.allowed.error'],
    },
  }

  const formattedResults = resultPerTypeformer.map(result => {
    return `${result[0]} ${result[1] ? ':white_check_mark:' : ':x:'}`
  })

  const blocks = formattedResults.map(result => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result,
    },
  }))

  return {
    blocks: [
      { type: 'divider' },
      failedMessagedIntroBlock,
      ...blocks,
      { type: 'divider' },
    ],
  }
}

const generateUserForbiddenResponse = () => ({
  type: 'mrkdwn',
  text: MESSAGES['sender.forbidden'],
})

const getRandomHello = () => {
  const randomIndex = Math.floor(Math.random() * GREETINGS.length)

  return `${GREETINGS[randomIndex]}!`
}

const generateParcelMessage = parcelType => {
  return `${getRandomHello()} ${MESSAGES[`typeformer.parcel.${parcelType}`]}`
}

module.exports = {
  generateImmediateResponsePayload,
  generateDelayedResponsePayload,
  generateUserForbiddenResponse,
  generateParcelMessage,
}
