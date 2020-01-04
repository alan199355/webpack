/* eslint-disable eqeqeq */
<template>
  <div class="organization-tree-container">

    <el-input style="margin-bottom:10px"
              placeholder="搜索分类"
              prefix-icon="el-icon-search"
              v-model="filterText"></el-input>
    <div style="height:400px;overflow-y:auto;">
      <el-tree class="treeShow"
               :data="menuTree"
               :props="defaultProps"
               label="name"
               node-key="id"
               ref="organizationTree"
               :highlight-current="true"
               :filter-node-method="filterNode"
               :expand-on-click-node="true"
               @node-click="getId"
               @node-contextmenu="rihgtClick"
               :default-expanded-keys="selectedNodeList"
               :auto-expand-parent="false"
               draggable
               :accordion="false"
               :check-strictly="true"
               :show-checkbox="checkbox">
        <span class="slot-t-node"
              slot-scope="{ node, data }">
          <span v-show="!node.isEdit">
            <span v-show="data.children_list && data.children_list.length >= 1">
              <i class="fa"
                 :class="{'fa-building':data.node_type==='1','fa-institution':data.node_type==='2','fa-user-circle':data.node_type==='3'}" />
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.name">{{data.name}}</span>
            </span>
            <!-- 当树形节点不存在子节点时，设置单独的图标 -->
            <span v-show="!data.children_list || data.children_list.length == 0">
              <i class="fa"
                 :class="{'fa-building':data.node_type==='1','fa-institution':data.node_type==='2','fa-user-circle':data.node_type==='3'}"></i>
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.name">{{data.name }}</span>
            </span>
          </span>
          <!-- 编辑输入框 -->
          <span v-show="node.isEdit">
            <el-input class="slot-t-input"
                      size="mini"
                      autofocus
                      v-model="data.name"
                      :ref="'slotTreeInput'+data.id"
                      @blur.stop="NodeBlur(node, data)"
                      @keyup.enter.native="NodeBlur(node, data)"></el-input>
          </span>
        </span>
      </el-tree>
    </div>

    <!--鼠标右键点击出现页面-->
    <div v-show="menuVisible">
      <el-menu id="rightClickMenu"
               class="el-menu-vertical"
               @select="handleRightSelect"
               active-text-color="#fff"
               text-color="#fff">
        <!-- 根据不同的状态，显示不同的右键自定义菜单（岗位与非岗位状态） -->
        <el-menu-item index="1"
                      v-show="DATA.node_type==='1'"
                      class="menuItem">
          <i class="el-icon-plus" />
          <span slot="title">新增子单位</span>
        </el-menu-item>
        <el-menu-item index="2"
                      class="menuItem"
                      v-show="DATA.node_type!=='3'">
          <i class="el-icon-edit" />
          <span slot="title">新增部门</span>
        </el-menu-item>
        <el-menu-item index="3"
                      class="menuItem"
                      v-show="DATA.node_type==='2'">
          <i class="el-icon-edit" />
          <span slot="title">新增岗位</span>
        </el-menu-item>
        <el-menu-item index="6"
                      class="menuItem"
                      v-show="DATA.node_type==='3'">
          <i class="el-icon-edit" />
          <span slot="title">分配人员</span>
        </el-menu-item>
        <el-menu-item index="7"
                      class="menuItem"
                      v-show="DATA.node_type==='3'">
          <i class="el-icon-edit" />
          <span slot="title">分配权限模板</span>
        </el-menu-item>
        <el-menu-item index="4"
                      class="menuItem">
          <i class="el-icon-circle-plus-outline" />
          <span slot="title">修改</span>
        </el-menu-item>
        <el-menu-item index="5"
                      class="menuItem">
          <i class="el-icon-menu" />
          <span slot="title">删除</span>
        </el-menu-item>

      </el-menu>
    </div>
    <!-- 新增或修改单位弹框 -->
    <EditOrgDialog @callback="editCallback"
                   :dialogVisible.sync="editOrgDialogVisible"
                   :dialogForm="editOrgDialogForm"
                   :dialogStatus.sync="editOrgDialogStatus"></EditOrgDialog>
    <!-- 新增或修改部门弹框 -->
    <EditDeptDialog @callback="editCallback"
                    :dialogVisible.sync="editDeptDialogVisible"
                    :dialogForm="editDeptDialogForm"
                    :dialogStatus.sync="editDeptDialogStatus"></EditDeptDialog>
    <!-- 新增或修改岗位弹框 -->
    <EditJobDialog @callback="editCallback"
                   :dialogVisible.sync="editJobDialogVisible"
                   :dialogForm="edittJobDialogForm"
                   :dialogStatus.sync="editJobDialogStatus"></EditJobDialog>
  </div>
