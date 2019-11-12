import { openBuildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 获取验证码
  sendCode: {
    url: '/api/v1/base/sms_validcode/send_validcode',
    method: 'post'
  },
  // 验证码校验
  validateCode: {
    url: '/api/v1/base/sms_validcode/validcode',
    method: 'post'
  },
  //标准码
  getStandardCodeData: {
    url: '/api/v1/config/code/get_codelist',
    method: 'post'
  },
}

export default openBuildService(settings)
