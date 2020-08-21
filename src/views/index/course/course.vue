<template>
  <div class="course">
    <c-header></c-header>
    <div class="box1">
      <img class="bg" src="@/assets/index/bg.png">
    </div>
    <div class="box2">
      <ul class="list">
        <li class="item" v-for="(item,index) in courseList" :key="index">
          <div class="cover-box">
            <img class="cover" :src="mediaURL + item.cover" />
          </div>
          <div class="content">
            <div class="label">{{item.label}}</div>
            <div class="tt">{{item.title}}</div>
            <div class="intro">
              {{item.brief_introduction}}
            </div>
            <div class="bottom">
              <div>
                <img class="icon-time" src="@/assets/index/icon-time.png" />
                <span style="padding-left: 5px;">{{item.total_chapters}}Hour</span>
              </div>
              <div>
                <img class="icon-chater" src="@/assets/index/icon-charter.png" />
                <span style="padding-left: 5px;">共{{item.total_chapters}}节</span>
              </div>
            </div>
            <div class="more" @click="toVideo(item)">了解更多</div>
          </div>
        </li>
      </ul>
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
import header from '@/components/indexHeader'
import footer from '@/components/footer'
export default {
  name: 'Course',
  data () {
    return {
      courseList: [
        {
          brief_introduction: '',
          cate_id: '',
          cover: '',
          duration: 0,
          id: 0,
          label: '加载中..',
          title: '加载中..',
          total_chapters: 0
        }
      ]
    }
  },
  components: {
    'c-header': header,
    'c-footer': footer
  },
  mounted () {
    this.getData()
  },
  methods: {
    toVideo (item) {
      if(!item.is_show){
        this.$message({
          message: '敬请期待'
        })
        return false
      }
      this.$router.push({path: '/video',
        query: {
          cate_id: item.CateId,
          title: item.title
        }})
    },
    getData () {
      let data = {
        url: 'website/courses/',
        school_id: -1,
        major_id: -1
      }
      this.$store.dispatch('get', data).then((res) => {
        this.courseList = res.data
      })
    }
  },
  computed: {
    mediaURL () {
      return this.$store.state.mediaURL
    }
  }
}
</script>

<style scoped lang="less">
.course{
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.box1{
  .bg{
    width: 100%;
  }
}
.box2{
  flex: 1;
  .title{
    font-size: 40px;
    color: rgba(48,57,68,1);
    text-align: center;
    font-weight: bold;
  }
  .list{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 60px 0;
    position: relative;
  }
  .item{
    border: 1px solid rgba(195, 195, 195, 0.719);
    margin: 0 10px;
    position: relative;
    background: white;
    .cover-box{
      width: 400px;
      height: 250px;
      overflow: hidden;
      position: relative;
      background: #8a8a8a;
    }
    .cover{
      left: 50%;
      top: 50%;
      position: absolute;
      transform: translate(-50%,-50%);
      width: 400px;
      height: auto;
      display: block;
      transition: .5s;
    }
    .cover:hover{
      // animation: bigger .5s paused;
      width: 420px;
      height: auto;
    }
    .content{
      position: relative;
      padding: 35px 30px 0 30px;
    }
    .label{
      position: absolute;
      top: 0;
      left: 25px;
      transform: translate(0,-50%);
      background: #6C48E0;
      width: 160px;
      line-height: 28px;
      text-align: center;
      color: white;
    }
    .tt{
      margin: 0 0 0 0;
      font-size: 18px;
      color: #3C4050;
      padding: 0 10px;
      font-weight: 600;
      overflow : hidden;
      text-overflow: ellipsis;
      width: 320px;
    }
    .intro{
      margin: 25px 0 0 0;
      font-size: 16px;
      color: rgba(60,64,80,1);
      padding: 0 10px;
      overflow : hidden;
      text-overflow: ellipsis;
      width: 340px;
      word-wrap: break-word;
      word-break: normal;
      box-sizing: border-box;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .more{
      background: #E8E8E8;
      width: 149px;
      line-height: 42px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #9A9A9A;
      cursor: pointer;
      margin: 25px auto;
    }
    .more:hover{
      background: #F9675A;
      color: white;
    }
    .bottom{
      height: 30px;
      color: #9A9A9A;
      font-size: 13px;
      margin: 25px 0 0 0;
      border-top: 1px #E8E8E8 solid;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;

      div{
        display: inline-flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
