<template>
  <div class="question">
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='listData'></c-table>
    <el-dialog class="detailDialog" title="查看提问" :visible.sync="is_detailShow">
      <!-- <div class="studentInfo">
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
      </div> -->
      <div class="ask">
        <div>教师提问：</div>
        <div class="content">{{currentQuestion.QAname}}</div>
      </div>
      <div class="answer-item" v-for="(item,index) in answerList" :key="index">
        <div class="studentInfo">
          <img class="face" :src="mediaURL + item.stupic">
          <div class="info">
            <div>
              {{item.stuname}}&nbsp;&nbsp;&nbsp;&nbsp;
              {{item.stuid}}
            </div>
            <div class="datetime">
              {{item.QASdatetime}}
            </div>
          </div>
        </div>
        <div class="answer">{{item.QAname}}</div>
      </div>
      <div class="user-answer">
        <div>学生回答：</div>
        <div class="content">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="answer">
          </el-input>
        </div>
      </div>
        <!-- <input type="file"  @change="selectedFile($event)"> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_detailShow = false">取消</el-button>
        <el-button type="primary" @click="uploadAnswer">回答</el-button>
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
      is_detailShow: false,
      listData: {
        title: ['问题', '附件', '创建时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看'] // 最后的按钮 没有可以空
      },
      currentQuestion: {},
      answerList: [],
      file: '',
      question: '',
      answer: ''
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
        this.showDetailDialog(data)
        this.getAnswerList(data.id)
      }
    },
    getList(){
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'questioning/t/',
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
            if (key === 'QAname' || key === 'QASdatetime' || key === 'QAmultimedia' || key === 'QAname') {
              if(key==='QAmultimedia'){
                arr.push(item[key]===''?'无':'有')
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
    getAnswerList(id){
      let data = {
        url: 'questioning/s/',
        questionid: id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.answerList = res.data
      })
    },
    selectedFile(e){
      this.file = event.target.files[0]
    },
    uploadAnswer(){
      // uni.uploadFile({
			// 		url: _self.globalUrl + 'questioning/spubqa/',
			// 		filePath: myfile,
			// 		name: 'myfile',
			// 		formData: {
			// 			studentid: _self.studentid,
			// 			qaname: text,
			// 			questioningid: _self.question.id
      // 		},
      let data = {
        url: 'questioning/spubqa/',
        param: new FormData()
      }
      data.param.append('studentid', this.$store.state.userInfo.id)
      data.param.append('qaname', this.answer)
      data.param.append('questioningid', this.currentQuestion.id)
      data.param.append('myfile', this.file)
      console.log(data)
      this.$store.dispatch('uploadFile', data).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.is_detailShow = false
        this.answer = ''
      })
    },
    showDetailDialog(data){
      console.log(data)
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
.answer-item{
  padding: 10px 0;
  border-bottom: 1px solid rgba(200,200,200,0.5);
  .studentInfo{
    position: relative;
    padding-left: 80px;
    margin-bottom: 10px;
    .info{
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .face{
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 20px;
    }
    .datetime{
      font-size: 12px;
    }
  }
  .answer{
    padding: 0 0 0 80px;
  }
}

.user-answer,.ask{
  margin: 0px 0 20px 0;
  padding-left: 20px;
  display: flex;
  flex-direction: row;

  .content{
    flex: 1;
    text-align: justify;
  }
}
.user-answer{
  margin: 20px 0 0 0;
}
</style>