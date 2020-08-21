<template>
  <div v-if="nodata" class="nodata">
    <div>
      <img class="nodata-img" src="@/assets/index/nodata.png" alt="">
      <div class="nodata-text">无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nodata',
  props: [
    'nodata'
  ],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.nodata{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .nodata-img{
    width: 60px;
    height: 60px;
    display: block;
  }
  .nodata-text{
    color: #bfbfbf;
    font-size: 15px;
    margin-top: 5px;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
