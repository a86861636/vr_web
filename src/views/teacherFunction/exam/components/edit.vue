<template>
  <div class="new">
    <!-- <el-steps :active="mode" finish-status="success" align-center>
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps> -->
    <div v-if="mode==1">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="试卷名称" prop="paper_name">
          <el-input v-model="form.paper_name"></el-input>
        </el-form-item>
        <el-form-item label="试卷说明" prop="note">
          <el-input v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item label="学期占比%" prop="proportion">
          <el-input v-model.number="form.proportion"></el-input>
        </el-form-item>
        <div class="btnBox">
          <el-button type="primary" @click="nextPart">下一步</el-button>
        </div>
      </el-form>
    </div>
    <div v-if="mode==2">
      <div class="typeSwtich">
        <el-radio v-model="type" :label="1">公共题库</el-radio>
        <el-radio v-model="type" :label="2">私人题库</el-radio>
      </div>
      <div class="question-box">
        <div v-if="type==1">
          <div v-for="(item,index) in publicBank" :key="index" :class="{ 'question-item':true,'active': item.active }" @click="item.active=!item.active">{{item.name}}</div>
          <img v-if="publicBank.length==0" class="nodata" src="@/assets/classFunciton/none.png" />
        </div>
        <div v-if="type==2">
          <div v-for="(item,index) in personalBank" :key="index" :class="{ 'question-item':true,'active': item.active }" @click="item.active=!item.active">{{item.name}}</div>
          <img v-if="personalBank.length==0" class="nodata" src="@/assets/classFunciton/none.png" />
        </div>
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="lastPart">上一步</el-button>
        <el-button type="primary" @click="nextPart">下一步</el-button>
      </div>
    </div>
    <div v-if="mode==3">
      <div>试卷预览-拖拽改变顺序</div>
      <div class="question-box">
        <draggable element="ul" class="ul" v-model="selectedQus">
          <transition-group>
            <li v-for="(item,index) in selectedQus" :key="'item'+index" :class="{ 'question-item':true}">
              <div>{{index+1+'.'+item.name}}</div>
              <div class="question-score">
                分数:&nbsp;<el-input-number v-model="item.score" size="mini" controls-position="right" :min="0"></el-input-number>
              </div>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="lastPart">上一步</el-button>
        <el-button type="primary" @click="createPaper">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'HelloWorld',
  data () {
    return {
      mode: 1,
      type: 1,
      form: {
        paper_name: '1',
        note: '1',
        proportion: 1,
        full_marks: '',
        scores: '',
        questions: '',
        sources: '',
        paper_id: '',
        teacher_id: ''
      },
      rules: {
        paper_name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        proportion: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ]
      },
      isDragging: false,
      publicBank: [],
      personalBank: [],
      selectedQus: [],
      editSelected: {
        id: [],
        score: []
      }
    }
  },
  mounted () {
    this.form.paper_name = this.editData.paper_name
    this.form.note = this.editData.paper_note
    this.form.proportion = this.editData.paper_percent
    this.form.paper_id = this.editData.paper_id
    this.handleEditSelected()
    this.getPublicBank()
    this.getPersonalBank()
  },
  components: {draggable},
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  props: ['editData'],
  methods: {
    handleEditSelected () {
      let idArr = []
      let idArr1 = []
      let scoreArr = []
      let scoreArr1 = []
      if (this.editData.exam_ids) {
        let ids = this.editData.exam_ids.split(',')
        let froms = this.editData.exam_from.split(',')
        let scores = this.editData.exam_scores.split(',')
        for (let i = 0; i < ids.length; i++) {
          if (froms[i] === '0') {
            idArr.push(ids[i])
            scoreArr.push(scores[i])
          } else {
            idArr1.push(ids[i])
            scoreArr1.push(scores[i])
          }
        }
      }
      this.editSelected.id = [ idArr, idArr1 ]
      this.editSelected.score = [ scoreArr, scoreArr1 ]
    },
    lastPart () {
      this.mode--
    },
    nextPart () {
      switch (this.mode) {
        case 1:
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.mode++
            } else {
              this.$message({
                message: '数据有误'
              })
              return false
            }
          })
          break
        case 2:
          this.selectedQus = []
          for (let item of this.publicBank) {
            if (item.active) {
              this.selectedQus.push(item)
            }
          }
          for (let item of this.personalBank) {
            if (item.active) {
              this.selectedQus.push(item)
            }
          }
          if (this.selectedQus.length) {
            this.mode++
          } else {
            this.$message({
              message: '请选择题目'
            })
          }
      }
    },
    handleData (data, source) {
      let res = []
      for (let i = 0; i < data.id.length; i++) {
        let index = this.editSelected.id[source].indexOf(data.id[i])
        let item = {
          id: data.id[i],
          name: data.name[i],
          type: data.type[i],
          note: data.note[i],
          rightanswer: data.rightanswer[i],
          answers: [
            data.answer1[i],
            data.answer2[i],
            data.answer3[i],
            data.answer4[i],
            data.answer5[i],
            data.answer6[i]
          ],
          score: Number(this.editSelected.score[source][index]) || 0,
          source: source,
          active: index > -1
        }
        res.push(item)
      }
      return res.reverse()
    },
    getPersonalBank () {
      let data = {
        url: 'exam/myexam/' + this.$store.state.userInfo.id + '/',
        user_id: this.$store.state.userInfo.id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.personalBank = this.handleData(res, 1)
      })
    },
    getPublicBank () {
      let data = {
        url: 'exam/' + this.$store.state.userInfo.id + '/',
        user_id: this.$store.state.userInfo.id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.publicBank = this.handleData(res, 0)
      })
    },
    createPaper () {
      let data = {
        url: 'exam/editpaper/',
        trans: true,
        paper_id: this.form.paper_id,
        paper_title: this.form.paper_name,
        note: this.form.note,
        multimedia: '',
        percent: this.form.proportion,
        full_mark: 0,
        scores: [],
        questions: [],
        sources: [],
        teacher_id: this.$store.state.userInfo.id
        // paper_id: this.exampaperid,
        // paper_title: this.form.paper_name,
        // note: this.form.note,
        // multimedia: "",
        // full_mark: this.form.full_marks,
        // percent: this.form.proportion,
        // questions: this.form.questions,
        // scores: this.form.scores,
        // sources:  this.form.sources,
        // teacher_id: this.tId
      }
      for (let item of this.selectedQus) {
        data.full_marks += item.score
        data.scores.push(item.score)
        data.questions.push(item.id)
        data.sources.push(item.source)
      }
      data.scores = String(data.scores)
      data.questions = String(data.questions)
      data.sources = String(data.sources)
      this.$store.dispatch('post', data).then((res) => {
        this.$emit('fresh')
        this.$emit('close')
      })
    }
  }
}
</script>
<style scoped>
.new{
  display: flex;
  flex-direction: column;
}
.btnBox{
  display: flex;
  justify-content: center;
}
.question-box{
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  margin: 20px 0;
  border: #DFDFE2 2px solid;
}
.question-item{
  width: 90%;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  margin: 20px auto 0 auto;
  padding: 10px;
  text-align: justify;
  box-sizing: border-box;
  cursor: pointer;
}
.question-item:last-child{
  margin: 20px auto 20px auto;
}
.question-score{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
}
.active{
  background: rgba(246, 86, 86, 1);
  color: white;
}
.nodata{
  display: block;
  margin: auto;
  height: 200px;
}
.ul{
  list-style-type: none;
}
</style>
