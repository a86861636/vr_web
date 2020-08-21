<template>
  <div id="course">
    <c-header></c-header>
    <div style="flex: 1;">
      <div class="box1">
        <div class="title">{{title}}</div>
        <!-- <myVideo src="playVideoURL" :questionList="questionList"></myVideo> -->
        <myVideo class="video" :videoSrc="playVideoURL" :questionList="questionList"></myVideo>
        <!-- <video controls class="play" src="https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4"></video> -->
      </div>
      <div class="box2">
        <ul class="nav-box">
          <li  @click="changeMode(index)" :class="{'nav': true,'active': mode===index,'hide': item.ban_user===userInfo.user_type}" v-for="(item,index) in navs" :key="index">{{item.name}}</li>
        </ul>
        <div class="content">
          <div class="intro" v-if="mode===0">
            <div>
              {{data.introduction}}
            </div>
            <div class="number">
              <img src="@/assets/index/icon-time.png" class="time"><span>{{data.chapters.length}}学时</span>
              <img src="@/assets/index/icon-charter.png" class="charter"><span>{{data.chapters.length}}节</span>
            </div>
          </div>
          <div class="video" v-if="mode===1">
            <!-- <div class="second-box">
              <div class="second" v-for="(item,index) in videoList" :key="index" @click="getVideo(item,index)" >
                <span>{{index+1}}.{{item.video_title}}</span>
                <img class="icon-play" src="@/assets/index/icon-play.png" v-if="index!=playing" />
                <img class="icon-playing" src="@/assets/index/icon-playing.png"  v-if="index==playing" />
              </div>
            </div> -->
            <div class="first-box" v-for="(item,index) in chapterList" :key="'first-'+index">
              <div class="first" @click="getVideoList(item)">
                <div class="name">{{index+1}}.{{item.video_title}}</div>
                <img class="icon-down" src="@/assets/index/icon-down.png" v-if="item.secondShow" />
                <img class="icon-right" src="@/assets/index/icon-right.png" v-if="!item.secondShow" />
              </div>
              <div class="second-box" v-if="item.secondShow">
                <div class="second" v-for="(item1,index1) in item.second" :key="'second-'+index1" @click="playVideo(item1,item.second)">
                  <span>{{item1.Title}}</span>
                  <img class="icon-play" v-if="!item1.active" src="@/assets/index/icon-play.png" />
                  <img class="icon-playing" v-if="item1.active" src="@/assets/index/icon-playing.png" />
                </div>
              </div>
            </div>
          </div>
          <ul class="files" v-if="mode===2">
            <nodata :nodata="fileList.length===0"></nodata>
            <li class="file" v-for="(item,index) in fileList" :key="index">
              <div class="bottom"></div>
              <img :src="showcatelogy(item.file_path)" class="icon">
              <div class="title">{{item.file_path.split('/')[3]}}</div>
              <div class="size">{{item.file_size}}</div>
              <img class="download" @click="download(item.file_path)" src="@/assets/index/download.png" />
            </li>
          </ul>
          <div class="function-box" v-if="mode===3">
            <c-fun></c-fun>
          </div>
        </div>
      </div>
    </div>
    <!-- <c-footer></c-footer> -->
  </div>
</template>

