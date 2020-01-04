<template>
  <!-- 权限清单tabs-> 资源数据链接   permissionListVisible:-->
  <el-dialog title="资源数据"
             :visible.sync="visible"
             width="80%"
             :close-on-click-modal="false"
             :before-close="handleCloseNum">
    <div>
      <el-table :header-cell-style="{background:'#f5f5f5'}"
                :data="permissionDetail.list"
                border
                height="310"
                style="width: 100%">
        <el-table-column prop="system_name"
                         label="所属系统"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="object_sort_name"
                         label="类型"
                         align="center"
                         show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="object_name"
                         label="权限项名称"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="object_no"
                         label="权限编号"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="object_module"
                         label="module"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="object_method"
                         label="method"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="object_para"
                         label="参数"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="是否菜单项"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.is_menu==0?'否':'是'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否授权项"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.is_priv==0?'否':'是'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="是否流程项"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.is_flow==0?'否':'是'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否普通项"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.is_samp==0?'否':'是'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px!important;">
        <el-pagination @current-change="handleChangeSource"
                       :current-page="getPermissionDetailParam.page"
                       :page-sizes="[15,20,30,40]"
                       layout="total,sizes,prev, pager, next, jumper"
                       background
                       align="center"
                       id="pagination"
                       :total="permissionDetail.total_count">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      visible: false,
      getPermissionDetailParam: {
        auth_template_id: '',
        is_page: 1,
        page: 1,
        page_size: 15
      },
      permissionDetail: {
        list: [],
        total_count: 0
      }
    }
  },
  props: {
    dialogVisible: Boolean,
    permissionRequestParam: Object
  },
  watch: {
    dialogVisible (newval, oldval) {
      this.visible = newval
      if (this.permissionRequestParam.auth_template_id) {
        this.getPermissionDetailParam = Object.assign(this.getPermissionDetailParam, JSON.parse(JSON.stringify(this.permissionRequestParam)))
        this.getJobPermissionDetail()
      }
    },
    permissionRequestParam: {
      handler (newval, oldval) {
        this.getPermissionDetailParam = Object.assign(this.getPermissionDetailParam, JSON.parse(JSON.stringify(newval)))
      },
      deep: true
    }
  },
  methods: {
    dialogClose () {
      this.permissionDetail.list = []
      this.$emit('update:dialogVisible', false)
    },
    // 资源数据清空数据
    handleCloseNum (done) {
      this.getPermissionDetailParam.page = 1
      this.dialogClose()
    },
    // 获取权限模板中的权限
    getJobPermissionDetail () {
      userPermissionApi.getJobPermissionDetail({
        data: this.getPermissionDetailParam
      }).then(res => {
        console.log(res, 'get permission detail')
        if (res.code === 0) {
          this.permissionDetail = res.data
        }
      })
    },
    // 资源数量弹框中的分页跳转
    handleChangeSource (page) {
      this.getPermissionDetailParam.page = page
      this.getJobPermissionDetail()
    },

    handleSizeChange (size) {

    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang='scss'>
</style>
