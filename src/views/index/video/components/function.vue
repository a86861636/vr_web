<template>
  <div>
    <div class="header">
      <el-select v-if="path==='function'" class="selectSchedile" v-model="schedule_id" placeholder="请选择课程">
        <el-option
          v-for="item in courseList"
          :key="item.schedule_id"
          :label="item.schedule_name"
          :value="item.schedule_id">
        </el-option>
      </el-select>
      <img v-if="path!=='function'" class="back" @click="changePath('function')" src="@/assets/index/back.png" alt="">
      <!-- <div v-if="path==='quiz'" class="quiz-add" @click="showAddQuizDialog">添加</div> -->
      <img v-if="path==='quiz'" class="back" @click="showAddQuizDialog" src="@/assets/index/add.png" alt="">
    </div>
    <div class="function" v-if="path==='function'">
      <div class="item" v-for="(item,index) in funList" :key="index" @click="changePath(item.path)">
        <img class="icon" :src="item.icon" alt="">
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <div class="work" v-if="path==='work'">
      <nodata :nodata="workList.length===0"></nodata>
      <div class="item" v-for="(item,index) in workList" :key="index">
        <div class="name">{{item.name}}</div>
        <div class="time">{{item.datetime}}</div>
        <div class="bottom"></div>
        <div class="btn" @click="showWorkDetial(item)">{{!item.studentanswerfile&&!item.studentanswer?'提交':'查看'}}</div>
      </div>
    </div>
    <div class="quiz" v-if="path==='quiz'">
      <nodata :nodata="quizList.length===0"></nodata>
      <div class="item" v-for="(item,index) in quizList" :key="index">
        <div class="name">{{item.QAname}}</div>
        <div class="time">{{item.QASdatetime}}</div>
        <div class="bottom"></div>
        <div class="btn" @click="showQuizDetail(item)">查看</div>
      </div>
    </div>
    <div class="exam" v-if="path==='exam'">
      <nodata :nodata="examList.length===0"></nodata>
      <div class="item" v-for="(item,index) in examList" :key="index">
        <div class="name">{{item.exampaper_name}}</div>
        <div class="time">{{item.releaseexam_datetime}}</div>
        <div class="bottom"></div>
        <div :class="{btn:true, done:item.is_done}" @click="getExamDetail(item.exampaper_releaseid,item.is_done)">{{item.is_done?'查看':'提交'}}</div>
      </div>
    </div>
    <el-dialog
      class="quizDialog"
      title="疑问解答"
      :visible.sync="quizDialogShow"
      width="720px"
      center>
      <div>
        <div class="userInfo">
          <img class="face" :src="mediaURL+currentQuiz.student_pic" alt="">
          <div class="name-box">
            <div class="name">{{currentQuiz.stuname}}</div>
            <div class="number">{{currentQuiz.student_id}}</div>
          </div>
          <div class="time">{{currentQuiz.QASdatetime}}</div>
        </div>
        <div class="question">
          {{currentQuiz.QAname}}
        </div>
        <div class="answer-box">
          <div class="tt">教师答复</div>
          <div class="answer">{{currentQuiz.teachernote==='null'?'暂无答复':currentQuiz.teachernote}}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="workDialog"
      title="作业提交"
      :visible.sync="workDialogShow"
      width="720px"
      center>
      <div>
        <div class="title">
          <div class="tt">作业题目：</div>
          <div>{{currentWork.name}}</div>
          <img v-if="currentWork.multimediafile" src="@/assets/index/downloadR.png" @click="download(currentWork.multimediafile)" class="file-download" alt="">
        </div>
        <div class="note">
          <div class="tt">作业备注：</div>
          <div>{{currentWork.note}}</div>
        </div>
        <div class="input-box">
          <div class="file-box" v-if="!currentWork.done">
            <input :disabled="currentWork.done" @change="selectFile" class="file-input" type="file">
            <img class="file-img" src="@/assets/index/file.png" alt="">
            <div class="file-text">{{workForm.fileName || '上传附件'}}</div>
          </div>
          <div class="file-box" v-if="workForm.file && currentWork.done" @click="download(workForm.file)">
            <img class="file-img" src="@/assets/index/file.png" alt="">
            <div class="file-text">{{workForm.fileName}}</div>
          </div>
          <el-input
            class="work-input"
            type="textarea"
            :disabled="currentWork.done"
            :autosize="{ minRows: 10, maxRows: 20}"
            placeholder="请输入答案"
            v-model="workForm.text">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeWorkDialog">取 消</el-button>
        <el-button type="primary" v-if="!currentWork.done" @click="uploadWork">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="课堂提问" :visible.sync="addQuizDialogShow">
      <el-form :model="addQuizForm">
        <el-form-item label="问题">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="addQuizForm.question">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addQuizDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="uploadQuiz">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="examDialog" title="试卷作答" :visible.sync="examDialogShow">
      <div class="list">
        <div class="item" v-for="(item,index) in currentPaper.question_list" :key="index">
          <img class="type" src="@/assets/index/单选题.png" v-if="item.type===1" alt="">
          <img class="type" src="@/assets/index/多选题.png" v-if="item.type===2" alt="">
          <img class="type" src="@/assets/index/简答题.png" v-if="item.type===3" alt="">
          <div class="tt">
            {{(index + 1) + '.' + item.title}}
            &nbsp;&nbsp;&nbsp;{{'正确答案：' + item.right_letterAnswer}}
          </div>
          <div v-for="(option,index1) in item.option" :key="index1" :class="{option: true,active: option.active}" @click="selectOption(item.option, index1, item.type)">
            {{abc[index1]+'.'+option.text.replace([abc[index1]] + '.', '')}}
          </div>
          <el-input
            :disabled="currentPaper.is_done"
             v-if="item.type===3"
            type="textarea"
            :rows="2"
            style="margin-top: 10px"
            placeholder="请输入内容"
            v-model="item.textAnswer">
          </el-input>
        </div>
      </div>
      <div class="score" v-if="currentPaper.total_score!=='null'">
        {{'分数：' + currentPaper.score}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examDialogShow = false">取消</el-button>
        <el-button type="primary" v-if="!currentPaper.is_done" @click="uploadExamAnswer">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import downloadfile from '@/utils/utils.js'
import nodata from '@/components/nodata'
export default {
  name: 'Fun',
  data () {
    return {
      schedule_id: '',
      path: 'function',
      abc: ['A', 'B', 'C', 'D', 'E', 'F'],
      funList: [
        {
          name: '课堂作业',
          path: 'work',
          icon: require('@/assets/index/zuoye.png')
        },
        {
          name: '随堂小测',
          path: 'exam',
          icon: require('@/assets/index/ceyan.png')
        },
        {
          name: '课堂答疑',
          path: 'quiz',
          icon: require('@/assets/index/dayi.png')
        }
      ],
      workList: [
      ],
      quizList: [],
      courseList: [],
      examList: [],
      workDialogShow: false,
      quizDialogShow: false,
      addQuizDialogShow: false,
      examDialogShow: false,
      currentWork: {},
      currentQuiz: {},
      currentPaper: {
        question_list: [],
        release_id: '',
        is_done: false,
        submit_time: '',
        score: ''
      },
      workForm: {
        text: '',
        file: '',
        fileName: '',
        done: false
      },
      addQuizForm: {
        question: ''
      }
    }
  },
  components: {
    nodata: nodata
  },
  created () {
    this.getCourseList()
  },
  computed: {
    mediaURL () {
      return this.$store.state.mediaURL
    }
  },
  methods: {
    download (path, done) {
      downloadfile(this.mediaURL + path, path.split('/').reverse()[0])
    },
    selectFile (e) {
      this.workForm.fileName = e.target.files[0].name
      this.workForm.file = e.target.files[0]
    },
    uploadWork () {
      let data = {
        url: 'homework/spubhomeworkanswer/',
        param: new FormData()
      }
      data.param.append('studentid', this.$store.state.userInfo.id)
      data.param.append('scheduleid', this.schedule_id)
      data.param.append('homeworkid', this.currentWork.releaseid)
      data.param.append('homeworkstudentanswer', this.workForm.text)
      data.param.append('myfile', this.workForm.file)
      this.$store.dispatch('uploadFile', data).then(res => {
        if (res.code === 200) {
          this.closeWorkDialog()
          this.getWorkList()
        }
      })
    },
    showWorkDetial (item) {
      this.workDialogShow = true
      item.done = !(!item.studentanswerfile && !item.studentanswer)
      this.workForm.text = item.studentanswer
      this.workForm.file = item.studentanswerfile
      this.workForm.fileName = item.studentanswerfile.split('/').reverse()[0]
      this.currentWork = item
    },
    showQuizDetail (item) {
      this.quizDialogShow = true
      this.currentQuiz = item
    },
    showAddQuizDialog () {
      this.addQuizDialogShow = true
    },
    uploadQuiz () {
      let data = {
        url: 'qa/spubqa/',
        trans: true,
        scheduleid: this.schedule_id,
        studentid: this.$store.state.userInfo.id,
        qaname: this.addQuizForm.question
      }
      this.$store.dispatch('post', data).then((res) => {
        console.log(res)
        this.getQuizList()
        this.addQuizDialogShow = false
      })
    },
    uploadExam () {

    },
    changePath (path) {
      if (!this.schedule_id) {
        this.$message({
          message: '请选择课程'
        })
      } else {
        this.path = path
        if(path === 'work'){
          this.getWorkList()
        }else if(path==='quiz'){
          this.getQuizList()
        }else if(path==='exam'){
          this.getExamList()
        }
      }
    },
    getCourseList () {
      let data = {
        url: 'schedule/getSchedule/',
        user_id: this.$store.state.userInfo.id,
        user_type: 's',
        semesterdate_id: this.$store.state.userInfo.current_semester
      }
      this.$store.dispatch('get', data).then((res) => {
        this.courseList = res.schedule_data
      })
    },
    getExamList () {
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'exam/b/',
        studentid: userId,
        scheduleid: this.schedule_id
      }
      this.$store.dispatch('get', data).then((res) => {
        // if (res.id.length > 0) {
        //   for (let i = 0; i < res.id.length; i++) {
        //     for (let key in res) {
        //       this.examList[i][key] = res[key][i]
        //     }
        //   }
        // }
        this.examList = res.data
      })
    },
    getExamDetail (id, done) {
      // if (done) {
      //   return false
      // }
      this.currentPaper.is_done = done
      this.examDialogShow = true
      this.currentPaper.release_id = id
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'exam/getanswerdetail/',
        user_type: 's',
        released_paper_id: id,
        student_pid: userId
      }
      this.$store.dispatch('get', data).then((res) => {
        for (let item of res.data_list) {
          let abc = this.abc
          item.option = []
          item.textAnswer = ''
          item.right_letterAnswer = item.right_answer
          if (item.type !== 3) {
            for (let i = 0; i < item.answer_num; i++) {
              let obj = {
                text: item[abc[i]],
                active: item.student_answer.indexOf(i + 1) > -1
              }
              item.right_letterAnswer = item.right_letterAnswer.replace((i+1),abc[i])
              item.option.push(obj)
            }
          }
        }
        this.currentPaper.score = res.total_score
        this.currentPaper.submit_time = res.submit_time
        this.currentPaper.question_list = res.data_list
      })
    },
    selectOption (option, index, type) {
      if (this.currentPaper.is_done) {
        return false
      }
      if (type === 1) {
        for (let item of option) {
          item.active = false
        }
        option[index].active = !option[index].active
      } else if (type === 2) {
        option[index].active = !option[index].active
      }
    },
    uploadExamAnswer () {
      let data = {
        url: 'exam/submitpaper/',
        trans: true,
        student_id: this.$store.state.userInfo.id,
        released_paper_id: this.currentPaper.release_id,
        schedule_id: this.schedule_id,
        en_ids: [],
        answers: '['
      }
      for (let item of this.currentPaper.question_list) {
        console.log(item)
        data.en_ids.push(item.en_id)
        if (item.type !== 3) {
          let answer = []
          let i = 0
          for (let option of item.option) {
            i++
            if (option.active) {
              answer.push(i)
            }
          }
          if (answer.length === 0) {
            data.answers = data.answers + '"",'
          } else {
            data.answers = data.answers + '"' + answer.toString() + '"' + ','
          }
        } else {
          data.answers = data.answers + '"' + item.textAnswer.toString() + '"' + ','
        }
      }
      data.en_ids = '[' + data.en_ids.toString() + ']'
      data.answers = data.answers.substr(0, data.answers.length - 1) + ']'
      this.$store.dispatch('post', data).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.examDialogShow = false
          this.getExamList()
        }
      })
    },
    // qa/t/
    getQuizList () {
      let data = {
        url: 'qa/t/',
        scheduleid: this.schedule_id,
        user_id: this.$store.state.userInfo.id,
        user_type: 's'
      }
      this.$store.dispatch('get', data).then((res) => {
        this.quizList = res.data
      })
    },
    getWorkList () {
      let data = {
        url: 'homework/s/',
        scheduleid: this.schedule_id,
        studentid: this.$store.state.userInfo.id
      }
      this.$store.dispatch('get', data).then((res) => {
        for(let item of res.data){
          item.studentanswer = ''
        }
        this.workList = res.data.reverse()
      })
    },
    closeWorkDialog () {
      this.workDialogShow = false
      this.workForm = {
        text: '',
        file: '',
        fileName: '',
        done: false
      }
    },
    showSureBox () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitWork () {}
  }
}
</script>
<style lang="less" scoped>
.header{
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 50px;
  .back{
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
}
.function{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 300px;
  align-items: center;
  .name{
    margin-top: 20px;
    text-align: center;
    color: #474747;
    font-size: 22px;
  }
}
.work,.quiz,.exam{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;

  .item{
    margin-bottom: 30px;
    height: 60px;
    width: 50%;
    padding: 0 55px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name{
      color: #232323;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 270px;
      overflow: hidden;
    }
    .time{
      color: #999999;
      font-size: 14px;
    }
    .bottom{
      height: 1px;
      background: #E0E0E0;
      left: 50%;
      bottom: 0;
      position: absolute;
      transform: translate(-50%,0);
      width:400px;
    }
    .btn{
      position: absolute;
      width: 86px;
      line-height: 34px;
      color: white;
      background: #F9675A;
      text-align: center;
      border-radius: 5px;
      right: 50px;
      top: 50%;
      transform: translate(0,-50%);
      cursor: pointer;
    }
    .done{
      background: #bfbfbf;
    }
  }
}
.workDialog{
  .stuInfo{
    font-size: 16px;
    color: #878787;
    position: relative;
    padding-left: 80px;
    .face{
      position: absolute;
      border: 1px solid #cdcdcd;
      left: 0;
      top: 0;
      height: 60px;
      width: 60px;
      display: block;
      overflow: hidden;
      border-radius: 50%;
    }
    .time{
      margin-top: 20px;
      font-size: 14px;
    }
  }
  .title{
    display: flex;
    flex-direction: row;
  }
  .tt{
    width: 70px;
    white-space: nowrap;
  }
  .note{
    margin-top: 10px;
    display: flex;
    flex-direction: row;
  }
  .input-box{
    margin-top: 15px;
    position: relative;
    .file-box{
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 99;
      cursor: pointer;

      .file-input{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      .file-img{
        width: 22px;
        height: 20px;
        display: block;
        margin: auto;
      }
      .file-text{
        margin-top: 5px;
        color: #F9675A;
        font-size: 12px;
        width: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .file-download{
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin-left: 20px;
    cursor: pointer;
  }
}
.quizDialog{
  .userInfo{
    position: relative;
    padding: 0 0 0 80px;
    display: flex;
    height: 60px;
    flex-direction: column;
    justify-content: space-between;
    .face{
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      display: block;
    }
    .name-box{
      display: flex;
      flex-direction: row;
      font-size: 16px;
      color: #878787;
      .number{
        margin-left: 20px;
      }
    }
    .time{
      font-size: 16px;
      color: #878787;
    }
  }
  .question{
    margin-top: 13px;
    border-radius:6px;
    padding: 5px 13px;
    border:1px solid rgba(200,200,200,1);
    min-height: 50px;
  }
  .line{
    margin: 14px 0;
    height:14px;
    background:rgba(243,243,243,1);
  }
  .answer-box{
    margin-top: 20px;
    .tt{
      color: #454545;
      font-size: 16px;
      font-weight: 600;
    }
    .answer{
      margin-top: 13px;
      border-radius:6px;
      padding: 5px 13px;
      border:1px solid rgba(200,200,200,1);
      min-height: 50px;
    }
  }
}
.examDialog{
  .item{
    margin-bottom: 20px;
    position: relative;
    padding: 4px 0px 0 30px;
    .type{
      position: absolute;
      left: 0;
      top: 0;
      height: 25px;
      width: 25px;
    }
    .option{
      margin: 5px 0 0px 0;
      cursor: pointer;
    }
    .active{
      color: red;
    }
  }
  .score{
    width:86px;
    line-height:34px;
    border-radius:2px;
    color: #CA0000;
    text-align: center;
    border:1px solid rgba(202,0,0,1);
    margin: auto;
  }
}
</style>
