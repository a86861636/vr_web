<template>
  <div class="header">
   <img src="@/assets/header/logo.png" />
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
}
</style>
