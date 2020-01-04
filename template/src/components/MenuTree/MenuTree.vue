/* eslint-disable eqeqeq */
<template>
  <div class="menu-tree-container">

    <el-input style="margin-bottom:10px"
              placeholder="搜索分类"
              prefix-icon="el-icon-search"
              v-model="filterText"></el-input>
    <div style="height:400px;overflow-y:auto;">
      <el-tree class="treeShow"
               :data="menuTree"
               :props="defaultProps"
               label="menu_name"
               node-key="menu_id"
               ref="menuList"
               :highlight-current="true"
               :filter-node-method="filterNode"
               :expand-on-click-node="true"
               @node-contextmenu="rihgtClick"
               @node-click="getId"
               :default-expanded-keys="selectedNodeList"
               :auto-expand-parent="false"
               draggable
               :accordion="false">
        <span class="slot-t-node"
              slot-scope="{ node, data }">
          <span v-show="!node.isEdit">
            <span v-show="data.children_list && data.children_list.length >= 1">
              <!-- <i :class="{'el-icon-time':node.level<=1,'el-icon-bell':node.level>1&&node.level<=2,'el-icon-service':node.level>2}" /> -->
              <i :class="{ 'el-icon-plus':!node.expanded,'el-icon-minus':node.expanded}" />
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.system_name||data.menu_name">{{data.system_name || data.menu_name}}</span>
            </span>
            <!-- 当树形节点不存在子节点时，设置单独的图标 -->
            <span v-show="!data.children_list || data.children_list.length == 0">
              <i class="el-icon-document"></i>
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']"
                    :title="data.system_name||data.menu_name">{{data.system_name || data.menu_name}}</span>
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
                      class="menuItem">
          <i class="el-icon-edit"
             style="color:#fff" />
          <span slot="title"
                @click="onEdit">修改</span>
        </el-menu-item>
        <el-menu-item index="3"
                      class="menuItem">
          <i class="el-icon-delete"
             style="color:#fff" />
          <span slot="title">删除</span>
        </el-menu-item>

      </el-menu>
    </div>
    <!-- 新增或修改子节点 -->
    <el-dialog :visible.sync="addSonUnitDialog"
               :close-on-click-modal="false"
               :title="judge==1?'新增菜单':'修改菜单'"
               width="45%">
      <el-form :model="sonUnitform"
               ref="editMenuForm"
               label-width="75px">
        <el-form-item label="菜单编号">
          <el-input v-model="sonUnitform.menu_no"
                    autocomplete="off"
                    class="col-6"
                    style="width:100%!important;"
                    placeholder="请输入菜单编号">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="sonUnitform.menu_name"
                    autocomplete="off"
                    class="col-6"
                    style="width:100%!important;"
                    placeholder="请输入菜单名称">
          </el-input>

        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="sonUnitform.menu_css"
                    autocomplete="off"
                    class="col-6"
                    style="width:92%!important;"
                    placeholder="请输入菜单图标">
          </el-input>
          <i class="el-icon-share select-icon"
             @click="selectIconDialogVisible=true"></i>
        </el-form-item>
        <!-- <el-form-item label="前端路由">
          <el-input v-model="sonUnitform.route_url"
                    class="col-6"
                    placeholder="请输入前端路由">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div style="text-align:center;">
        <el-button type="primary"
                   @click="addSonUnitDialog= false"
                   id="search-style">返 回</el-button>
        <el-button @click="addMenuTreeNode"
                   id="save-style">保 存</el-button>
      </div>
    </el-dialog>
    <FontAwesome :selectedIcon.sync="sonUnitform.menu_css"
                 :isVisible.sync="selectIconDialogVisible"></FontAwesome>
  </div>
</template>
<script>
import { menuApi } from '@/services/UserPermission'
import FontAwesome from '@/components/FontAwesome/FontAwesome'
// import api from '../../resource/api.js'

