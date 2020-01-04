/* eslint-disable eqeqeq */
<template>
  <div class="permission-tree-container">

    <el-input style="margin-bottom:10px"
              placeholder="搜索分类"
              prefix-icon="el-icon-search"
              v-model="filterText">
    </el-input>
    <div style="height:400px;overflow-y:auto;">
      <el-tree class="treeShow"
               :data="permissionTree"
               :props="defaultProps"
               label="object_name"
               node-key="object_id"
               ref="permissionList"
               :highlight-current="true"
               :filter-node-method="filterNode"
               @node-contextmenu="rihgtClick"
               @node-click="getId"
               draggable
               :show-checkbox="showCheckbox"
               @check-change="assignPermission"
               :default-expanded-keys="selectedNodeList"
               :accordion="false"
               :auto-expand-parent="false"
               :check-strictly="true">
        <span class="slot-t-node"
              slot-scope="{ node, data }">
          <span v-show="!node.isEdit">
            <span v-show="data.children_list && data.children_list.length >= 1">
              <!-- <i :class="{'el-icon-time':node.level<=1,'el-icon-bell':node.level>1&&node.level<=2,'el-icon-service':node.level>2}" /> -->
              <i :class="{ 'el-icon-plus':!node.expanded,'el-icon-minus':node.expanded}" />
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.system_name||data.object_name">{{data.system_name || data.object_name}}</span>
            </span>
            <!-- 当树形节点不存在子节点时，设置单独的图标 -->
            <span v-show="!data.children_list || data.children_list.length == 0">
              <i class="el-icon-document"></i>
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.system_name||data.object_name">{{data.system_name || data.object_name}}</span>
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
                      class="menuItem">
          <i class="el-icon-plus"
             style="color:#fff" />
          <span slot="title"
                @click="onAdd">新增</span>
        </el-menu-item>
        <el-menu-item index="2"
                      v-if="DATA.object_id"
                      class="menuItem">
          <i class="el-icon-edit"
             style="color:#fff" />
          <span slot="title"
                @click="onEdit">修改</span>
        </el-menu-item>
        <el-menu-item index="3"
                      v-if="DATA.object_id"
                      class="menuItem">
          <i class="el-icon-delete"
             style="color:#fff" />
          <span slot="title">删除</span>
        </el-menu-item>

      </el-menu>
    </div>
    <!-- 新增或修改子节点    :title="judge==1?'新增权限项':'修改权限项'"-->
    <el-dialog :visible.sync="addSonUnitDialog"
               :close-on-click-modal="false"
               :title="judge==1?'新增权限项':'修改权限项'"
               width="45%">
      <el-form :model="sonUnitform"
               :inline="true">
        <el-form-item label="权限编号">
          <el-input v-model="sonUnitform.object_no"
                    autocomplete="off"
                    :disabled="addOrEdit==='edit'"
                    placeholder="请输入权限编号"></el-input>
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="sonUnitform.object_name"
                    autocomplete="off"
                    style="float:right;"
                    placeholder="请输入权限名称"></el-input>
        </el-form-item>

      </el-form>
      <div style="text-align:center;">
        <el-button type="primary"
                   @click="addSonUnitDialog= false"
                   id="save-style">返 回</el-button>
        <el-button @click="addPermissionTreeNode"
                   id="back-style">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { permissionApi } from '@/services/UserPermission'
