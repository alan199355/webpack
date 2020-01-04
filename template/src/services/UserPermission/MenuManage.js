import { openBuildService } from '../../helper/service'

// 值类型为String或Object,String为url(method),Object同axios(config)参数支持相同,data和params只能为对象类型
const settings = {
  // 获取菜单列表
  getMenuList: {
    url: '/api/v1/res/menu/get_list',
    method: 'post'
  },
  // 新增菜单 /adminc/v1/resource_manage/p_menu/create_menu
  createMenu: {
    url: '/api/v1/res/menu/create_menu',
    method: 'post'
  },
  // 编辑菜单 /adminc/v1/resource_manage/p_menu/update_menu
  updateMenu: {
    url: '/api/v1/res/menu/update_menu',
    method: 'post'
  },
  // 删除菜单 /adminc/v1/resource_manage/p_menu/delete_menu
  deleteMenu: {
    url: '/api/v1/res/menu/delete_menu',
    method: 'post'
  },
  // 获取菜单树列表 /adminc/v1/resource_manage/p_menu/get_menu_cate_list
  getMenuTree: {
    url: '/api/v1/res/menu/get_tree',
    method: 'post'
  },
  // 新增菜单树分类 /adminc/v1/resource_manage/p_menu/create_menu_cate
  createMenuTreeClass: {
    url: '/api/v1/res/menu/create_menu_cate',
    method: 'post'
  },
  // 修改菜单树分类 /adminc/v1/resource_manage/p_menu/update_menu_cate
  updateMenuTreeClass: {
    url: '/api/v1/res/menu/update_menu_cate',
    method: 'put'
  },
  // 删除菜单树分类 /adminc/v1/resource_manage/p_menu/delete_menu_cate
  deleteMenuTreeClass: {
    url: '/api/v1/res/menu/delete_menu_cate',
    method: 'delete'
  }
}

export default openBuildService(settings)
