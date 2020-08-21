<template>
  <div class="hello">
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='paperData'></c-table>
    <el-dialog class="paperDialog" title="试卷作答" :visible.sync="paperDialogShow">
      <div class="list">
        <div class="item" v-for="(item,index) in currentPaper.question_list" :key="index">
          <img class="type" src="@/assets/classFunciton/单选题.png" v-if="item.type===1" alt="">
          <img class="type" src="@/assets/classFunciton/多选题.png" v-if="item.type===2" alt="">
          <img class="type" src="@/assets/classFunciton/简答题.png" v-if="item.type===3" alt="">
          <div class="tt">
            {{(index + 1) + '.' + item.title}}
            <span v-if="item.abc_answer" class="right_answer">
              {{'正确答案：' + item.abc_answer}}
            </span>
          </div>
          <div v-for="(option,index1) in item.option" :key="index1" :class="{option: true,active: option.active}" @click="selectOption(item.option, index1, item.type)">
            {{abc[index1]+'.'+option.text.replace([abc[index1]] + '.', '')}}
          </div>
          <el-input
            :disabled="currentPaper.is_done"
             v-if="item.type===3"
            type="textarea"
            class="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="item.textAnswer">
          </el-input>
        </div>
      </div>
      <div class="score" v-if="currentPaper.is_done">
        {{'分数：' + currentPaper.score}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paperDialogShow = false">取消</el-button>
        <el-button type="primary" v-if="!currentPaper.is_done" @click="uploadPaperAnswer">提交</el-button>
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
      abc: ['A', 'B', 'C', 'D', 'E', 'F'],
      paperData: {
        title: ['试卷名称', '说明', '创建时间', '情况', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['作答'] // 最后的按钮 没有可以空
      },
      paperDialogShow: false,
      currentPaper: {
        question_list: [],
        release_id: '',
        is_done: false,
        submit_time: '',
        score: ''
      },
    }
  },
  components: {
    'c-table': table
  },
  mounted(){
    this.getPaperList()
  },
  methods: {
    // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      console.log(data)
      if (type === '作答') {
        this.paperDialogShow = true
        this.getPaperDetail(data.exampaper_releaseid,data.is_done)
      }
    },
    getPaperList(){
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'exam/b/',
        studentid: userId,
        scheduleid: this.$store.state.courseInfo.dbid
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.paperData.list = []
        this.paperData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 'exampaper_releaseid' && key !== 'exampaperid' ) {
              if(key === 'is_done'){
                arr.push(item[key]?'已完成':'未提交')
              }else{
                arr.push(item[key])
              }
            }
          }
          // let sortArr = [arr[1], arr[0], this.trans(arr[2])]
          this.paperData.list.push(arr)
        }
      })
    },
    getPaperDetail (id, done) {
      this.currentPaper.is_done = done
      this.paperDialogShow = true
      this.currentPaper.release_id = id
      let data = {}
      let userId = this.$store.state.userInfo.id
      if(done){
        data = {
          url: 'exam/getanswerdetail/',
          user_type: 's',
          released_paper_id: id,
          student_pid: userId
        }
      } else {
        data = {
          url: 'exam/stugetpaperdetail/',
          released_paper_id: id
        }
      }
      this.$store.dispatch('get', data).then((res) => {
        if(done){
          for (let item of res.data_list) {
            let abc = this.abc
            item.option = []
            item.textAnswer = ''
            item.abc_answer = ''
            if (item.type !== 3) {
              for (let i = 0; i < item.answer_num; i++) {
                let obj = {
                  text: item[abc[i]],
                  active: item.student_answer.indexOf(i + 1) > -1
                }
                if(item.right_answer.indexOf(i + 1) > -1){
                  item.abc_answer = item.abc_answer + abc[i]
                }
                item.option.push(obj)
              }
            }
          }
          this.currentPaper.score = res.total_score
          this.currentPaper.submit_time = res.submit_time
          this.currentPaper.question_list = res.data_list
        } else {
          for (let item of res.data) {
            let abc = this.abc
            item.option = []
            item.textAnswer = ''
            item.type = item.question_type 
            if (item.type !== 3) {
              for (let i = 0; i < item.answer_num; i++) {
                let obj = {
                  text: item[abc[i]],
                  active: false
                }
                item.option.push(obj)
              }
            }
          }
          this.currentPaper.score = ''
          this.currentPaper.submit_time = res.start_time
          this.currentPaper.question_list = res.data
        }
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
    uploadPaperAnswer () {
      let data = {
        url: 'exam/submitpaper/',
        trans: true,
        student_id: this.$store.state.userInfo.id,
        released_paper_id: this.currentPaper.release_id,
        schedule_id: this.$store.state.courseInfo.dbid,
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
  }
}
</script>
<style lang="less" scoped>
.table{
  margin: 30px auto;
}
.paperDialog{
  .item{
    margin-bottom: 20px;
    position: relative;
    padding: 4px 0px 0 30px;
    .tt{
      line-height: 1.5;
    }
    .type{
      position: absolute;
      left: 0;
      top: 0;
      height: 25px;
      width: 25px;
    }
    .option{
      margin: 10px 0 0px 0;
      cursor: pointer;
    }
    .active{
      color: red;
    }
    .right_answer{
      color: red;
    }
  }
  .textarea{
    margin-top: 10px;
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
