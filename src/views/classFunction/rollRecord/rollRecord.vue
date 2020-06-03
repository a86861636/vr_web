<template>
  <div class="record">
    <div class="line"></div>
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='recordData'></c-table>
    <!-- <c-table class="table" :width="500" :tableData='detailData'></c-table> -->
  </div>
</template>

<script>
import table from '@/components/normalTable'
export default {
  name: 'HelloWorld',
  data () {
    return {
      recordData: {
        title: ['签到开始', '正常', '病假', '迟到', '缺勤', '操作'], // 标题
        list: [], // 对应的内容
        date: [], // 对应的数据
        btn: ['查看', '表格'] // 最后的按钮 没有可以空
      },
      detailData: {
        // title: ['学号', '学生名字', '打卡时间', '打卡状态'],
        // list: [
        //   ['1111', 'abc', '2020-22', '正常'],
        //   ['1111', 'abc', '2020-22', '正常'],
        //   ['1111', 'abc', '2020-22', '正常']
        // ],
        // date: [],
        // btn: ['查看']
      }
    }
  },
  components: {
    'c-table': table
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'signin/tsigninrecords/',
        schedule_id: this.$store.state.courseInfo.dbid,
        teacher_id: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.recordData.date = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 't_signin_id') {
              arr.push(item[key])
            }
          }
          this.recordData.list.push(arr)
        }
        // this.recordData.list = res.data
      })
    },
    getDetail (id) {
      let data = {
        url: 'signin/getstudentstate/',
        t_sign_in_id: id
      }
      this.$store.dispatch('get', data).then((res) => {

      })
    },
    /**
       * 数字转中文
       * @param {Array} value value[0]为按钮文本 value[1]当行数据obj
       */
    handleBtn (value) {
      let type = value[0]
      let date = JSON.parse(value[1])
      if (type === '查看') {
        console.log(date)
        this.getDetail(date.t_signin_id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.line{
  width: 500px;
  height: 2px;
  margin: 60px auto 0px auto;
  background: #DFDFE2;
}
.table{
  margin: 20px auto;
}
</style>
