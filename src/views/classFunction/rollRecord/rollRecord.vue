<template>
  <div class="hello">
   111
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'signin/tsigninrecords/',
        schedule_id: 399,
        teacher_id: 47
      }
      this.$store.dispatch('get', data).then((res) => {
        this.list = res.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
