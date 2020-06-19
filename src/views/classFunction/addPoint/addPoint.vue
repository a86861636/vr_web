<template>
  <div class="addPoint">
    <div class="line">
    </div>
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData="tableData"></c-table>
    <el-dialog title="处理申请" :visible.sync="passDialog" width="500px">
      <el-form label-width="80px" ref="form"  :model="form">
        <div class="studentInfo">
          <img class="face" :src="mediaURL + selectInfo.student_pic">
          <div class="info">
            <div>
              {{selectInfo.student_name}}&nbsp;&nbsp;&nbsp;&nbsp;
              {{selectInfo.student_id}}
            </div>
            <div class="datetime">
              {{selectInfo.application_time}}
            </div>
          </div>
        </div>
        <el-form-item label="加分理由:">
          <div>{{selectInfo.reason}}</div>
        </el-form-item>
        <el-form-item label="加分数量:">
          <el-rate
            style="font-size: 30px"
            :max="3"
            v-model="form.star">
          </el-rate>
        </el-form-item>
        <el-button type="primary" @click="addPoint" style="display: block; margin: auto">通过</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
export default {
  name: 'HelloWorld',
  data () {
    return {
      passDialog: false,
      tableData: {
        title: ['名字', '学号', '理由', '申请时间', '操作'],
        list: [],
        data: [],
        btn: ['处理']
      },
      selectInfo: {

      },
      form: {
        star: 3
      }
    }
  },
  components: {
    'c-table': table
  },
  mounted () {
    this.getList()
  },
  computed: {
    mediaURL () {
      return this.$store.state.mediaURL
    }
  },
  methods: {
    // 获取试卷列表
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'signin/getaddpointapplication/',
        schedule_id: this.$store.state.courseInfo.dbid,
        teacher_id: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.tableData.list = []
        this.tableData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'student_id' || key === 'reason' || key === 'application_time' || key === 'student_name') {
              arr.push(item[key])
            }
          }
          this.tableData.list.push(arr)
        }
      })
    },
    // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      if (type === '处理') {
        this.selectInfo = data
        this.passDialog = true
      }
    },
    addPoint () {
      let data = {
        url: 'signin/handleaddpointapplication/',
        trans: true,
        schedule_id: this.$store.state.courseInfo.dbid,
        application_id: this.selectInfo.application_id,
        handle_state: 1,
        student_id: this.selectInfo.student_id,
        star: this.form.star + ''
      }
      this.$store.dispatch('post', data).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.passDialog = false
        this.getList()
      })
    }
  }
}
</script>
<style scoped>
.line{
  width: 500px;
  height: 60px;
  margin: 0px auto 0px auto;
  border-bottom: #DFDFE2 2px solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.table{
  margin: 20px auto;
}
.studentInfo{
  position: relative;
  padding-left: 80px;
  margin-bottom: 20px;
}
.file{
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translate(0,-50%);
  width: 45px;
  cursor: pointer;
}
.info{
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.face{
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 20px;
}
.datetime{
  font-size: 13px;
}
</style>
