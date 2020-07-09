const { WebClient } = require('@slack/web-api')
const axios = require('axios')

const {
  generateDelayedResponsePayload,
  generateParcelMessage,
} = require('./block-generators')

const web = new WebClient(process.env.BOT_TOKEN)

/**
 * Opens a DM with the target typeformer and sends a parcel notification message
 *
 * @param {string} typeformer - The typeformer's slack user ID
 * @returns {Array}
 */
const sendBotMessage = async (typeformer, parcelType) => {
  let imOpenRes

  try {
    imOpenRes = await web.im.open({
      user: typeformer.match(/\w+/g)[0],
    })
  } catch (error) {
    console.error(typeformer, error)
    return [typeformer, false]
  }

  const msgRes = await web.chat.postMessage({
    channel: imOpenRes.channel.id,
    text: generateParcelMessage(parcelType),
  })

  return [typeformer, msgRes.ok] //true or false
}

/**
 * Send parcel notifications to the provided list of typeformers.
 * Then responds to the sending user with a report of results (success/failure)
 *
 * @param {Array} typeformers - A list of typeformer's slack user IDs
 * @param {string} respondUrl - The url to use for reporting the outcome of posting the messages
 */
const notify = async (typeformers, respondUrl, parcelType) => {
  const resultPerTypeformer = await Promise.all(
    typeformers.map(typeformer => sendBotMessage(typeformer, parcelType))
  )

  axios
    .post(respondUrl, generateDelayedResponsePayload(resultPerTypeformer))
    .catch(e => console.log({ e }))
}

const postToChannel = async conversationId => {
  await web.chat.postMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'The turrinator of the week is: <@U832YCMB7>',
        },
      },
    ],
    channel: conversationId,
  })
}

module.exports = {
  notify,
  postToChannel,
}
