
<template>
  <div class="home-container">

  </div>
</template>
<script>
export default {
  data () {
    return {
      count: 0
    }
  },
  computed: {
    getCount () {
      return this.$store.getters.countNum
    }
  },
  created () {

  },
  methods: {
    addCount () {
      this.$store.dispatch('addCount', Math.floor(10 * Math.random()))
      console.log(this.$store.state, 'addcount')
    }
  },
  mouted () { }
}
</script>
<style scoped lang='scss'>
.home-container {
  margin-top: 40px;
}
</style>
