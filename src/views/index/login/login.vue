<template>
<div>
  <div class="mask" @click="toggleLogin"></div>
  <div class="login-box">
    <div class="nologin" v-if="mode==='tips'">
      <img class="close" src="@/assets/index/close.png" @click="toggleLogin">
      <img class="bg" src="@/assets/index/nologin_bg.png" alt="">
      <div class="content">
        <div class="text1">您还未登录</div>
        <div class="text2">（请先登录再进行此操作）</div>
        <el-button class="btn" @click="changeMode('login')" type="danger">登录</el-button>
      </div>
    </div>
    <div class="login" v-if="mode==='login'">
      <img class="close" src="@/assets/index/close.png" @click="toggleLogin">
      <img class="logo" src="@/assets/index/logo.png">
      <div class="tt">使用手机号登录</div>
      <el-input class="input" size="small" v-model="form.phoneNumber" placeholder="输入手机号或邮箱"></el-input>
      <el-input class="input" size="small" type="password" v-model="form.password" placeholder="密码"></el-input>
      <el-select class="input" size="small" v-model="login_type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="button" size="small" @click="login" type="danger">登陆</el-button>
      <!-- <div class="forget">忘记密码</div> -->
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      form: {
        phoneNumber: '',
        password: ''
      },
      login_type: 'teacher',
      options: [{
        value: 'student',
        label: '学生'
      }, {
        value: 'teacher',
        label: '教师'
      }
      ],
      userInfo: {},
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    changeMode (mode) {
      this.$store.state.login_mode = mode
    },
    toggleLogin () {
      this.$store.state.login_show = !this.$store.state.login_show
    },
    login () {
      let data = {
        url: 'login/login/',
        trans: true,
        user_type: 't',
        phoneNumber: this.form.phoneNumber,
        password: this.form.password,
        assistant_code: ''
      }
      if (this.login_type === 'student') {
        data.user_type = 's'
      }
      this.$store.dispatch('post', data).then((res) => {
        if (res.code === 200) {
          res.data.user_type = data.user_type
          this.userInfo = res.data
          this.$store.state.userInfo = res.data
          this.saveUserInfo()
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.toggleLogin()
          this.$router.go(0)
        } else {
          this.$message({
            message: '用户名或密码错误',
            type: 'error'
          })
          this.clearInput()
        }
      })
    },
    saveUserInfo () { // 保存用户信息到本地存储
      window.localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    }
  },
  computed: {
    mode () {
      return this.$store.state.login_mode
    }
  }
}
</script>
<style scoped lang="less">
.login-box{
  position: fixed;
  z-index: 99;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.mask{
  position: fixed;
  z-index: 98;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
.nologin{
  position: relative;
  width: 420px;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .bg{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .close{
    width: 28px;
    height: 28px;
    position: absolute;
    right: 20px;
    top: 50px;
    cursor: pointer;
    z-index: 3;
  }
  .content{
    z-index: 2;
    position: relative;
    text-align: center;
    padding-top: 80px;
    color: #4A4A4A;

    .btn{
      margin-top: 28px;
      width: 104px;
    }
    .text1{
      font-size: 20px;
    }
    .text2{
      margin-top: 7px;
      font-size: 16px;
    }
  }
}
.login{
  width: 460px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:rgba(255,255,255,1);
  box-shadow:0px 2px 4px 0px rgba(153,153,153,0.5);
  border-radius:4px;
  padding-bottom: 40px;

  .logo{
    width: 60px;
    height: 41px;
  }

  .input{
    width: 206px;
    margin-top: 8px;
  }

  .tt{
    position: relative;
  }

  .close{
    width: 28px;
    height: 28px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  .logo{
    margin-top: 20px;
  }

  .tt{
    margin: 17px 0;
    color: #898989;
    font-size: 12px;
    position: relative;
  }

  .button{
    width:206px;
    margin-top: 8px;
  }

  .forget{
    margin: 16px 0 0px 0;
    font-size: 10px;
    color: rgba(69,69,69,1);
  }
}
</style>
