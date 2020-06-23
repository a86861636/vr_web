<template>
  <div class="layout">
    <c-header></c-header>
    <div class="container">
      <breadcrumb></breadcrumb>
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
import header from '@/components/header'
import breadcrumb from './breadcrumb'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'c-header': header,
    breadcrumb: breadcrumb
  },
  methods: {}
}
</script>
<style scoped>
.layout{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FDF0E9;
  background-attachment: fixed;
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  background-image: url('../assets/classFunciton/bg1.png');
}
.container{
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  min-width: 800px;
}
.router-view{
  flex: 1;
  margin-top: 20px;
}
</style>
