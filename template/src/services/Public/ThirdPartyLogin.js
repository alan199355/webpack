import { buildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 子系统单点登录
  thirdPartyLogin: {
    url: '/api/v1/common/tripartite_platform',
    method: 'get'
  }
}

export default buildService(settings)
