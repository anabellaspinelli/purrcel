const SLACK_USER_ID_REGEX = /^<@U[a-zA-Z0-9]+\|?[a-z0-9][a-z0-9._-]*>/
const filterNonUserIds = userIds =>
  userIds.filter(id => SLACK_USER_ID_REGEX.test(id))

module.exports = {
  filterNonUserIds,
}
