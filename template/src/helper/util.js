import store from '@/store'
export default {
  // 全局路径
  // apiServer: 'http://dev_console_api.ihibuilding.cn/',
  apiServer: 'http://test_console_api.ihibuilding.cn',
  // apiServer:'http://192.168.33.84:8201',
  /* apiServer () {
    return '/'
  }, */
  imageServer: '/',
  // 本地存储
  setStorage (name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },
  getStorage (name) {
    if (!name) return
    let content = window.localStorage.getItem(name)
    return JSON.parse(content)
  },
  removeStorage (name) {
    if (!name) return
    window.localStorage.removeItem(name)
  },
  getAuth (name) {
    let mainAuth = store.state.pageAuth
    let authList = mainAuth.children_list
    let flag = false
    authList.map((item) => {
      if (item.object_no === name) {
        flag = true
      }
    })
    return flag
  }
}
