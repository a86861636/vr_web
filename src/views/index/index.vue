<template>
  <div id="index">
    <c-header></c-header>
    <c-swiper></c-swiper>
    <!-- <div class="box1">
      <img class="bg" src="@/assets/index/bg1.png" />
      <ul class="list">
        <li class="item" v-for="(item,index) in list1" :key="index">
          <img class="icon" :src="mediaURL + item.image" />
        </li>
      </ul>
    </div> -->
    <div class="box2">
      <div class="title">推荐好课</div>
      <ul class="list">
        <li class="item" v-for="(item,index) in list2" :key="index">
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
                <span style="padding-left: 5px;">{{item.duration}}Hour</span>
              </div>
              <div>
                <img class="icon-chater" src="@/assets/index/icon-charter.png" />
                <span style="padding-left: 5px;">共{{item.total_chapters}}节</span>
              </div>
            </div>
            <div class="more" @click="toVideo(item)">了解更多</div>
          </div>
        </li>
        <div class="bg" ></div>
      </ul>
    </div>
    <div class="box3">
      <div class="title">NEWS</div>
      <ul class="list">
        <li class="item" v-for="(item,index) in list3" :key="index" @click="toContent(item.id)">
          <img class="cover" v-if="index===0" src="@/assets/index/news (1).png" />
          <img class="cover" v-if="index===1" src="@/assets/index/news (2).png" />
          <img class="cover" v-if="index===2" src="@/assets/index/news (3).png" />
          <div class="tt">{{item.title}}</div>
          <div class="content">{{item.content}}</div>
          <div class="time">{{item.time}}</div>
        </li>
      </ul>
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
import header from '@/components/indexHeader'
import footer from '@/components/footer'
import swiper from '@/components/indexSwiper'
export default {
  name: 'index',
  data () {
    return {
      list1: [
        {subject_name: 'VR', image: 'website/subjects/ICON-VR.png'},
        {subject_name: 'MR', image: 'website/subjects/ICON-MR.png'},
        {subject_name: 'AR', image: 'website/subjects/ICON-AR.png'},
        {subject_name: 'C#', image: 'website/subjects/icon-C.png'},
        {subject_name: '影视特效', image: 'website/subjects/icon-影视特效.png'}
      ],
      list2: [
        {
          brief_introduction: '',
          cate_id: '',
          cover: '',
          duration: 0,
          id: 0,
          label: '加载中..',
          title: '加载中..',
          total_chapters: 0}
      ],
      list3: [
        {
          author: '',
          content: '加载中..',
          id: '',
          images: [],
          time: '0000-00-00',
          title: '加载中..',
          type: 1,
          videoSrc: ''
        }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    mediaURL () {
      return this.$store.state.mediaURL
    }
  },
  methods: {
    toContent (id) {
      this.$router.push({
        path: '/news/content',
        query: {
          news_id: id
        }
      })
    },
    toVideo (item) {
      if(!item.is_show){
        this.$message({
          message: '敬请期待'
        })
        return false
      }
      this.$router.push({path: '/video',
        query: {
          cate_id: item.cate_id,
          title: item.title
        }})
    },
    getData () {
      let data = {
        url: 'website/index/'
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.list1 = res.data.subject_banner
        this.list2 = res.data.recommended_subjects
        this.list3 = res.data.news_data
      })
    }
  },
  components: {
    'c-header': header,
    'c-swiper': swiper,
    'c-footer': footer
  }
}
</script>

<style lang="less" scoped>
.box1{
  position: relative;

  .bg{
    width: 100%;
  }
  .list{
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 50%);
  }
  .item{
    margin: 0 10px;
  }
  .icon{
    width: 150px;
  }
}
.box2{
  margin-top: 240px;
  position: relative;
  .title{
    font-size: 40px;
    color: rgba(48,57,68,1);
    text-align: center;
    font-weight: bold;
  }
  .bg{
    width: 100%;
    height: 430px;
    position: absolute;
    left: 0;
    top: 250px;
    background-image: url('../../assets/index/bg2.png');
    z-index: -1;
  }
  .list{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 60px 0 0 0;
    position: relative;
  }
  .item{
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
.box3{
  margin: 300px 0 0 0;
  .title{
    font-size:44px;
    color: white;
    text-align: center;
    background-image: url('../../assets/index/bg3.png');
    background-size: 100% auto;
  }
  .list{
    margin: 60px 0;
  }
  .item{
    cursor: pointer;
    height: 220px;
    width: 770px;
    background: #3C4050;
    color: white;
    margin: 20px auto;
    position: relative;
    padding: 0 0 0 220px;
    .cover{
      height: 220px;
      width: 220px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .tt{
      padding: 25px 40px 0 40px;
      color: #F48005;
      font-size: 20px;
    }
    .time{
      color: #959595;
      font-size: 16px;
      position: absolute;
      bottom: 25px;
      right: 40px;
    }
    .content{
      text-align: justify;
      padding: 25px 40px 25px 40px;
    }
  }
}
</style>
