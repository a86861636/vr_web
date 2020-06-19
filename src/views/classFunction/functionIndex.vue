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
        <span slot="title" style="color: #9BAAB8">{{courseInfo.subject}}</span>
      </el-menu-item>
      <el-menu-item v-for="(item,index) of list" :key="index" :index="'/classFunction'+item.path">
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
          name: '随堂测验',
          path: '/exam',
          img: require('@/assets/classFunciton/ceyan.png')
        }, {
          name: '课后作业',
          path: '/homework',
          img: require('@/assets/classFunciton/zuoye.png')
        }, {
          name: '课堂答疑',
          path: '/question',
          img: require('@/assets/classFunciton/ketangdayi.png')
        }, {
          name: '点名记录',
          path: '/rollRecord',
          img: require('@/assets/classFunciton/record.png')
        }, {
          name: '直播回放',
          path: '/playBack',
          img: require('@/assets/classFunciton/lubo.png')
        }, {
          name: '投票',
          path: '/vote',
          img: require('@/assets/classFunciton/lubo.png')
        }, {
          name: '课堂问答',
          path: '/examList',
          img: require('@/assets/classFunciton/cloud.png')
        }, {
          name: '申请加分',
          path: '/addPoint',
          img: require('@/assets/classFunciton/cloud.png')
        }
      ],
      path: this.$router.path
    }
  },
  computed: {
    isIndex () {
      return this.$route.path !== '/classFunction/index'
    },
    indexPath () {
      return this.$route.path
    },
    courseInfo () {
      return this.$store.state.courseInfo
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
