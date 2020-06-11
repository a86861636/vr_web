<template>
  <div class="check">
    <div class="subject" v-for="(i,index) in paper.data_list" :key="index">
      <div class="title">{{i.order}}.&nbsp;{{i.title}}</div>
      <div v-for="(j,index1) in i.exam_answer" :key="index1" class="option" :class="[{ active: j.active }, 'exam-answer']">{{abc[index1]}}.{{j.content}}</div>
      <div class="student-answer" v-if="i.type==3">学生回答：{{i.student_answer}}</div>
      <div class="bottom" v-if="i.type==3">
        <div v-if="i.type==3" class="answer">答案：无</div>
        <div class="score" style="border: 0">
          <div class="score-text">分数:</div>
          <input class="score-input" v-model="i.student_score">
          <div class="max-score">该题满分为{{i.question_score}}</div>
        </div>
      </div>
      <div class="bottom" v-if="i.type!=3">
        <div v-if="i.type!=3" class="answer">答案：{{i.exam_rightanswer_letter}}</div>
        <div class="score">分数：{{i.student_score}}</div>
      </div>
      <!-- <view class="right-answer">答案：{{item.right_answer}}</view>
      <view class="right-answer">分数：{{item.student_score}}</view> -->
    </div>
    <div @click="submitScore()" class="submit-button">提交</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      abc: ['A', 'B', 'C', 'D', 'E', 'F'],
      comment: '',
      paper: {
        data_list: [
          {
            'id': 185,
            'en_id': 38,
            'title': '2018年4月，十三届全国人民代表大会第一次会议通过《宪法修正案》。把国家倡导的社会主义核心价值观正式写入宪法，进一步凸显了社会主义核心价值观的重大意义。社会主义核心价值观是(　)。',
            'A': 'A.坚持和发展中国特色社会主义的价值遵循',
            'B': 'B.构建人类命运共同的行动指南',
            'C': 'C.增进社会团结和谐的最大公约数',
            'D': 'D.提高国家文化软实力的迫切要求',
            'E': 'null',
            'F': 'null',
            'answer_num': 4,
            'right_answer': '1,2,3',
            'student_answer': '3,4',
            'order': 1,
            'type': 2,
            'question_score': 25,
            'student_score': 0,
            'state': 0
          },
          {
            'id': 186,
            'en_id': 39,
            'title': '这是论述题',
            'A': 'null',
            'B': 'null',
            'C': 'null',
            'D': 'null',
            'E': 'null',
            'F': 'null',
            'answer_num': 4,
            'right_answer': '无正确答案',
            'student_answer': '4777',
            'order': 2,
            'type': 3,
            'question_score': 0,
            'student_score': '0',
            'state': 1
          }
        ]
      }
    }
  },
  created () {
    console.log(this.$route.query)
    this.getPaper()
  },
  methods: {
    handlePaperData (list) {
      for (let item of list) {
        let length = item.answer_num
        item.exam_answer = []
        item.exam_rightanswer_letter = item.right_answer
        for (let i = 0; i < length; i++) {
          if (item[this.abc[i]] !== 'null') {
            item.exam_answer.push({
              content: item[this.abc[i]].replace(this.abc[i] + '.', ''),
              active: item.student_answer.indexOf(i + 1) > -1
            })
            item.exam_rightanswer_letter = item.exam_rightanswer_letter.replace(i + 1, this.abc[i])
          }
        }
        item.exam_rightanswer_letter = item.exam_rightanswer_letter.replace(/,/g, '')
      }
      console.log(list)
      return list
    },
    submitScore () {
      let data = {
        url: 'exam/handlepaper/',
        ids: [],
        scores: [],
        trans: true,
        comment: this.comment
      }
      for (let item of this.paper.data_list) {
        console.log(item.student_score)
        if (item.student_score > item.question_score) {
          item.student_score = item.question_score
        }
        data.scores.push(Number(item.student_score))
        data.ids.push(item.id)
      }
      data.ids = String(data.ids)
      data.scores = String(data.scores)
      console.log(data)
      this.$store.dispatch('post', data).then((res) => {
        console.log(res)
      })
    },
    getPaper (stuId, paperId) {
      let data = {
        url: 'exam/getanswerdetail/',
        student_pid: 805 || this.$route.query.stuId,
        user_type: 't',
        released_paper_id: 17 || this.$route.query.paperId
      }
      this.$store.dispatch('get', data).then((res) => {
        res.data_list = this.handlePaperData(res.data_list) || []
        this.paper = res
        console.log(this.paper)
      })
    }
  }
}
</script>
<style scoped>
.check{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.subject{
  width: 420px;
  padding: 20px;
  border:1px solid rgba(218,218,218,1);
  margin-top: 30px;
}
.option{
  margin-top: 10px;
  color: #A7A7A7;
}
.active{
  color: rgba(255,67,76,1);
}
.bottom{
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.student-answer{
  margin-top: 10px;
  color: #A7A7A7;
}
.answer,.score{
  border: 1px solid rgba(151,151,151,1);
  border-radius: 8px;
  width: 105px;
  line-height: 28px;
  text-align: center;
  position: relative;
}
.score-text{
  position: absolute;
  right: 40%;
  white-space: nowrap;
}
.score-input{
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  font-size: 16px;
  border: 0;
  height: 100%;
  padding: 0 0 0 40%;
  border: 1px solid rgba(151,151,151,1);
  border-radius: 8px;
}
.max-score{
  position: absolute;
  left: 50%;
  transform: translate(-50%,85%);
  text-align: center;
  bottom: 0;
  color: rgba(255,67,76,1);
  font-size: 13px;
  white-space: nowrap;
}
.submit-button{
  width: 80px;
  height: 45px;
  line-height: 45px;
  background:rgba(255,180,184,1);
  box-shadow:0px 4px 8px 0px rgba(162,162,162,0.5);
  border-radius:16px;
  text-align: center;
  color: rgba(255,255,255,1);
  font-size: 22px;
  margin: 45px auto 30px auto;
}
</style>
