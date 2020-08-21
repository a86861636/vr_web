<template>
  <div id="header">
    <div class="left">
      <img src="@/assets/index/logo.png" />
    </div>
    <ul class="center">
      <li v-for="item in navList" :key="item.path" :class="{'active': currentPath==item.path}" @click="toPath(item.path)">{{item.name}}</li>
    </ul>
    <div class="right">
      <img src="@/assets/index/account.png" />
      <div class="username">{{userInfo.user_name}}</div>
      <div class="logout" v-if="!is_login" @click="toggleLogin">登陆</div>
      <div class="logout" v-if="is_login" @click="logout">注销</div>
    </div>
    <c-login v-if="loginShow"></c-login>
  </div>
</template>

<script>
import login from '@/views/index/login/login'
export default {
  name: 'Header',
  data () {
    return {
      navList: [
        {
          name: '主页',
          path: '/index'
        }, {
          name: '课程',
          path: '/course'
        }, {
          name: '新闻',
          path: '/news/list'
        }, {
          name: '课表',
          path: '/timetable'
        }
        // , {
        //   name: '联系我们',
        //   path: 'index1'
        // }
      ]
    }
  },
  components: {
    'c-login': login
  },
  methods: {
    logout () {
      localStorage.removeItem('userInfo')
      this.$store.state.userInfo = {}
    },
    toggleLogin () {
      this.$store.state.login_mode = 'login'
      this.$store.state.login_show = !this.$store.state.login_show
    },
    toPath (path) {
      this.$router.push({
        path: path
      })
    }
  },
  computed: {
    is_login () {
      return !this.$store.state.userInfo.id === false || false
    },
    loginShow () {
      return this.$store.state.login_show
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    currentPath () {
      console.log(this.$route.path)
      return this.$route.path
    }
  }
}
</script>

<style scoped>
#header{
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: white;
}
.left,.right{
  width: 20%;
  padding: 0 63px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.center{
  width:60%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style-type: none;
  color: #666666;
  font-size: 20px;
}
li{
  padding: 0 30px;
  cursor: pointer;
}
.active{
  color: #F84D48;
}
.logout{
  margin-left: 20px;
  cursor: pointer;
  font-weight: 600;
}
.username{
  margin: 0 0 0 10px;
  color: #F84D48;
}
</style>
