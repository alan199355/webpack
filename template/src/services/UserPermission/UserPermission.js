import { openBuildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 获取密钥
  getKey: {
    url: '/api/v1/access/access_system/get_key',
    method: 'post'
  },
  // 登录
  login: {
    url: '/api/v1/access/login/do_login',
    method: 'post'
  },
  // 获取用户权限
  getUserAuth: {
    url: '/api/v1/user/user/get_auths',
    method: 'post'
  },
  // 获取菜单列表
  getMenuTree: {
    url: '/api/v1/user/user/get_menu',
    method: 'post'
  },
  // 根据域名获取单位信息
  getCompanyByDomain: {
    url: '/api/v1/org/company/get_company_by_domain',
    method: 'post'
  },
  // 发送验证码
  sendCode: {
    url: '/api/v1/access/login/create_validate_code',
    method: 'post'
  },
  // 注册
  onRegister: {
    url: '/api/v1/access/login/register',
    method: 'post'
  },
  // 根据单位类型/名称/域名/业务范围检查单位是否存在
  checkCompanyExists: {
    url: '/api/v1/org/company/check_company_exists',
    method: 'post'
  },
  // 根据company_id获取公司信息
  getCompanyInfo: {
    url: '/api/v1/org/company/get_company',
    method: 'post'
  }

}

export default openBuildService(settings)
