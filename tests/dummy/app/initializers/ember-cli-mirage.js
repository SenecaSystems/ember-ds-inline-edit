import readModules from 'ember-cli-mirage/utils/read-modules'
import ENV from '../config/environment'
import baseConfig, { testConfig } from '../mirage/config'
import Server from 'ember-cli-mirage/server'

export default {
  name: 'ember-cli-mirage',
  initialize() { startMirage(ENV) }
}

export function startMirage(env = ENV) {
  let environment = env.environment
  let modules = readModules(env.modulePrefix)
  let options = Object.assign(modules, {environment, baseConfig, testConfig})

  return new Server(options)
}

function _shouldUseMirage(env, addonConfig) {
  let userDeclaredEnabled = typeof addonConfig.enabled !== 'undefined'
  let defaultEnabled = _defaultEnabled(env, addonConfig)

  return userDeclaredEnabled ? addonConfig.enabled : defaultEnabled
}

/*
  Returns a boolean specifying the default behavior for whether
  to initialize Mirage.
*/
function _defaultEnabled(env, addonConfig) {
  let usingInDev = env === 'development' && !addonConfig.usingProxy
  let usingInTest = env === 'test'

  return usingInDev || usingInTest
}