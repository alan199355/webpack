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
  // 获取组织树
  getOrganizationTree: {
    url: '/api/v1/org/node/get_org_tree',
    method: 'post'
  },
  // 获取人员列表
  getUserList: {
    url: '/api/v1/res/p_job_user/get_job_user_list',
    method: 'post'
  },
  // 人员列表删除
  deleteUser: {
    url: '/api/v1/res/p_job_user/delete_job_user',
    method: 'post'
  },
  getUserInfo: {
    url: '/api/v1/user/user/get_detail',
    method: 'post'
  },
  // 查看岗位权限
  getJobPermission: {
    url: '/api/v1/org/job/get_object',
    method: 'post'
  },

  // 获取岗位的权限列表
  getJobPermissionList: {
    url: '/api/v1/res/p_auth_job_rela/get_auth_job_rela_list',
    method: 'post'
  },
  // 岗位权限删除
  deleteJobPermission: {
    url: '/api/v1/res/p_auth_job_rela/delete_auth_job_rela',
    method: 'post'
  },
  // 权限清单-数量
  getJobPermissionDetail: {
    url: '/api/v1/res/p_auth_object_rela/get_auth_object_rela_list',
    method: 'post'
  },
  // 组织树-添加子单位，部门，岗位，通过input_node_type区分
  createOrg: {
    url: '/api/v1/org/o_org/create_obs',
    method: 'post'
  },
  // 组织树-修改子单位
  updateOrg: {
    url: '/api/v1/org/o_org/update_org',
    method: 'post'
  },
  // 组织树-删除子单位
  deleteOrg: {
    url: '/api/v1/org/o_org/delete_org',
    method: 'post'
  },
  // 组织树-修改部门
  updateDept: {
    url: '/api/v1/org/o_dept/update_dept',
    method: 'post'
  },
  // 组织树-删除部门
  deleteDept: {
    url: '/api/v1/org/o_dept/delete_dept',
    method: 'post'
  },
  // 组织树-修改岗位
  updateJob: {
    url: '/api/v1/org/o_job/update_job',
    method: 'post'
  },
  // 组织树-删除岗位
  deleteJob: {
    url: '/api/v1/org/o_job/delete_job',
    method: 'post'
  },
  // 组织树-分配人员-列表
  getAssignUserList: {
    url: '/api/v1/org/p_job_user/get_account_list',
    method: 'post'
  },
  // 组织树-分配人员-保存
  batchAssignUser: {
    url: '/api/v1/org/p_job_user/batch_create_job_user',
    method: 'post'
  },
  // 组织树-分配权限模板-列表
  getAssignTemplateList: {
    url: '/api/v1/org/p_auth_job_rela/get_auth_job_list',
    method: 'post'
  },
  // 组织树-分配权限列表-保存
  saveAssignTemplate: {
    url: '/api/v1/org/p_auth_job_rela/batch_create_auth_job_rela',
    method: 'post'
  }
}

export default openBuildService(settings)