</template>
<script>

import { userPermissionApi } from '@/services/UserPermission'
import EditOrgDialog from './components/EditOrgDialog'
import EditDeptDialog from './components/EditDeptDialog'
import EditJobDialog from './components/EditJobDialog'
export default {
  name: 'leftTree',

  data () {
    return {
      judge: '',
      filterText: '',
      NODE: {},
      DATA: {},
      maxexpandId: 95, // 新增节点开始id
      non_maxexpandId: 95, // 新增节点开始id(不更改)
      isLoadingTree: true, // 是否加载节点树
      //   setTree:api.treelist,//节点树数据
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: (data) => {
          return data.node_type !== '3'
        }
      },
      menuVisible: false,
      objectID: null,

      // 编辑或新增
      addOrEdit: 'add',
      // 选中的节点列表，用于刷新后展开到指定位置
      selectedNodeList: [],
      // 编辑单位弹框是否可见
      editOrgDialogVisible: false,
      // 编辑单位弹框数据对象
      editOrgDialogForm: {

      },
      // 编辑单位弹框处于新增或修改状态
      editOrgDialogStatus: 'create',
      // 编辑部门弹框是否可见
      editDeptDialogVisible: false,
      // 编辑部门弹框数据对象
      editDeptDialogForm: {

      },
      // 编辑单位弹框处于新增或编辑状态
      editDeptDialogStatus: 'create',
      // 编辑岗位弹框是否可见
      editJobDialogVisible: false,
      // 编辑岗位弹框数据对象
      edittJobDialogForm: {

      },
      // 编辑岗位弹框处于新增或编辑状态
      editJobDialogStatus: 'create',
      requestParam: {
        node_no: '',
        node_type: ''
      }
    }
  },
  props: {
    curMenu: Object,
    assignedNode: Object,
    assignedTemplateNode: Object,
    // 复选框
    checkbox: {
      type: Boolean,
      default: false
    },
    // 是否启用右键菜单编辑功能
    rightMenu: {
      type: Boolean,
      default: true
    }
  },
  components: {
    EditOrgDialog,
    EditDeptDialog,
    EditJobDialog
  },
  methods: {
    // 新增
    onAdd () {
      this.judge = 1
    },
    onEdit () {
      this.judge = 2
    },
    // 节点点击事件获取id
    getId (data, node) {
      // console.log(data, 'click')
      let curData = JSON.parse(JSON.stringify(data))
      // console.log(curData.children_list)
      this.menuVisible = false
      this.$emit('update:curMenu', curData)

      if ((node.expanded || node.childNodes.length === 0) && data.id) {
        this.addNodeList(data.id)
      } else {
        this.removeNodeList(data.id)
      }
    },
    // 当当前节点是展开操作时,将当前节点的object_id添加到selectedNodeList中，为了刷新数据后能够展开到指定位置
    addNodeList (id) {
      let index = this.selectedNodeList.indexOf(id)
      if (index < 0) {
        this.selectedNodeList.push(id)
      }
    },
    // 当前节点是收起操作时，将当前节点的object_id从selectedNodeList中移除
    removeNodeList (id) {
      let index = this.selectedNodeList.indexOf(id)
      if (index >= 0) {
        this.selectedNodeList.splice(index, 1)
      }
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      console.log('value:', value)
      console.log('data:', data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 右键点击事件
    rihgtClick (event, object, value, element) {
      this.DATA = object
      this.NODE = value
      if (this.rightMenu) {
        this.menuVisible = !this.menuVisible
        console.log(object, value, 'right')
        document.addEventListener('click', e => {
          this.menuVisible = false
        })
        let menu = document.querySelector('#rightClickMenu')
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 - 200 + 'px'
        menu.style.top = event.clientY - 35 + 'px'
        menu.style.position = 'absolute' // 为新创建的DIV指定绝对定位
        menu.style.width = 160 + 'px'
      }
    },
    // 右键弹出的菜单点击事件
    handleRightSelect (key) {
      if (key === '1') {
        // 新增子单位
        this.editOrg('create')
      } else if (key === '2') {
        // 新增部门
        this.editDept('create')
      } else if (key === '3') {
        // 新增岗位
        this.editJob('create')
      } else if (key === '4') {
        // 修改，需要区分单位、部门、岗位
        // node_type为1是单位，2是部门，3是岗位
        if (this.DATA.node_type === '1') {
          this.editOrg('update')
        } else if (this.DATA.node_type === '2') {
          this.editDept('update')
        } else if (this.DATA.node_type === '3') {
          this.editJob('update')
        }
      } else if (key === '5') {
        // 删除功能，需要区分单位、部门、岗位
        this.NodeDel(this.NODE, this.DATA)
      } else if (key === '6') {
        // 分配人员
        this.$emit('update:assignedNode', this.DATA)
      } else if (key === '7') {
        // 分配权限模板
        this.$emit('update:assignedTemplateNode', this.DATA)
      }
      this.menuVisible = false
    },
    NodeBlur (n, d) {
      // 输入框失焦
      if (n.isEdit) {
        this.$set(n, 'isEdit', false)
      }
      this.$nextTick(() => {
        this.$refs['slotTreeInput' + d.id].$refs.input.focus()
      })
    },
    NodeDel (n, d) {
      // 删除节点
      console.log(d, 'delete tree')
      if (d.children && d.children.length !== 0) {
        this.$message.error('此菜单有子菜单，不可删除！')
        return false
      } else {
        // 二次确认
        let ConfirmFun = () => {
          this.$confirm('是否删除此菜单？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (this.DATA.node_type === '1') {
                this.deleteOrg()
              } else if (this.DATA.node_type === '2') {
                this.deleteDept()
              } else if (this.DATA.node_type === '3') {
                this.deleteJob()
              }
            })
            .catch(() => { })
        }
        // 判断是否是新增节点
        ConfirmFun()
      }
    },
    // 新增或修改单位弹框
    editOrg (type) {
      this.editOrgDialogVisible = true
      this.editOrgDialogForm = this.DATA
      this.editOrgDialogStatus = type
    },
    // 新增或修改部门弹框
    editDept (type) {
      this.editDeptDialogVisible = true
      this.editDeptDialogForm = this.DATA
      this.editDeptDialogStatus = type
    },
    // 新增或修改岗位弹框
    editJob (type) {
      this.editJobDialogVisible = true
      this.edittJobDialogForm = this.DATA
      this.editJobDialogStatus = type
    },
    // 删除单位
    deleteOrg () {
      userPermissionApi.deleteOrg({
        data: {
          org_id: this.DATA.id,
          org_no: this.DATA.org_no
        }
      }).then(res => {
        console.log(res, 'delete org')
        if (res.code === 0) {
          this.$message.success('删除单位成功')
          this.getOrganizationTree()
        }
      })
    },
    // 删除部门
    deleteDept () {
      userPermissionApi.deleteDept({
        data: {
          dept_id: this.DATA.id,
          dept_no: this.DATA.no
        }
      }).then(res => {
        console.log(res, 'delete dept')
        if (res.code === 0) {
          this.$message.success('删除部门成功')
          this.getOrganizationTree()
        }
      })
    },
    // 删除岗位
    deleteJob () {
      userPermissionApi.deleteJob({
        data: {
          job_id: this.DATA.id
        }
      }).then(res => {
        console.log(res, 'delete job')
        if (res.code === 0) {
          this.$message.success('删除岗位成功')
          this.getOrganizationTree()
        }
      })
    },
    // 处理传入的数据，因为后端都是children_list，需要手动赋值一个children字段
    handelData (arr, parentCompany, topCompany, parent) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        arr.map((item) => {
          // 当前item为部门时，为其添加其直属公司的org_no及org_name
          // 当前item为岗位时，添加部门信息，直属公司信息，总公司信息
          // 为所有子节点赋值company_name
          if (item.node_type === '1') {
            parentCompany = {
              org_no: item.org_no,
              org_name: item.name
            }
          } else if (item.node_type === '2') {
            item.p_org_no = parentCompany.org_no
            item.p_org_name = parentCompany.org_name
          } else if (item.node_type === '3') {
            item.dept_no = parent.no
            item.dept_name = parent.name
            item.p_org_no = parentCompany.org_no
            item.p_org_name = parentCompany.org_name
            item.company_id = parent.company_id
          }
          if (!topCompany) {
            topCompany = item.name
          } else {
            item.company_name = topCompany
          }
          if (item.children_list) {
            item.children = item.children_list
            this.handelData(item.children_list, parentCompany, topCompany, item)
          } else if (item.childrens) {
            item.children = item.childrens
            this.handelData(item.childrens, parentCompany, topCompany, item)
          } else if (item.children) {
            this.handelData(item.children, parentCompany, topCompany, item)
          }

          if (item.sid) {
            item.menu_id = item.sid
          }
          if (item.menu_id === '') {
            item.menu_id = '0'
          }
        })
        return arr
      }
    },
    // 获取组织树
    getOrganizationTree () {
      userPermissionApi.getOrganizationTree({
        data: this.requestParam
      }).then(res => {
        if (res.code === 0) {
          this.$store.dispatch('setOrgainzationTree', res.data)
          window.localStorage.setItem('platformOrganizationTree', JSON.stringify(res.data))
        }
      })
    },
    // 编辑成功回调
    editCallback () {
      this.getOrganizationTree()
    }
  },
  watch: {
    filterText (val) {
      this.$refs.organizationTree.filter(val)
    }

  },
  computed: {
    menuTree () {
      let store = this.$store.state.orgainzationTree
      let storage = JSON.parse(window.localStorage.getItem('platformOrganizationTree')) || []
      let treeData = store.length > 0 ? store : storage
      if (Object.prototype.toString.call(treeData) === '[object Array]') {
        treeData = this.handelData(treeData, {}, '', {})
      } else {
        treeData = this.handelData([treeData], {}, '', {})
      }

      return treeData
    }
  },
  created () {
    // this.treelist=this.messageinfo
    this.selectedNodeList = []
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
/* 去掉默认的树形图标 */
/* .treeShow /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
  display: none;
} */
#save-style {
  background: rgba(26, 188, 156, 1);
  color: white;
}
#back-style {
  background: rgba(26, 188, 156, 1);
}
#show-ellipsis {
  //display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.popover-new {
  /* position: absolute!important;
    right: 0;
    bottom: 0; */
}
/*顶部按钮*/
.slot-tree .slot-t-top {
  margin-bottom: 15px;
}
.slot-tree .slot-t-node span {
  display: inline-block;
}
/*节点*/
.slot-tree .slot-t-node--label {
  font-weight: 600;
}
/*输入框*/
.slot-tree .slot-t-input .el-input__inner {
  height: 26px;
  line-height: 26px;
}
/*按钮列表*/
.slot-tree .slot-t-node .slot-t-icons {
  display: none;
  margin-left: 10px;
}
.slot-tree .slot-t-icons .el-button + .el-button {
  margin-left: 6px;
}
.slot-tree .el-tree-node__content:hover .slot-t-icons {
  display: inline-block;
}

/*************************标签鼠标右击页面样式******************************/
.el-menu-vertical {
  /* border: 3px solid rgb(84, 92, 100); */
  border: 2px solid #f5f7fa;
  border-radius: 10px;
  z-index: 100;
}
.el-menu-vertical i {
  color: #777777;
}
.menuItem {
  height: 40px;
  line-height: 40px;
  /* background-color: #545c64; */
  background-color: #f5f7fa;
  font-size: 14px;
}
/deep/ .menuItem i {
  color: #606266 !important;
}
/deep/ .menuItem span {
  color: #606266 !important;
}
.menuItem:hover {
  background-color: #409eff;
}
/deep/ .menuItem:hover i {
  color: #fff !important;
}

/deep/ .menuItem:hover span {
  color: #fff !important;
}
.add_tips /deep/ .el-form-item__label {
  /* padding-left: 28px; */
}
.organization-tree-container {
  margin-top: 20px;
  width: 300px;
  min-height: 260px;
  background-color: #fff;
}
</style>
