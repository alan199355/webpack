import { openBuildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 获取权限列表
  getTemplateList: {
    url: '/adminc/v1/resource_manage/p_auth_template/get_auth_template_list',
    method: 'get'
  },
  addPermission: {
    url: '/adminc/v1/resource_manage/p_auth_template/create_auth_template',
    method: 'post'
  },
  editPermission: {
    url: '/adminc/v1/resource_manage/p_auth_template/update_auth_template',
    method: 'put'
  },
  deletePermissionTemplate: {
    url: '/adminc/v1/resource_manage/p_auth_template/delete_auth_template',
    method: 'delete'
  },
  // 新增权限
  addPermissionTreeClass: {
    url: '/api/v1/res/p_object/create_object_cate',
    method: 'post'
  },
  // 修改权限
  editPermissionTreeClass: {
    url: '/api/v1/res/p_object/update_object_cate',
    method: 'post'
  },
  // 删除权限
  deletePermissionTreeClass: {
    url: '/api/v1/res/p_object/delete_object_cate',
    method: 'post'
  },
  // 获取权限树
  getPermissionTree: {
    url: '/api/v1/res/p_object/get_tree',
    method: 'post'
  },
  // 为权限模板分配权限
  assignTemplatePermission: {
    url: '/api/v1/res/template/create_tpl_object',
    method: 'post'
  },
  // 获取权限管理列表
  getPermissionList: {
    url: '/api/v1/res/p_object/get_list',
    method: 'post'
  },
  // 删除权限列表数据
  deletePermission: {
    url: '/api/v1/res/p_object/delete_object',
    method: 'post'
  },
  // 新增权限项数据
  createPermission: {
    url: '/api/v1/res/p_object/create_object',
    method: 'post'
  },
  // 修改权限项数据
  updatePermission: {
    url: '/api/v1/res/p_object/update_object',
    method: 'post'
  }
}

export default openBuildService(settings)
