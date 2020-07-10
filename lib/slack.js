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
    .catch(e => console.error({ e }))
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

const openView = async triggerId => {
  try {
    await web.views.open({
      trigger_id: triggerId,
      view: {
        type: 'modal',
        callback_id: 'forest_view_1',
        title: {
          type: 'plain_text',
          text: 'Create a forest',
        },
        submit: {
          type: 'plain_text',
          text: 'Create my forest',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text:
                "Oh you want to create a forest, that's great! The first thing you need to do is configure it:",
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'forest_block',
            element: {
              type: 'static_select',
              action_id: 'forest_action',
              placeholder: {
                type: 'plain_text',
                text: 'Select an option',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Small Forest',
                    emoji: true,
                  },
                  value: 'sm',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Medium Forest',
                    emoji: true,
                  },
                  value: 'md',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Big Forest',
                    emoji: true,
                  },
                  value: 'lg',
                },
              ],
            },
            label: {
              type: 'plain_text',
              text: 'Forest size',
              emoji: true,
            },
          },
        ],
      },
    })
  } catch (error) {
    console.error(error.data.response_metadata)
  }
}

const updateView = async (viewId, blocks, privateMetadata) => {
  try {
    await web.views.update({
      view_id: viewId,
      view: {
        type: 'modal',
        callback_id: 'forest_view_2',
        title: {
          type: 'plain_text',
          text: 'Create a forest',
        },

        blocks,
        private_metadata: privateMetadata,
      },
    })
  } catch (error) {
    console.error(error.data.response_metadata)
  }
}

module.exports = {
  notify,
  postToChannel,
  openView,
  updateView,
}