<script>
import nodata from '@/components/nodata'
import header from '@/components/indexHeader'
import footer from '@/components/footer'
import myVideo from '@/components/myVideo'
import fun from './components/function'
import downloadfile from '@/utils/utils.js'
import jpg from '@/assets/history/JPG.png'
import word from '@/assets/history/word.png'
import pdf from '@/assets/history/PDF.png'
import ppt from '@/assets/history/ppt.png'
import video from '@/assets/history/video.png'
import excel from '@/assets/history/excel.png'
import txt from '@/assets/history/txt.png'
export default {
  name: 'Header',
  data () {
    return {
      mode: 0,
      navs: [
        {
          name: '概览',
          ban_user: ''
        }, {
          name: '视频',
          ban_user: ''
        }, {
          name: '资料',
          ban_user: ''
        }, {
          name: '课程功能',
          ban_user: 't'
        }
      ],
      title: '',
      chapterList: [],
      playVideoURL: '',
      playing: 1,
      fileList: [],
      data: {
        introduction: '1231231',
        time: 10,
        section: 4,
        chapters: []
      },
      questionList: [],
      cate_id: 1000155386
    }
  },
  components: {
    'c-header': header,
    'c-footer': footer,
    'c-fun': fun,
    'myVideo': myVideo,
    'nodata': nodata
  },
  created () {
    this.title = this.$route.query.title
    this.getCourseData()
  },
  methods: {
    showcatelogy (category) {
      if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(category))) {
        return jpg
      }
      if ((/\.(doc|docx)$/i.test(category))) {
        return word
      }
      if ((/\.(pdf)$/i.test(category))) {
        return pdf
      }
      if ((/\.(ppt|pptx)$/i.test(category))) {
        return ppt
      }
      if ((/\.(mp4|avi|mov|rmvb|rm|flv|3GP)$/i.test(category))) {
        return video
      }
      if ((/\.(excel|xls|xlsl)$/i.test(category))) {
        return excel
      }
      if ((/\.(txt)$/i.test(category))) {
        return txt
      }
    },
    // 下载素材
    download (path) {
      downloadfile(this.$store.state.mediaURL + path, path.split('/').reverse()[0])
    },
    getFileList () {
      let data = {
        url: 'website/course/material/',
        user_id: this.$store.state.userInfo.id,
        cate_id: this.$route.query.cate_id
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.fileList = res.data
      })
    },
    getVideoList (item) {
      if(!this.logined){
        this.toggleLogin()
        return false
      }
      if (item.secondShow) {
        item.secondShow = false
        this.$forceUpdate()
        return
      } else if (item.second.length > 0) {
        item.secondShow = true
        this.$forceUpdate()
        return
      }
      let data = {
        url: 'vod/r/',
        cateId: item.video_id
      }
      this.$store.dispatch('get', data).then((res) => {
        item.second = res.data.VideoList.Video.reverse()
        item.secondShow = true
        this.$forceUpdate()
      })
    },
    getCourseData () {
      let data = {
        url: 'website/courses/detail/',
        cate_id: this.$route.query.cate_id
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.data = res.data
        for (let item of res.data.chapters) {
          item.second = []
          item.secondShow = false
        }
        this.chapterList = res.data.chapters
      })
    },
    changeMode (mode) {
      if (this.logined || mode === 1) {
        if (mode === 2) {
          this.getFileList()
        }
        this.mode = mode
      } else {
        this.toggleLogin()
      }
    },
    toggleLogin () {
      this.$store.state.login_mode = 'tips'
      this.$store.state.login_show = !this.$store.state.login_show
    },
    playVideo (item, list) {
      if (!this.logined) {
        this.toggleLogin()
        return false
      }
      for (let i of list) {
        i.active = false
      }
      item.active = true
      this.getVideoUrl(item.VideoId)
      this.getVideoQuestion(item.VideoId)
    },
    getVideoUrl (id) {
      let data = {
        url: 'vod/a/',
        videoId: id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.playVideoURL = res.data.PlayInfoList.PlayInfo[2].PlayURL
        console.log(this.playVideoURL)
      })
    },
    getVideoQuestion (id) {
      let data = {
        url: 'vod/questions/',
        user_id: this.$store.state.userInfo.id,
        video_id: id,
        user_type: 's'
      }
      this.$store.dispatch('get', data).then((res) => {
        this.questionList = res.data
        console.log(res)
      })
    }
  },
  computed: {
    logined () {
      return !this.$store.state.userInfo.id === false || false
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    currentPath () {
      console.log(this.$route.path)
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="less">
#course{
  display: flex;
  flex-direction: column;
}
.box1{
  margin: 20px auto 0 auto;
  width:70%;
  .title{
    font-size: 18px;
    color: #3C4050;
    font-weight: 600;
  }
  .play{
    margin-top: 20px;
    width: 100%;
  }
  .video{
    margin: 15px 0 0 0;
  }
}
.box2{
  margin: 20px auto 50px auto;
  width:70%;
  overflow: hidden;
  .nav-box{
    display: flex;
    flex-direction: row;
    line-height: 56px;
    font-size: 20px;
    color: #717171;
    background: #F3F3F3;
    border:1px solid rgba(224,224,224,1);
  }
  .nav{
    width: 158px;
    cursor: pointer;
    text-align: center;
    border-right:1px solid rgba(224,224,224,1);
  }
  .active{
    background: #71A58C;
    color: white;
  }
  .hide{
    display: none;
  }
  .content{
    padding: 20px;
    border:1px solid rgba(224,224,224,1);
    border-top: 0;

    .number{
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      color: #9A9A9A;
      font-size: 14px;
      margin-top: 20px;

      .time{
        width: 19px;
        height: 19px;
        margin-right: 10px;
      }
      .charter{
        width: 19px;
        margin-left: 100px;
        margin-right: 10px;
      }
    }
    .intro{
      color: #717171;
    }

    .files{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .file{
        width: 50%;
        padding: 20px 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        .bottom{
          height: 1px;
          width: calc(100% - 40px);
          background: #E0E0E0;
          position: absolute;
          bottom: 0;
          left: 20px;
        }
        .icon{
          width: 38px;
          height: 40px;
        }
        .title{
          color: #898989;
          font-size: 16px;
          padding: 0 15px;
        }
        .size{
          font-size: 14px;
          color: #898989;
          flex: 1;
        }
        .download{
          width: 24px;
          cursor: pointer;
        }
      }
    }

    .video{
      .first-box{
        margin: 0 auto;
        width: 70%;
        border-bottom:1px solid rgba(224,224,224,1);
      }
      .first{
        cursor: pointer;
        padding: 10px 50px;
        display: flex;
        color: #4F4F4F;
        font-size: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .second-box{
        padding: 7px 0 20px 0;
      }
      .second{
        padding: 0 80px;
        margin-top: 20px;
        color: #959595;
        font-size: 20px;
        cursor: pointer;
      }
      .second:first-child{
        margin-top: 0px;
      }
    }
  }
}
</style>
