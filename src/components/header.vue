<template>
  <div class="header">
    <div class="left">
      <img class="logo" src="@/assets/index/logo.png" />
    </div>
    <div class="right">
      <img class="icon" :src="faceUrl">
      <el-tooltip class="item" effect="dark" content="首页" placement="bottom">
        <img class="icon" src="@/assets/header/home.png" @click="toPath('/index')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="课表" placement="bottom">
        <img class="icon" src="@/assets/header/date.png" @click="toPath('/timetable')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="空间" v-if="userType==='t'" placement="bottom">
        <img class="icon" src="@/assets/header/file.png" @click="toPath('/storage')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="登出" placement="bottom">
        <img class="icon" src="@/assets/header/logout.png" @click="logout" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    faceUrl () {
      return this.$store.state.mediaURL + this.$store.state.userInfo.pic
    },
    userType () {
      return this.$store.state.userInfo.user_type
    }
  },
  methods: {
    logout () {
      this.$store.state.userInfo = {}
      window.localStorage.removeItem('userInfo')
      this.$router.push('/login')
    },
    toPath (path) {
      this.$router.push(path)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  height: 58px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 20px 0px rgba(0,0,0,0.07);
  width: 100%;
  padding: 0 100px;
  box-sizing: border-box;
}
.left,.right{
  display: flex;
  flex-direction: row;
}
.logo{
  width: 40px;
  height: 30px;
}
.icon{
  width: 20px;
  height: 20px;
  margin-left: 22px;
  cursor: pointer;
}
</style>
