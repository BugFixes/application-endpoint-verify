const bugfixes = require('bugfixes')
const ApplicationModel = require('bugfixes-application-models')
const Logs = require('bugfixes-account-logging')

const bugfunctions = bugfixes.functions

module.exports = (event, context, callback) => {
  let log = new Logs()
  log.action = 'Validate Key and Id'
  log.content = {
    apiKey: event.requestContext.identity.apiKey,
    applicationKey: event.pathParameters.applicationKey,
    applicationId: event.pathParameters.applicationId
  }

  let application = new ApplicationModel()
  application.key = event.pathParameters.applicationKey
  application.applicationId = event.pathParameters.applicationId
  application.verify((error, result) => {
    if (error) {
      log.content.error = error
      log.send()

      return callback(error)
    }

    log.send()

    return callback(null, bugfunctions.lambdaResult(9000, result))
  })
}
