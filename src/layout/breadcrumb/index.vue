<template>
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item,index) in levelList" :key="index.path">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb () {
      // $route.matched一个数组 包含当前路由的所有嵌套路径片段的路由记录
      let matched = this.$route.matched.filter(item => item.name)
      this.levelList = matched
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  computed: {
  }
}
</script>
<style scoped>
.breadcrumb{
  line-height: 40px;
  border-bottom: solid 2px #F07867;
}
</style>