export default {
  name: 'leftTree',

  data () {
    return {
      judge: '',
      info: this.messageinfo,

      work: false,
      filterText: '',
      addSonUnitDialog: false,
      addDepDialog: false,
      addJobDialog: false,
      DATA: null,
      NODE: null,
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
        menu_name: '',
        menu_no: '',
        menu_id: '',
        // system_no: 'ggzx',
        p_menu_no: '',
        menu_css: '',
        route_url: ''
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
      menuTreeParam: {
        menu_no: '0'
      },
      // 需要删除的菜单数据
      deleteMenuTreeParam: {
        menu_id: ''
        // menu_no: ''
      },
      // 选择图标弹框是否可见
      selectIconDialogVisible: false,
      // 选中的节点列表，用于刷新后展开到指定位置
      selectedNodeList: []
    }
  },
  props: {
    curMenu: Object
  },
  components: {
    FontAwesome
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
      if (curData.is_dir === '1') {
        this.$emit('update:curMenu', curData)
      }

      if ((node.expanded || node.childNodes.length === 0) && data.menu_id) {
        this.addNodeList(data.menu_id)
      } else {
        this.removeNodeList(data.menu_id)
      }
    },
    // 当当前节点是展开操作时,将当前节点的object_id添加到selectedNodeList中，为了刷新数据后能够展开到指定位置
    addNodeList (menuId) {
      let index = this.selectedNodeList.indexOf(menuId)
      if (index < 0) {
        this.selectedNodeList.push(menuId)
      }
    },
    // 当前节点是收起操作时，将当前节点的object_id从selectedNodeList中移除
    removeNodeList (menuId) {
      let index = this.selectedNodeList.indexOf(menuId)
      if (index >= 0) {
        this.selectedNodeList.splice(index, 1)
      }
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      // console.log('value:', value)
      // console.log('data:', data)
      if (!value) return true
      return data.menu_name.indexOf(value) !== -1
    },
    // 右键弹出的菜单点击事件
    handleRightSelect (key) {
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
      // console.log(n, d)
      let data = JSON.parse(JSON.stringify(d))
      this.addOrEdit = 'edit'
      this.judge = 2
      this.addSonUnitDialog = true
      this.sonUnitform.menu_name = data.menu_name
      this.sonUnitform.menu_no = data.menu_no
      this.sonUnitform.p_menu_no = data.p_menu_no
      // this.sonUnitform.system_no = data.system_no;
      this.sonUnitform.route_url = data.route_url
      this.sonUnitform.menu_css = data.menu_css
      this.sonUnitform.menu_id = data.menu_id
      // 编辑节点
      // if (!n.isEdit) {
      //   //检测isEdit是否存在or是否为false
      //   this.$set(n, "isEdit", true);
      // }
    },
    NodeDel (n, d) {
      // 删除节点
      // console.log(d, 'delete tree')
      if (d.children && d.children.length !== 0) {
        this.$message.error('此菜单有子菜单，不可删除！')
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
          this.$confirm('是否删除此菜单？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteMenuTreeParam.menu_id = d.menu_id
              // this.deleteMenuTreeParam.menu_no = d.menu_no
              // this.deleteMenuTreeParam.system_no = d.system_no
              this.deleteMenuTreeNode()
            })
            .catch(() => { })
        }
        // 判断是否是新增节点
        d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
      }
    },
    NodeAdd (n, d) {
      // 新增节点
      // console.log(n, d, 'add node')
      this.addOrEdit = 'add'
      this.sonUnitform = {}
      this.judge = 1
      this.sonUnitform.p_menu_no = d.menu_no
      // this.sonUnitform.system_no = d.system_no
      this.addSonUnitDialog = true
      // 判断层级
      // if (n.level >= 3) {
      //   this.$message.error("最多只支持三级！");
      //   return false;
      // }
    },
    // 右键点击事件
    rihgtClick (event, object, value, element) {
      // if (this.objectID !== object.menu_id) {
      //   this.objectID = object.menu_id;
      //   this.menuVisible = true;
      //   this.DATA = object;
      //   this.NODE = value;
      // } else {
      //   this.menuVisible = !this.menuVisible;
      // }
      this.DATA = object
      this.NODE = value
      this.menuVisible = !this.menuVisible
      // console.log(object, value, 'right')
      document.addEventListener('click', e => {
        this.menuVisible = false
      })
      let menu = document.querySelector('#rightClickMenu')
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 - 200 + 'px'
      menu.style.top = event.clientY - 35 + 'px'
      menu.style.position = 'absolute' // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + 'px'
    },
    // 处理传入的数据，因为后端都是children_list，需要手动赋值一个children字段
    handelData (arr) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        arr.map((item) => {
          if (item.children_list) {
            item.children = item.children_list
            this.handelData(item.children_list)
          } else if (item.childrens) {
            item.children = item.childrens
            this.handelData(item.childrens)
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
    // 调用权限项分类新增或编辑接口
    addMenuTreeNode () {
      let msg = this.addOrEdit === 'add' ? '新增' : '修改'
      if (this.addOrEdit === 'add') {
        menuApi.createMenuTreeClass({
          data: this.sonUnitform
        }).then(res => {
          // console.log(res, 'add menu class')
          if (res.code === 0) {
            this.$message.success(msg + '菜单成功')
            this.$refs.editMenuForm.resetFields()
            this.addSonUnitDialog = false
            this.getMenuTreeData()
          }
        })
      } else {
        menuApi.updateMenuTreeClass({
          data: this.sonUnitform
        }).then(res => {
          // console.log(res, 'edit menu class')
          if (res.code === 0) {
            this.$message.success(msg + '菜单成功')
            this.addSonUnitDialog = false
            this.$refs.editMenuForm.resetFields()
            this.getMenuTreeData()
          }
        })
      }
    },
    // 删除菜单分类
    deleteMenuTreeNode () {
      menuApi.deleteMenuTreeClass({
        data: this.deleteMenuTreeParam
      }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$message.success('删除菜单成功')
          this.getMenuTreeData()
        }
      })
    },
    // 获取菜单树数据
    getMenuTreeData () {
      menuApi.getMenuTree({
        // params: this.menuTreeParam
      }).then(res => {
        this.menuTreeData = res.data
        this.$store.dispatch('setMenuTree', this.menuTreeData)
        window.localStorage.setItem('menuTree', JSON.stringify(this.menuTreeData))
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.menuList.filter(val)
    },
    messageinfo (newValue, oldValue) {
      this.info = newValue
      // console.log('===', newValue)
    }

  },
  computed: {
    menuTree () {
      let store = this.$store.state.menuTree
      let storage = JSON.parse(window.localStorage.getItem('menuTree')) || []
      let treeData = store.length > 0 ? store : storage
      treeData = this.handelData(treeData)
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
#search-style {
  background: rgba(26, 188, 156, 1);
}
#save-style {
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
.menu-tree-container {
  z-index: 9999;
  width: 300px;
  min-height: 260px;
  height: auto;
  .select-icon {
    font-size: 30px;
    margin-left: 5px;
    transform: translateY(5px);
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
  .el-tree {
    min-height: 260px;
    height: auto;
  }
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

.add_tips /deep/ .el-form-item__label {
  padding-left: 28px;
}
</style>
