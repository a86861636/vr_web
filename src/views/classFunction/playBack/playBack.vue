<template>
  <div class="playBack">
    <div class="item" v-for="(item,index) in videoList" :key="index">
      <img class="cover" :src="imageUrl + item.cover" alt="" />
      <div class="name">{{item.source_name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'playBack',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      videoList: []
    }
  },
  computed: {
    imageUrl () {
      return this.$store.state.mediaURL
    }
  },
  mounted () {
    this.getDate()
  },
  methods: {
    getDate () {
      let data = {
        url: 'live/b/',
        teacher_id: this.$store.state.userInfo.tloginid,
        schedule_id: this.$store.state.courseInfo.dbid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.videoList = res.data
        console.log(res.data)
      })
    }
  }
}
</script>
<style scoped>
.playBack{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 300px;
  height: auto;
  justify-content: flex-start;
}
.item{
  width:128px;
  height: 100px;
  margin: 5px;
}
.cover{
  width:128px;
  height:73px;
  background:rgba(216,216,216,1);
  display: block;
}
.name{
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
