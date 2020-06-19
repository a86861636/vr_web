<template>
  <div class="classFunction">
    <el-menu
      :default-active="indexPath"
      class="menu"
      background-color="#F7F9F9"
      text-color="#000000"
      router
      v-if="isIndex">
      <el-menu-item disabled>
        <span slot="title" style="color: #9BAAB8">文件存储</span>
      </el-menu-item>
      <el-menu-item v-for="(item,index) of list" :key="index" :index="'/storage'+item.path">
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
    <router-view class="container"/>
    <div class="function" v-if="!isIndex">
      <div class="item" v-for="(item,index) of list" :key="index" @click="toPath(item.path)">
        <img class="icon" :src="item.img" />
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: [
        {
          name: '个人空间',
          path: '/personspace',
          img: require('@/assets/classFunciton/ceyan.png')
        }, {
          name: '公共素材',
          path: '/publicmaterial',
          img: require('@/assets/classFunciton/ceyan.png')
        }, {
          name: '班级素材',
          path: '/classmaterial',
          img: require('@/assets/classFunciton/ceyan.png')
        }, {
          name: '个人素材',
          path: '/personmaterial',
          img: require('@/assets/classFunciton/ceyan.png')
        }
      ],
      path: this.$router.path
    }
  },
  mounted () {
  },
  computed: {
    isIndex () {
      return this.$route.path !== '/classFunction/index'
    },
    indexPath () {
      return this.$route.path
    }
  },
  methods: {
    toPath (path) {
      path = '/classFunction' + path
      this.$router.push(path)
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
.function{
  margin: 30px auto;
  display: flex;
  flex-direction: row;
  width: 240px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.item{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  height: 130px;
  justify-content: center;
}
.icon{
  width: 57px;
  height: 57px;
}
.name{
  margin-top: 10px;
}
</style>
