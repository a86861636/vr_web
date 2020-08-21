<template>
  <div class="news-content">
    <c-header></c-header>
    <div class="tt" v-html="news.content">111</div>
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
      }
    }
  },
  components: {
    'c-header': header
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
    getData () {
      let data = {
        article_id: this.$route.query.news_id
      }
      axios({
        baseURL: 'http://47.94.100.144:8456/',
        url: 'api/article/content', // 请求地址
        method: 'get', // post或者get
        params: data
      }).then(res => {
        this.news.content = res.data.content.content
        console.log(res.data)
      })
    }
  }
}
</script>
<style lang="less">
img{
  max-width: 100%;
  height: auto;
}
.news-content{
  .entry-title{
    width: 1100px;
    margin: 30px auto;
    color: #494949;
    color: 40px;
  }
  .post-time{
    width: 1100px;
    margin: 0 auto;
    color: #939393;
    font-size: 16px;
    border: #EAEAEA 1px solid;
    border-width: 1px 0;
    line-height: 50px;
  }
  .post-categories,.post-author,.publisher-schema,.wp_rp_wrap,.entry-footer{
    display: none;
  }
  .entry-content{
    width: 996px;
    margin: 30px auto;
    img{
      display: block;
      margin: 20px auto;
    }
  }
}
</style>
