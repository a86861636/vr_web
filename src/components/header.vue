<template>
  <div class="header">
    <div class="left">
      <img src="@/assets/header/logo.png" />
    </div>
    <div class="right">
      <img class="icon" src="@/assets/header/date.png" @click="toPath('/course')" />
      <img class="icon" src="@/assets/header/notice.png" />
      <img class="icon" src="@/assets/header/file.png" @click="toPath('/storage')" />
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
  methods: {
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
.icon{
  width: 20px;
  margin-left: 22px;
  cursor: pointer;
}
</style>
