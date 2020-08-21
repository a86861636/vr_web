<template>
  <div class="container">
    <div class="top">
      <img class="name" src="@/assets/login/logo.png" />
      <div class="text">课堂教学辅助系统</div>
    </div>
    <div class="center">
      <el-form ref="form" label-position="left" :model="form" label-width="80px" class="login-page" >
        <el-form-item label="用户名" style="width: 100%;">
          <el-input v-model="form.phoneNumber" placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" style="width: 100%;">
          <el-input v-model="form.password" type="password" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item label="身份" style="width: 100%;">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type==='助教'" label="助教码" style="width: 100%;">
          <el-input v-model="form.tAssistantCode" type="password" placeholder="请输入助教码">
          </el-input>
        </el-form-item>
        <el-button class="login-button" type="primary" style="background: #FA7162" @click="login">登 录</el-button>
      </el-form>
    </div>
    <div class="bottom">
      <div class="contact">
        联系后台人员: 512961402@qq.com
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options: [{
        label: '教师',
        value: 't'
      }, {
        label: '学生',
        value: 's'
      }],
      form: {
        phoneNumber: '',
        password: '',
        type: 't',
        tAssistantCode: ''
      }
    }
  },
  mounted () {
    this.userInfo = this.$store.state.userInfo
  },
  methods: {
    clearInput () {
      this.form = {
        phoneNumber: '',
        password: '',
        type: this.form.type,
        tAssistantCode: ''
      }
    },
    login () {
      let data = {
        url: 'login/login/',
        trans: true,
        phoneNumber: this.form.phoneNumber,
        password: this.form.password,
        user_type: this.form.type,
        assistant_code: ''
      }
      this.$store.dispatch('post', data).then((res) => {
        // console.log(res.user_id)
        if (res.data) {
          res.data.user_type = data.user_type
          this.userInfo = res.data
          this.$store.state.userInfo = res.data
          this.saveUserInfo()
          this.$router.push('/timetable')
          this.$message({
            message: '登录成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '用户名或密码错误',
            type: 'error'
          })
          this.clearInput()
        }
      })
    },
    beAssistant () { // 助教登陆
      this.saveUserInfo()
      let data = {
        url: 'login/tassistant/',
        trans: true,
        assistant6code: this.form.tAssistantCode,
        user_id: this.userInfo.id
      }
      this.$store.dispatch('post', data).then((res) => {
        if (res.teacherid) {
          this.userInfo.userid = this.userInfo.id// 换个地方保存本账号id
          this.userInfo.usertoken = this.userInfo.token // 换个地方保存本账号token
          this.userInfo.assistantMode = true// 助教模式开启
          this.userInfo.tAssistantCode = this.form.tAssistantCode
          this.userInfo.assistedTeacherName = res.teachername
          this.userInfo.id = res.teacherid
          this.userInfo.token = res.token
          this.saveUserInfo()
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$router.push('/timetable')
        } else {
          this.userInfo = {}
          this.clearInput()
          this.$message({
            message: '助教码错误',
            type: 'error'
          })
        }
      })
    },
    saveUserInfo () { // 保存用户信息到本地存储
      window.localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top{
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.name{
  height: 54px;
  margin-left: 10%;
}
.text{
  margin-left: 20px;
  font-size: 24px;
  color: #666666;
}
.center{
  background: url('../../assets/login/bg.png') no-repeat;
  background-size: 100% auto;
  background-position: center;
  height: 500px;
  display: flex;
  justify-content: flex-end;
}
.login-page {
  border-radius: 5px;
  margin: auto 20% auto 0;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bottom{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
}
.contact{
  color: #999999;
  font-size: 16px;
  margin-right: 22%;
  cursor: pointer;
}
</style>
