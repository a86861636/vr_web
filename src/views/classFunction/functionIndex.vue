<template>
  <div class="classFunction">
    <el-menu
      default-active="2"
      class="menu"
      background-color="#F7F9F9"
      text-color="#000000"
      @open="handleOpen"
      router
      @close="handleClose">
      <el-menu-item disabled>
        <span slot="title" style="color: #9BAAB8">课程名字</span>
      </el-menu-item>
      <el-menu-item v-for="(item,index) of list" :key="index" :index="'/classFunction'+item.path">
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
    <router-view class="container"/>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: [
        {
          name: '点名记录',
          path: '/rollRecord'
        }, {
          name: '课堂测验',
          path: '/examList'
        }
      ]
    }
  },
  mounted () {
    console.log(111)
  },
  methods: {
    toPath (tab, event) {
      let path = '/classFunction' + this.list[tab.index].path
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.classFunction{
  display: flex;
  flex-direction: row;
}
.menu{
  width: 220px;
}
.container{
  flex: 1;
  background: white;
  margin-left: 10px;
}
</style>
