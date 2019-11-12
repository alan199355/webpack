<template>
  <div class='font-awesome-container'>
    <el-dialog title="选择菜单图标"
               :visible.sync="dialogVisible">
      <div class="icon-container">
        <div class="icon-item"
             :class="selectedIconName===item?'active':''"
             v-for="(item, index) in iconList"
             @click="selectIcon(item)"
             :key="index">
          <i class="fa fa-2x"
             :class="item"></i>
          {{item}}
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           id="foot-center-style">
        <el-button @click="closeDialog"
                   style="margin-right:10px;"
                   class="footer-backcolor-style">取 消</el-button>
        <el-button @click="confirmSelect"
                   type="primary"
                   class="footer-backcolor-style">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fontAwesome } from '@/assets/js/icon'
export default {
  data () {
    return {
      dialogVisible: false,
      iconList: [],
      // 选中的图标
      selectedIconName: ''
    }
  },
  methods: {
    closeDialog () {
      this.dialogVisible = false
      this.$emit('update:isVisible', false)
    },
    selectIcon (item) {
      this.selectedIconName = item
    },
    // 确定选择图标
    confirmSelect () {
      this.dialogVisible = false
      this.$emit('update:isVisible', false)
      this.$emit('update:selectedIcon', this.selectedIconName)
    }
  },
  props: {
    isVisible: Boolean,
    selectedIcon: String
  },
  watch: {
    isVisible (newval, oldval) {
      this.dialogVisible = newval
    }
  },
  created () {
    this.iconList = fontAwesome
  },
  mouted () {
  }
}
</script>
<style scoped lang='scss'>
#foot-center-style {
  text-align: center;
}
.footer-backcolor-style {
  // background: #1abc9c !important;
  // color: white !important;
}
.font-awesome-container {
  .icon-container {
    display: flex;
    flex-wrap: wrap;
    height: 400px;
    overflow: scroll;
    justify-content: space-between;
    cursor: pointer;
    .icon-item {
      width: 200px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &.active {
        background-color: #3399cc;
      }
      i {
        margin-right: 5px;
        width: 40px;
      }
    }
  }
}
</style>