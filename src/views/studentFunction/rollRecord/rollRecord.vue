<template>
  <div class="record">
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='recordData'></c-table>

    <el-dialog title="申请改勤" :visible.sync="is_dialogShow" width="500px">
      <div></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="changeState">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
export default {
  name: 'HelloWorld',
  data () {
    return {
      is_dialogShow: false,
      recordData: {
        title: ['日期', '打卡时间', '考勤情况', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['申请改勤'] // 最后的按钮 没有可以空
      },
      currentItem: {},
      form: {
        state: '',
        s_sign_in_id: ''
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
    /**
       * 获取点名记录
       */
    getList () {
      console.log(this.$store.state.userInfo.id)
      let data = {
        url: 'signin/ssigninrecords/',
        schedule_id: this.$store.state.courseInfo.dbid,
        student_id: this.$store.state.userInfo.id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.recordData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'data' || key === 'time' || key === 'status') {
              if(key === 'status'){
                if(item[key]===0){
                  arr.push('正常')
                }else if(item[key]===1){
                  arr.push('病假')
                }else if(item[key]===3){
                  arr.push('迟到')
                }else if(item[key]===2){
                  arr.push('缺勤')
                }
              }else{
                arr.push(item[key])
              }
            }
          }
          arr = [arr[1],arr[2],arr[0]]
          this.recordData.list.push(arr)
        }
        // this.recordData.list = res.data
      })
    },
    /**
       * 修改学生考勤状态
       */
    changeState () {
      let data = {
        url: 'signin/tsigninpost/' + this.form.s_sign_in_id + '/' + this.trans(this.form.state) + '/0/'
      }
      this.$store.dispatch('get', data).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getDetail(this.detail_id)
        this.is_dialogShow = false
      })
    },
    /**
       * 数字转中文
       * @param {Array} value value[0]为按钮文本 value[1]当行数据obj
       */
    trans (param) {
      for (let item of this.stateOption) {
        if (item.code === param) {
          return item.text
        } else if (item.text === param) {
          return item.code
        }
      }
    },
    /**
       * 数字转中文
       * @param {Array} value value[0]为按钮文本 value[1]当行数据obj
       */
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      if (type === '申请改勤') {
        this.is_dialogShow = true
        this.currentItem = data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.record{
  overflow: hidden;
}
.nodata{
  text-align: center;
}
.line{
  width: 500px;
  height: 60px;
  margin: 0px auto 0px auto;
  border-bottom: #DFDFE2 2px solid;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.back{
  width: 30px;
  height: 30px;
  display: block;
  cursor: pointer;
}
.table{
  margin: 20px auto;
}
</style>
