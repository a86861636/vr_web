<template>
  <div class="playBack">
    <div class="line">
      <!-- <el-radio v-model="sort" label="1">时间顺序</el-radio>
      <el-radio v-model="sort" label="2">时间倒序</el-radio> -->
      <!-- <img class="back" src="@/assets/classFunciton/back.png" @click="back" v-if="mode != 'home'" /> -->
    </div>
    <c-nodata :nodata="videoList"></c-nodata>
    <div class="list">
      <div class="item" v-for="(item,index) in videoList" :key="index" @click="playVideo(item)">
        <img class="cover" :src="imageUrl + item.cover" alt="" />
        <div class="name">{{item.source_name}}</div>
      </div>
    </div>
    <el-dialog
      :title="videoInfo.source_name"
      :visible.sync="videoShow"
      width="30%"
      center>
      <div>
        <video :src="videoInfo.url" class="video" controls />
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="videoShow = false">取 消</el-button>
        <el-button type="primary" @click="videoShow = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import nodata from '@/components/nodata'
export default {
  name: 'playBack',
  data () {
    return {
      sort: '1',
      mode: 'home',
      videoList: [],
      videoShow: false,
      videoInfo: {
        source_name: ''
      }
    }
  },
  computed: {
    imageUrl () {
      return this.$store.state.mediaURL
    }
  },
  components: {
    'c-nodata': nodata
  },
  mounted () {
    this.getDate()
  },
  methods: {
    getVideoUrl (uri) {
      let data = {
        url: 'live/u/',
        key: uri
      }
      this.$store.dispatch('get', data).then((res) => {
        this.videoInfo.url = res.data
      })
    },
    // getVideoUrl(uri){//用uri获取视频url
    //   uni.request({
    //     url: _self.globalUrl + 'live/u/',
    //     method: 'GET',
    //     header: {
    //       AUTHORIZATION: uni.getStorageSync('token')
    //     },
    //     data: {
    //       key: uri//_self.scheduleId
    //     },
    //     success: res => {
    //       console.log(res.data.data);
    //       if(res.data.code == 200){
    //         _self.currentUrl = res.data.data
    //         _self.videoContext.play();
    //       }
    //     },
    //     fail: (e) => {
    //       console.log(e)
    //     },
    //   });
    // },
    playVideo (item) {
      console.log(item)
      this.getVideoUrl(item.uri)
      this.videoInfo = item
      this.videoShow = true
    },
    getDate () {
      let data = {
        url: 'live/a/',
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
.line{
  width: 500px;
  height: 40px;
  margin: 0px auto 0px auto;
  border-bottom: #DFDFE2 2px solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.back{
  width: 30px;
  height: 30px;
  display: block;
  cursor: pointer;
}
.list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 550px;
  margin: auto;
}
.item{
  margin: 15px;
  width: 150px;
}
.cover{
  width: 100%;
  height: 80px;
  background:rgba(216,216,216,1);
  display: block;
}
.name{
  width: 100%;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video{
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>
