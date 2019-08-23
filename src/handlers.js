const { notify } = require('../lib/slack')
const {
  generateImmediateResponsePayload,
  generateUserForbiddenResponse,
} = require('../lib/block-generators')

const { filterNonUserIds } = require('../lib/utils')

const SENDERS_ALLOWLIST = require('../constants/allowlist')
const PARCEL_TYPES = require('../constants/parcel-types')

const handleParcel = (req, res) => {
  if (!SENDERS_ALLOWLIST.includes(req.body.user_id)) {
    res.status(200).send(generateUserForbiddenResponse())
    return
  }

  const parsedInput = req.body.text.split(' ')

  const parcelType = PARCEL_TYPES.includes(parsedInput[0].toLowerCase())
    ? parsedInput[0].toLowerCase()
    : 'parcel'

  const typeformers = filterNonUserIds(parsedInput)

  notify(typeformers, req.body.response_url, parcelType)

  res.status(200).send(generateImmediateResponsePayload(typeformers))
}

module.exports = {
  handleParcel,
}