export default {
  name: 'leftTree',

  data () {
    return {
      judge: '', // 新增/修改
      info: this.messageinfo,

      work: false,
      filterText: '',
      addSonUnitDialog: false,
      addDepDialog: false,
      addJobDialog: false,
      DATA: {},
      NODE: {},
      maxexpandId: 95, // 新增节点开始id
      non_maxexpandId: 95, // 新增节点开始id(不更改)
      isLoadingTree: true, // 是否加载节点树
      //   setTree:api.treelist,//节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuVisible: false,
      objectID: null,
      // 子单位
      sonUnitform: {
        object_name: '',
        object_no: '',
        object_id: '',
        p_object_no: ''
      },
      // 编辑或新增
      addOrEdit: 'add',
      // 部门
      departmentForm: {
        name: '',
        tips: ''
      },
      // 岗位
      JobForm: {
        name: '',
        tips: ''
      },
      permissionTreeParam: {
        type: 'dir'
      },
      permissionTreeData: [],
      deletePermissionTreeParam: {

      },
      // 选中的权限列表
      assignPermissionList: [],
      // 选中的节点列表，用于刷新后展开到指定位置
      selectedNodeList: []
    }
  },
  props: {
    curPermissionNo: Object,
    curPermissionIds: Array,
    showCheckbox: Boolean,
    isVisible: Boolean
  },
  methods: {
    onAdd () {
      this.judge = 1
    },
    onEdit () {
      this.judge = 2
    },
    // 节点点击事件获取id
    getId (data, node) {
      let curData = JSON.parse(JSON.stringify(data))
      this.menuVisible = false

      if ((node.expanded || node.childNodes.length === 0) && data.object_id) {
        this.addNodeList(data.object_id)
      } else {
        this.removeNodeList(data.object_id)
      }
      if (curData.object_no) {
        // if (this.selectedNodeList.indexOf(curData.object_id) < 0) {
        //   this.selectedNodeList.push(curData.object_id)
        // }
        this.$emit('update:curPermissionNo', curData)
      }
      // console.log(this.selectedNodeList, 'selected node list')
    },
    // 当当前节点是展开操作时,将当前节点的object_id添加到selectedNodeList中，为了刷新数据后能够展开到指定位置
    addNodeList (objectId) {
      let index = this.selectedNodeList.indexOf(objectId)
      if (index < 0) {
        this.selectedNodeList.push(objectId)
      }
    },
    // 当前节点是收起操作时，将当前节点的object_id从selectedNodeList中移除
    removeNodeList (objectId) {
      let index = this.selectedNodeList.indexOf(objectId)
      if (index >= 0) {
        this.selectedNodeList.splice(index, 1)
      }
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      if (!value) return true
      if (data.object_name) {
        return data.object_name.indexOf(value) !== -1
      } else {
        return data.system_name.indexOf(value) !== -1
      }
    },
    // 右键弹出的菜单点击事件
    handleRightSelect (key) {
      // console.log(key === 1)
      if (key == 1) {
        this.NodeAdd(this.NODE, this.DATA)
        this.menuVisible = false // 关闭右键打开的操作菜单
      } else if (key == 2) {
        this.NodeEdit(this.NODE, this.DATA)
        this.menuVisible = false
      } else if (key == 3) {
        this.NodeDel(this.NODE, this.DATA)
        this.menuVisible = false
      } else if (key == 4) {
        this.menuVisible = false
        this.addSonUnitDialog = true
      } else if (key == 5) {
        this.menuVisible = false
        this.addDepDialog = true
      } else if (key == 6) {
        this.menuVisible = false
        this.addJobDialog = true
      }
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
    NodeEdit (n, d) {
      // console.log(n, d);
      this.judge = 2
      this.addOrEdit = 'edit'
      this.addSonUnitDialog = true
      this.sonUnitform.object_name = d.object_name
      this.sonUnitform.object_no = d.object_no
      this.sonUnitform.p_object_no = d.p_object_no
      this.sonUnitform.object_id = d.object_id
      this.sonUnitform.system_no = d.system_no
      // 编辑节点
      // if (!n.isEdit) {
      //   //检测isEdit是否存在or是否为false
      //   this.$set(n, "isEdit", true);
      // }
    },
    NodeDel (n, d) {
      // 删除节点
      if (d.children && d.children.length !== 0) {
        this.$message.error('此权限项有子级，不可删除！')
        return false
      } else {
        // 新增节点可直接删除，已存在的节点要二次确认
        // 删除操作
        let DelFun = () => {
          let _list = n.parent.data.children || n.parent.data // 节点同级数据
          let _index = _list.map(c => c.id).indexOf(d.id)
          _list.splice(_index, 1)
          this.$message.success('删除成功！')
        }
        // 二次确认
        let ConfirmFun = () => {
          this.$confirm('是否删除此权限项？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deletePermissionTreeParam.object_id = d.object_id
              this.deletePermissionTreeParam.object_no = d.object_no
              this.deletePermissionTreeParam.system_no = d.system_no
              this.deletePermissionTreeNode()
            })
            .catch(() => { })
        }
        // 判断是否是新增节点
        d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
      }
    },
    NodeAdd (n, d) {
      // 新增节点
      // console.log(n, d)
      this.judge = 1
      this.addOrEdit = 'add'
      this.sonUnitform = {}
      this.sonUnitform.p_object_no = d.object_no
      this.sonUnitform.system_no = d.system_no
      this.addSonUnitDialog = true
      // 判断层级
      // if (n.level >= 3) {
      //   this.$message.error("最多只支持三级！");
      //   return false;
      // }
    },
    // 右键点击事件
    rihgtClick (event, object, value, element) {
      this.DATA = object
      this.NODE = value
      this.menuVisible = !this.menuVisible
      document.addEventListener('click', e => {
        this.menuVisible = false
      })
      let menu = document.querySelector('#rightClickMenu')
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 - 200 + 'px'
      menu.style.top = event.clientY - 15 + 'px'
      menu.style.position = 'absolute' // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + 'px'
    },
    // 处理传入的数据，因为后端都是children_list，需要手动赋值一个children字段
    handelData (arr) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        arr.map((item) => {
          if (item.is_dir === '1') {
            item.disabled = true
          } else {
            item.disabled = false
          }
          if (item.sid) {
            item.object_id = item.sid + item.system_no
          }
          if (item.object_id === '') {
            item.object_id = '0'
          }
          if (item.children_list) {
            item.children = item.children_list
            this.handelData(item.children_list)
          }
        })
        return arr
      }
    },
    // 调用权限项分类新增或编辑接口
    addPermissionTreeNode () {
      if (this.addOrEdit === 'add') {
        permissionApi.addPermissionTreeClass({
          data: this.sonUnitform
        }).then(res => {
          // console.log(res, 'add permission class')
          if (res.code === 0) {
            this.$message.success('新增权限项分类成功')
            this.addSonUnitDialog = false
            this.getPermissionTreeData()
          }
        })
      } else {
        permissionApi.editPermissionTreeClass({
          data: this.sonUnitform
        }).then(res => {
          // console.log(res, 'edit permission class')
          if (res.code === 0) {
            this.$message.success('修改权限项分类成功')
            this.addSonUnitDialog = false
            this.getPermissionTreeData()
          }
        })
      }
    },

    // 删除权限项分类
    deletePermissionTreeNode () {
      permissionApi.deletePermissionTreeClass({
        data: this.deletePermissionTreeParam
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除权限成功')
          this.getPermissionTreeData()
        }
      })
    },
    // 获取权限树数据
    getPermissionTreeData () {
      permissionApi.getPermissionTree({
        data: {
          type: 'dir'
        }
      }).then(res => {
        if (res.code === 0) {
          this.permissionTreeData = res.data
          this.$store.dispatch('setPermissionTree', this.permissionTreeData)
          window.localStorage.setItem('industryPermissionTree', JSON.stringify(this.permissionTreeData))
        }
      })
    },
    // 选择分配的权限
    assignPermission (data, isChecked) {
      // console.log(data, isChecked)
      let list = this.$refs.permissionList.getCheckedNodes()
      this.$emit('update:curPermissionIds', list)
    }
  },
  watch: {
    filterText (val) {
      this.$refs.permissionList.filter(val)
    },
    messageinfo (newValue, oldValue) {
      this.info = newValue
      // console.log('===', newValue)
    },
    isVisible (newVal, oldVal) {
      this.$refs.permissionList.setCheckedKeys([])
    }
  },
  computed: {
    permissionTree () {
      let store = this.$store.state.permissionTree
      let storage = JSON.parse(window.localStorage.getItem('industryPermissionTree')) || []
      let treeData = store.length > 0 ? store : storage
      if (treeData) {
        treeData = this.handelData(treeData)
      } else {
        this.getPermissionTreeData()
      }

      // console.log(treeData, 'treedata')
      return treeData
    }
  },
  created () {
    // this.treelist=this.messageinfo
    let storage = window.localStorage.getItem('industryPermissionTree')

    this.selectedNodeList = []
    if (!storage) {
      this.getPermissionTreeData()
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
#save-style {
  background: rgba(26, 188, 156, 1);
}
#back-style {
  color: white;
  background: rgba(26, 188, 156, 1);
}
/* 去掉默认的树形图标 */
/* .treeShow /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
  display: none;
} */

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
  // height: 26px;
  // line-height: 26px;
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
  border: 3px solid rgb(84, 92, 100);
  border-radius: 10px;
  z-index: 100;
}
.el-menu-vertical i {
  color: #777777;
}
.menuItem {
  height: 40px;
  line-height: 40px;
  background-color: #545c64;
  font-size: 1.2rem;
}
.menuItem:hover {
  background-color: #409eff;
}
.add_tips /deep/ .el-form-item__label {
  padding-left: 28px;
}
.permission-tree-container {
  width: auto;
  .el-tree {
    min-height: 300px;
    height: auto;
  }
}
</style>
