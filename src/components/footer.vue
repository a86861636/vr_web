<template>
  <div id="footer">
    <img class="logo" src="@/assets/index/logo.png">
    <div class="address">地址：广州开发区科学大道181号商业广场A4栋第7层702单元</div>
    <div class="number">联系方式：（020）31603680</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
    }
  },
  methods: {}
}
</script>
<style scoped>
#footer{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #3C4050;
  height: 120px;
  font-size: 14px;
}
.logo{
  width: 50px;
}
.address{
  margin: 0 0 0 70px;
}
.number{
  margin: 0 0 0 20px;
}
</style>
