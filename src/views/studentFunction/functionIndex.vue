<template>
  <div class="studentFunction">
    <div class="row" v-if="isIndex">
      <el-menu
        :default-active="indexPath"
        class="menu"
        background-color="#F7F9F9"
        text-color="#000000"
        router>
        <el-menu-item disabled>
          <span slot="title" style="color: #9BAAB8">{{courseInfo.subject}}</span>
        </el-menu-item>
        <el-menu-item v-for="(item,index) of list" :key="index" :index="'/studentFunction'+item.path">
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
      <router-view class="container"/>
    </div>
    <div class="row" v-if="!isIndex">
      <c-selectTerm></c-selectTerm>
      <div class="function">
        <div class="item" v-for="(item,index) of list" :key="index" @click="toPath(item.path)">
          <img class="icon" :src="item.img" />
          <div class="number">{{item.msgNumber || ''}}</div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import selectTerm from '@/components/selectTerm'
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: [
        {
          name: '随堂测验',
          path: '/exam',
          msgNumber: 0,
          msgName: '',
          img: require('@/assets/classFunciton/ceyan.png')
        }, {
          name: '课后作业',
          path: '/work',
          msgNumber: 0,
          msgName: 'work',
          img: require('@/assets/classFunciton/zuoye.png')
        },  {
          name: '点名记录',
          path: '/rollRecord',
          msgNumber: 0,
          msgName: 'signin_record',
          img: require('@/assets/classFunciton/record.png')
        }, {
          name: '直播回放',
          path: '/playBack',
          msgNumber: 0,
          msgName: '',
          img: require('@/assets/classFunciton/lubo.png')
        }, {
          name: '投票',
          path: '/vote',
          msgNumber: 0,
          msgName: '',
          img: require('@/assets/classFunciton/toupiao.png')
        }, {
          name: '学生疑问',
          path: '/question',
          msgNumber: 0,
          msgName: 'qa',
          img: require('@/assets/classFunciton/cloud.png')
        }, {
          name: '教师提问',
          path: '/quiz',
          msgNumber: 0,
          msgName: 'qa',
          img: require('@/assets/classFunciton/ketangdayi.png')
        }
        // , {
        //   name: '申请加分',
        //   path: '/addPoint',
        //   msgNumber: 0,
        //   msgName: 'member_list',
        //   img: require('@/assets/classFunciton/add.png')
        // }
      ],
      msgNumber: [],
      path: this.$router.path
    }
  },
  components: {
    'c-selectTerm': selectTerm
  },
  computed: {
    isIndex () {
      return this.$route.path !== '/studentFunction/index'
    },
    indexPath () {
      return this.$route.path
    },
    courseInfo () {
      return this.$store.state.courseInfo
    }
  },
  mounted () {
    this.getMsgNumber()
  },
  watch: {
    courseInfo (val) {
      this.getMsgNumber(val.dbid)
    }
  },
  methods: {
    changeClass () {
      console.log(111)
    },
    getMsgNumber (dbid) {
      let data = {
        url: 'messages/count/',
        schedule_id: dbid || this.$store.state.courseInfo.dbid,
        user_id: this.$store.state.userInfo.id,
        user_type: 't'
      }
      this.$store.dispatch('get', data).then((res) => {
        for (let item of this.list) {
          if (res.data[item.msgName]) {
            if (item.msgName === 'homework') {
              let json = res.data[item.msgName]
              for (let key in json) {
                item.msgNumber = item.msgNumber + json[key]
              }
            } else {
              item.msgNumber = res.data[item.msgName]
            }
          }
        }
        console.log(this.list)
      })
    },
    toPath (path) {
      path = '/studentFunction' + path
      this.$router.push(path)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.studentFunction{
  /* background-size: 100% 100%;
  background-image: url('../../assets/classFunciton/bg.png'); */
}
.row{
  display: flex;
  flex-direction: row;
}
.menu{
  width: 220px;
}
.container{
  flex: 1;
  background: white;
  margin-left: 10px;
}
.function{
  margin: 30px auto;
  display: flex;
  flex-direction: row;
  width: 240px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.item{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  height: 130px;
  position: relative;
  justify-content: center;
  cursor: pointer;
}
.item:hover{
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 4px 0px rgba(150,150,150,0.5);
  border-radius:8px;
}
.icon{
  width: 57px;
  height: 57px;
}
.name{
  margin-top: 10px;
}
.number{
  position: absolute;
  right: 0;
  top: 0;
  background: red;
  color: white;
  border-radius: 50%;
  line-height: 20px;
  padding: 0 6px;
}
</style>
