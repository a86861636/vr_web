<template>
  <div class="news-list">
    <c-header></c-header>
    <img class="cover" src="@/assets/index/cover.png" alt="">
    <div class="box">
      <ul class="list">
        <li class="title">
          VR资讯
        </li>
        <li class="item" v-for="(item,index) in list.vr" :key="index" @click="toContent(item.id)">
          <div class="red"></div>
          <div class="tt">{{item.title}}</div>
          <div class="time">{{item.time}}</div>
        </li>
      </ul>
      <ul class="list">
        <li class="title">
          AR资讯
        </li>
        <li class="item" v-for="(item,index) in list.ar" :key="index" @click="toContent(item.id)">
          <div class="red"></div>
          <div class="tt">{{item.title}}</div>
          <div class="time">{{item.time}}</div>
        </li>
      </ul>
      <ul class="list">
        <li class="title">
          MR资讯
        </li>
        <li class="item" v-for="(item,index) in list.mr" :key="index" @click="toContent(item.id)">
          <div class="red"></div>
          <div class="tt">{{item.title}}</div>
          <div class="time">{{item.time}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import header from '@/components/indexHeader'
import axios from 'axios'
export default {
  name: 'News_content',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      articleId: 1,
      news: {
        title: '',
        content: '',
        time: ''
      },
      list: {
        vr: [],
        mr: [],
        ar: []
      }
    }
  },
  components: {
    'c-header': header
  },
  mounted () {
    this.getData('vr', 1)
    this.getData('ar', 2)
    this.getData('mr', 3)
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
    getData (name, type) {
      let data = {
        type: type,
        page: 1
      }
      axios({
        baseURL: 'http://47.94.100.144:8456/',
        url: 'api/article/newslist', // 请求地址
        method: 'get', // post或者get
        params: data
      }).then(res => {
        this.list[name] = res.data.newsList.slice(0, 10)
        console.log(this.list)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  display: flex;
  flex-direction: row;
  width: 1180px;
  margin: auto;

  .list{
    width: 33.3%;
    .item{
      position: relative;
      display: flex;
      height: 50px;
      align-items: center;
      flex-direction: row;
      cursor: pointer;
      .red{
        height: 12px;
        width: 12px;
        background: #FF8479;
      }
      .tt{
        margin-left: 20px;
        font-size: 18px;
        color: #2C2C2C;
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time{
        font-size: 16px;
        color: #A6A6A6;
        text-align: right;
      }
    }
  }
}
.cover{
  height: 207px;
  width: 1180px;
  display: block;
  margin: 5vh auto;
}
.title{
  position: relative;
  color: #2E3284;
  font-size: 20px;
  line-height: 30px;
  padding: 0 0 0 15px;
}
.title::before{
  content: " ";
  height: 100%;
  width: 5px;
  background: #2E3284;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
