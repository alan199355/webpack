import { buildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  login: {
    url: '/adminc/v1/login/do_login',
    method: 'post'
  },
  logout: {
    url: '/adminc/v1/login/log_out',
    method: 'delete'
  },
  getCode: {
    url: '/adminc/v1/p_sms_validcode/create_validate_code',
    method: 'post'
  },
  changePass: {
    url: '/adminc/v1/system_manage/p_sys_user/update_password',
    method: 'put'
  }

}

export default buildService(settings)
