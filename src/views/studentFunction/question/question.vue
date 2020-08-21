<template>
  <div class="question">
    <div class="line">
      <el-button type="danger" class="add" size="small" @click="is_createShow = true">发出提问</el-button>
    </div>
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='listData'></c-table>
    <el-dialog class="createDialog" title="发出提问" :visible.sync="is_createShow">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="question">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_createShow = false">取消</el-button>
        <el-button type="primary" @click="uploadQuestion">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog class="detailDialog" title="查看提问" :visible.sync="is_detailShow">
      <div class="studentInfo">
        <img class="face" :src="mediaURL + currentQuestion.student_pic">
        <div class="info">
          <div>
            {{currentQuestion.stuname}}&nbsp;&nbsp;&nbsp;&nbsp;
            {{currentQuestion.student_id}}
          </div>
          <div class="datetime">
            {{currentQuestion.application_time}}
          </div>
        </div>
      </div>
      <div class="ask">
        <div>学生提问：</div>
        <div class="content">{{currentQuestion.QAname}}</div>
      </div>
      <div class="answer">
        <div>教师回答：</div>
        <div class="content">{{currentQuestion.teachernote}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_detailShow = false">取消</el-button>
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
      msg: 'Welcome to Your Vue.js App',
      is_createShow: false,
      is_detailShow: false,
      listData: {
        title: ['学生', '问题', '答复情况', '创建时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看'] // 最后的按钮 没有可以空
      },
      currentQuestion: {},
      question: ''
    }
  },
  components: {
    'c-table': table
  },
  mounted() {
    this.getList()
  },
  computed: {
    mediaURL(){
      return this.$store.state.mediaURL
    }
  },
  methods: {
     // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      console.log(data)
      if (type === '查看') {
        if(data.teachernote === 'null'){
          this.$message({
          message: '暂无回答'
        })
        }else{
          this.showDetailDialog(data)
        }
      }
    },
    getList(){
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'qa/t/',
        scheduleid: this.$store.state.courseInfo.dbid,
        studentid: userId
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        res.data = res.data.reverse()
        this.listData.list = []
        this.listData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'QAname' || key === 'stuname' || key === 'QATdatetime' || key === 'teachernote') {
              if(key==='teachernote'){
                arr.push(item[key]==='null'?'未答复':'已答复')
              }else{
                arr.push(item[key])
              }
            }
          }
          // let sortArr = [arr[1], arr[0], this.trans(arr[2])]
          this.listData.list.push(arr)
        }
      })
    },
    uploadQuestion(){
      if(this.question === ''){
        this.$message({message: '提问不能为空'})
        return false
      }
      let data = {
        url: 'qa/spubqa/',
        trans: true,
        scheduleid: this.$store.state.courseInfo.dbid,
        studentid: this.$store.state.userInfo.id,
        qaname: this.question
      }
      this.$store.dispatch('post', data).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.is_createShow = false
        this.question = ''
      })
    },
    showDetailDialog(data){
      this.currentQuestion = data
      this.is_detailShow = true
    }
  }
}
</script>
<style lang="less" scoped>
.question{
  
}
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
  margin: 20px auto 30px auto;
}
.studentInfo{
  position: relative;
  padding-left: 80px;
  margin-bottom: 20px;
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
.answer,.ask{
  margin: 20px 0 0 0;
  padding-left: 20px;
  display: flex;
  flex-direction: row;

  .content{
    flex: 1;
    text-align: justify;
  }
}
</style>