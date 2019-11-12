import { instance, openInstance } from './http'
import qs from 'qs'
// import _ from './lodash'
function request (options, setting) {
  if (typeof settings === 'string') {
    setting = {
      url: setting
    }
  }

  if (typeof options === 'object') {
    // delete options.url
    Object.assign(setting, options)
    /* _.assignWith(setting, options, function (objValue, srcValue, key) {
      return key === 'url' ? objValue : srcValue
    }) */
  }
  // setting[setting.method === 'post' ? 'data' : 'params'].method = setting.url
  // delete setting.url// url在http中默认设置,不能被覆盖
  // if (setting.method === 'get') {
  //   setting.params.system_no = 'scsl'
  // } else {
  //   setting.data.system_no = 'scsl'
  // }
  // console.log(setting, 'services')
  if (setting.type === 'restful') {
    if (!setting.originUrl) {
      setting.originUrl = setting.url
    }
    if (setting.data) {
      setting.url = setting.originUrl + '/' + setting.data.id
    } else if (setting.params) {
      setting.url = setting.originUrl + '/' + setting.params.id
      // delete setting.params.id
    }
  }

  return instance(setting)
}

function buildService (settings) {
  const service = {}
  for (let prop in settings) {
    service[prop] = (options) => {
      return request(options, settings[prop])
    }
    // service[prop] = _.partial(request, _, settings[prop])
  }
  return service
}

function openRequest (options, setting) {
  if (typeof settings === 'string') {
    setting = {
      url: setting
    }
  }

  if (typeof options === 'object') {
    // delete options.url
    Object.assign(setting, options)
    /* _.assignWith(setting, options, function (objValue, srcValue, key) {
      return key === 'url' ? objValue : srcValue
    }) */
  }
  // setting[setting.method === 'post' ? 'data' : 'params'].method = setting.url
  // delete setting.url// url在http中默认设置,不能被覆盖
  // if (setting.method === 'get') {
  //   setting.params.system_no = 'scsl'
  // } else {
  //   setting.data.system_no = 'scsl'
  // }

  return openInstance(setting)
}

function openBuildService (settings) {
  const service = {}
  for (let prop in settings) {
    service[prop] = (options) => {
      return openRequest(options, settings[prop])
    }
    // service[prop] = _.partial(request, _, settings[prop])
  }
  return service
}

export { buildService, openBuildService }
