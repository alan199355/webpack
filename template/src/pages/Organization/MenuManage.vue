<template>
  <div class='menu-container'>

    <div class="content">
      <el-col :span="24">
        <el-col :span="5">
          <el-col :span="24">
            <div class="permission-tree"
                 style="margin-top:60px;">
              <MenuTree :curMenu.sync="menuNo"></MenuTree>
            </div>
          </el-col>
        </el-col>
        <el-col :span="19">
          <!-- <div class="menu-list"> -->
          <el-row class="menu-header">
            <el-col :span="10">
              &nbsp;
            </el-col>
            <el-col :span="12">
              <span style="margin-right:12px;margin-left:14px;">菜单名称</span>
              <el-input class="col-9"
                        v-model="requestParam.menu_name"
                        placeholder="请输入菜单名称">
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary"
                         class="search-button pull-right"
                         @click="getMenuList"
                         id="search-style">
                搜索
              </el-button>

            </el-col>
          </el-row>
          <el-table ref="menuTable"
                    @current-change="handleMenuChange"
                    :data="menuData.list"
                    row-key="menu_id"
                    :highlight-current-row="true"
                    :header-cell-style="{background:'#f5f5f5'}"
                    height="310"
                    border>
            <el-table-column prop="menu_name"
                             label="菜单名称"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="menu_type_name"
                             label="菜单类型"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="object_name"
                             label="所属权限项"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address"
                             label="访问地址"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="menu_css"
                             label="菜单图标"
                             align="center"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <i class="fa fa-2x"
                   :class="scope.row.menu_css"></i>
              </template>
            </el-table-column>
            <el-table-column prop="order_no"
                             label="排序"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作"
                             width="100"
                             align="center">
              <template slot-scope="scope">
                <el-button type="text"
                           @click="showMenuDialog('edit',scope)">
                  修改
                </el-button>

                <el-button type="text"
                           @click="handleDelete(scope)">
                  删除

                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:10px;">&nbsp;</div>
          <!-- <el-pagination id="pagination"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="requestParam.page"
                         :page-sizes="[10]"
                         :page-size="requestParam.page_size"
                         background
                         align="center"
                         layout="total,sizes,prev, pager, next, jumper"
                         :total="menuData.total_count">
          </el-pagination> -->

          <el-row>
            <el-col :span="3"
                    :offset="21"
                    style="margin-top:10px;">
              <el-button type="primary"
                         @click="showMenuDialog('add')"
                         class="create-button pull-right"
                         id="search-style">
                新增
              </el-button>
            </el-col>
          </el-row>
          <!-- </div> -->
        </el-col>
      </el-col>

    </div>
    <!-- 新增或编辑菜单弹框 -->
    <el-dialog :title="ontype=='add'?'新增菜单':'修改菜单'"
               :close-on-click-modal="false"
               width="40%"
               :visible.sync="menuDialogVisible">
      <el-form :model="menuDialogForm"
               label-width="80px"
               ref="editMenuForm"
               class="menu-dialog-form">
        <el-form-item label="菜单名称">
          <el-input v-model="menuDialogForm.menu_name"
                    class="col-8"
                    placeholder="请输入菜单名称">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单编码">
          <el-input v-model="menuDialogForm.menu_no"
                    class="col-8"
                    placeholder="请输入菜单编码">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="menu_type"
                     class="col-8"
                     placeholder="请选择菜单类型"
                     @change="chooseMenuType">
            <el-option v-for="item in arrMenu"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">

            </el-option>
            <!-- <el-option label="系统内菜单"
                       value="1">
            </el-option>
            <el-option label="外部菜单"
                       value="2">
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="权限项">
          <el-input v-model="menuDialogForm.object_name"
                    class="col-8"
                    disabled
                    placeholder="请选择所属权限项">
          </el-input>
          <i class="el-icon-share select-icon"
             @click="selectPermission"></i>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menuDialogForm.menu_css"
                    class="col-8"
                    disabled
                    placeholder="请选择菜单图标">
          </el-input>
          <i class="el-icon-share select-icon"
             @click="selectIcon"></i>
        </el-form-item>
        <el-form-item v-if="menuDialogForm.menu_type==='2'"
                      label="外部地址">
          <el-input v-model="menuDialogForm.outer_url"
                    class="col-8"
                    placeholder="请输入外部地址">
          </el-input>
        </el-form-item>
        <el-form-item v-if="menuDialogForm.menu_type==='1'"
                      label="前端路由"
                      prop="route_url">
          <el-input v-model="menuDialogForm.route_url"
                    class="col-8"
                    placeholder="请输入前端路由">
          </el-input>
        </el-form-item>
        <el-form-item label="排序"
                      prop="order_no">
          <el-input v-model="menuDialogForm.order_no"
                    class="col-8"
                    placeholder="请输入排序字段">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           id="footer-style">
        <el-button @click="menuDialogVisible = false,menu_type=''"
                   id="back-style">取 消</el-button>
        <el-button type="primary"
                   @click="handleEdit"
                   id="search-style">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog title="分配权限"
               width="20%"
               :close-on-click-modal="false"
               :visible.sync="assignPermissionVisible">
      <PermissionTree :showCheckbox="false"
                      :curPermissionNo.sync="permissionNo"></PermissionTree>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="assignPermissionVisible=false">取消</el-button>
        <el-button @click="assignPermissionVisible=false"
                   type="primary">确定</el-button>
      </div>
    </el-dialog>
    <FontAwesome :selectedIcon.sync="menuDialogForm.menu_css"
                 :isVisible.sync="selectIconDialogVisible"></FontAwesome>
  </div>
