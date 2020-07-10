const { openView, updateView } = require('../lib/slack')

const handleGump = (req, res) => {
  res.status(200).send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            "My momma always told me: \n\n>_Forrest, don't miss the forest for the trees_ :older_woman::skin-tone-2:",
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Create a forest 🌳',
              emoji: true,
            },
            value: 'open_modal',
          },
        ],
      },
    ],
  })
}

const handleGumpInteractive = (req, res) => {
  const payload = JSON.parse(req.body.payload)
  const { type, trigger_id: triggerId, actions, view } = payload

  if (type === 'block_actions') {
    const actionValue = actions[0].value

    switch (actionValue) {
      case 'open_modal':
        openView(triggerId)
        break

      case 'regenerate_forest':
        const { id: viewId, private_metadata: forestSize } = view
        console.log({ view })
        const forestViewBlocks = getForestViewBlocks(forestSize)

        updateView(viewId, forestViewBlocks, forestSize)
        break

      default:
        break
    }
  }

  if (type === 'view_submission') {
    const forestSize =
      payload.view.state.values.forest_block.forest_action.selected_option.value

    console.log('view_submission', { forestSize })

    return res.status(200).send({
      response_action: 'push',
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Updated view',
        },
        blocks: getForestViewBlocks(forestSize),
        private_metadata: forestSize,
      },
    })
  }

  res.sendStatus(200)
}

const generateForest = forestSize => {
  const FOREST_MEMBERS = [
    '🌳',
    '🌲',
    '🌿',
    '🌴',
    '🎄',
    '🌱',
    '🌳',
    '🌲',
    '🌿',
    '🌴',
    '🎄',
    '🌱',
    '🌳',
    '🌲',
    '🌿',
    '🌴',
    '🎄',
    '🌱',
    '☘️',
    '🍁',
    '🌾',
    '🍃',
    '🌼',
    '🍄',
  ]
  const FOREST_SIZES = {
    sm: 5,
    md: 10,
    lg: 15,
  }
  const gridSize = FOREST_SIZES[forestSize]
  let forest = ''

  for (let index = 0; index < Math.pow(gridSize, 2); index++) {
    const randomMember = Math.floor(Math.random() * FOREST_MEMBERS.length)

    const newMember = FOREST_MEMBERS[randomMember]

    forest = forest.concat(newMember)

    if ((index + 1) % gridSize === 0) {
      forest = forest.concat('\n')
    }
  }

  return forest
}

const getForestViewBlocks = forestSize => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: generateForest(forestSize),
    },
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Regenerate forest',
          emoji: true,
        },
        value: 'regenerate_forest',
      },
    ],
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'channels_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select a channel',
          emoji: true,
        },
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Send to channel',
          emoji: true,
        },
        value: 'send_to_channel',
      },
    ],
  },
]

module.exports = {
  handleGump,
  handleGumpInteractive,
}
