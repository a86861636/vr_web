<template>
  <div class="question">
    <div class="line">
    </div>
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData="tableData"></c-table>
    <el-dialog title="学生问题" :visible.sync="answerDialog" width="500px">
      <!-- <div>
        {{selectInfo.stuname}}{{selectInfo.QASdatetime}}
      </div> -->
      <el-form label-width="70px">
        <el-form-item label="问题" prop="pass">
          <div>{{selectInfo.QAname}}</div>
        </el-form-item>
        <el-form-item label="回答" prop="pass">
          <el-input type="textarea" v-model="form.answer"></el-input>
        </el-form-item>
        <el-button type="primary" @click="reply" style="display: block; margin: auto">确定</el-button>
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
      answerDialog: false,
      tableData: {
        title: ['名字', '问题', '回答情况', '操作'],
        list: [],
        data: [],
        btn: ['回复']
      },
      selectInfo: {

      },
      form: {
        answer: ''
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
        url: 'qa/t/',
        scheduleid: this.$store.state.courseInfo.dbid,
        user_id: this.$store.state.userInfo.tloginid,
        user_type: 't'
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.tableData.list = []
        this.tableData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'stuname' || key === 'QAname') {
              arr.push(item[key])
            } else if (key === 'teachernote') {
              if (item[key] === 'null' || item[key] === '') {
                arr.push('否')
              } else {
                arr.push('是')
              }
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
      if (type === '回复') {
        this.selectInfo = data
        if (this.selectInfo.teachernote !== 'null') {
          this.form.answer = this.selectInfo.teachernote
        } else {
          this.form.answer = ''
        }
        this.answerDialog = true
      }
    },
    // 回复学生
    reply () {
      if (!this.form.answer) {
        this.$message({
          message: '不能为空'
        })
        return
      }
      let data = {
        url: 'qa/tpubqanote/',
        trans: true,
        id: this.selectInfo.id,
        teacherid: this.$store.state.userInfo.tloginid,
        teachernote: this.form.answer
      }
      this.$store.dispatch('post', data).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.form.answer = ''
        this.answerDialog = false
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