</template>
<script>
import { permissionApi, menuApi } from '@/services/UserPermission'
import MenuTree from '@/components/MenuTree/MenuTree'
import PermissionTree from '@/components/PermissionTree/PermissionTree'
import FontAwesome from '@/components/FontAwesome/FontAwesome'
export default {

  data () {
    return {
      currentRowRight: null,
      ontype: '', // 判断是新增还是修改
      menuData: {
        list: [],
        total_count: 0,
        total_page: 0
      },
      requestParam: {
        menu_no: '',
        menu_name: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      arrMenu: [{ name: '系统内菜单', value: '1' }, { name: '外部菜单', value: '2' }],
      // 新增或编辑菜单弹框是否可见
      menuDialogVisible: false,
      // 新增或编辑菜单弹框表单数据
      menu_type: '',
      menuDialogForm: {},
      // 判断是新增还是编辑
      menuDialogType: '',
      // 选择图标弹框是否可见
      selectIconDialogVisible: false,
      // 菜单树数据
      menuTree: [],
      // 选中的菜单编号
      menuNo: {},
      // 选择权限弹框是否可见
      assignPermissionVisible: false,
      // 权限树数据
      permissionTreeData: [],
      // 权限树请求参数
      permissionTreeParam: {
        type: 'all'
      },
      // 选中的权限编号
      permissionNo: {}
    }
  },
  components: {
    FontAwesome,
    MenuTree,
    PermissionTree
  },
  watch: {

    menuNo: {
      handler (newval, oldval) {
        // console.log(newval, oldval)
        if (newval.menu_no) {
          this.requestParam.menu_no = newval.menu_no
          this.menuNo = newval
          this.getMenuList()
        }
      },
      deep: true
    },
    permissionNo: {
      handler (newval, oldval) {
        // console.log('菜单管理_666666=', newval);
        if (newval.object_id) {
          this.menuDialogForm.object_id = newval.object_id
          this.menuDialogForm.object_name = newval.object_name
          this.menuDialogForm.menu_no = newval.object_no
          this.menuDialogForm.menu_name = newval.object_name
        }
      },
      deep: true
    }
  },
  methods: {
    // 背景色
    handleMenuChange (val) {
      this.currentRowRight = val
    },
    // 当前表格第一行数据的背景色
    setCurrent (row) {
      this.$refs.menuTable.setCurrentRow(row)
    },
    chooseMenuType (value) {
      this.menuDialogForm.menu_type = value
    },

    // 获取菜单列表
    getMenuList () {
      menuApi.getMenuList({
        data: {
          menu_no: this.requestParam.menu_no,
          menu_name: this.requestParam.menu_name
        }
      }).then(res => {
        if (res.data) {
          this.menuData.list = res.data
        }
        if (JSON.stringify(res.data) == '{}') {
          this.menuData.list = []
        }
        // if (res.data.list.length != 0) {
        //   this.setCurrent(res.data.list[0])
        // }
        if (res.data.length != 0) {
          this.setCurrent(res.data[0])
        }
      })
    },
    // 显示新增或编辑菜单弹框
    showMenuDialog (type, scope) {
      // 新增菜单类型的默认值为“系统内部菜单”
      let len = this.menuData.list.length
      this.permissionNo = {}
      if (type === 'add') {
        this.ontype = 'add'
        this.menuDialogForm = {}
        this.menuDialogForm.p_menu_no = this.menuNo.menu_no
        this.menuDialogForm.menu_type = '1'
        this.menuDialogForm.order_no = len == 0 ? '1' : String(Number(this.menuData.list[len - 1].order_no) + 1)
      } else {
        this.ontype = 'edit'
        this.menuDialogForm = JSON.parse(JSON.stringify(scope.row))
        this.menuDialogForm.menu_type = scope.row.menu_type
      }
      this.menuDialogVisible = true

      this.menuDialogType = type
    },
    // 调用新增或编辑菜单接口
    handleEdit () {
      // this.menuDialogForm.system_no = 'ggzx'
      if (this.menuDialogType === 'add') {
        this.menuDialogForm.menu_type = this.menu_type
        // this.menuDialogForm.outer_url = this.menuDialogForm.address
        // delete this.menuDialogForm.address
        delete this.menuDialogForm.object_name
        menuApi.createMenu({
          data: this.menuDialogForm
        }).then(res => {
          // console.log(res, 'create menu')
          if (res.code === 0) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.menuDialogVisible = false
            this.$refs.editMenuForm.resetFields()
            this.getMenuList()
          }
        })
      } else {
        delete this.menuDialogForm.object_name
        delete this.menuDialogForm.menu_type_name
        this.menuDialogForm.menu_type = this.menu_type
        // this.menuDialogForm.outer_url = this.menuDialogForm.address
        // delete this.menuDialogForm.address
        menuApi.updateMenu({
          data: this.menuDialogForm
        }).then(res => {
          // console.log(res, 'update menu')
          if (res.code === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.menuDialogVisible = false
            this.getMenuList()
            this.$refs.editMenuForm.resetFields()
          }
        })
      }
    },
    // 删除菜单-确认
    handleDelete (scope) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMenu(scope.row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      })
    },
    // 删除菜单-调用接口
    deleteMenu (menu) {
      menuApi.deleteMenu({
        data: {
          menu_id: menu.menu_id
          // menu_no: menu.menu_no,
          // system_no: menu.system_no
        }
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getMenuList()
        }
      })
    },
    // 打开选择图标样式弹窗
    selectIcon () {
      this.selectIconDialogVisible = true
    },
    // 获取菜单树数据
    getMenuTree () {
      menuApi.getMenuTree({
        data: {
          is_tab: 2
        }
      }).then(res => {
        // console.log('treeA', res)
        if (res.code === 0) {
          this.menuTree = res.data
          this.$store.dispatch('setMenuTree', this.menuTree)
          window.localStorage.setItem('menuTree', JSON.stringify(this.menuTree))
        }
      })
    },
    handleSizeChange (size) {

    },
    handleCurrentChange (current) {
      this.requestParam.page = current
      this.getMenuList()
    },
    selectPermission () {
      this.assignPermissionVisible = true
    },
    // 获取权限树数据
    getPermissionTreeData () {
      permissionApi.getPermissionTree({
        data: {
          type: 'all'
        }
      }).then(res => {
        this.permissionTreeData = res.data
        this.$store.dispatch('setPermissionTree', this.permissionTreeData)
        window.localStorage.setItem('permissionTree', JSON.stringify(this.permissionTreeData))
      })
    }
  },
  created () {
    // this.getMenuList()
    this.getMenuTree()
    this.getPermissionTreeData()
  },
  mouted () {
  }
}
</script>
<style scoped lang='scss'>
.col-8 {
  width: 90% !important;
}
#footer-style {
  text-align: center;
  margin-top: -30px;
}
#back-style {
  // margin-right: 15px;
  // color: white;
  // background: rgba(26, 188, 156, 1);
}
#search-style {
}
/deep/ #pagination .el-pager .active {
  background: #1abc9c;
  color: white;
}
/deep/ #pagination .el-pager .active:hover {
  color: #fff;
}
/deep/ #pagination .el-pager li:hover {
  color: #1abc9c;
}
/deep/ .el-table__body tr.current-row > td {
  background: #1890ff;
  color: #fff;
}
/deep/ .el-table__body tr.current-row > td .el-button {
  color: #fff;
}
.menu-container {
  padding: 20px;
  background: #ffffff;
  .el-form-item__content {
    display: flex;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .menu-header {
    margin-bottom: 20px;
  }
  .content {
    display: flex;

    .permission-tree {
      width: 300px;
      height: auto;
      min-height: 260px;
    }
    .menu-list {
      flex-grow: 1;
      margin: 0 20px;
      .el-table {
        margin-bottom: 20px;
      }
    }
  }
  .menu-dialog-form {
    .select-icon {
      font-size: 30px;
      margin-left: 5px;
      transform: translateY(5px);
    }
  }
}
</style>
