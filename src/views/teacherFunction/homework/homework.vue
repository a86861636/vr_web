<template>
  <div class="record">
    <div class="line">
      <img class="back" src="@/assets/classFunciton/back.png" @click="back" v-if="mode === 3" />
      <el-select v-model="mode" placeholder="请选择" size="small" style="width: 120px;" v-if="mode!==3">
        <el-option
          label="已发布"
          :value="1"
        >
        </el-option>
        <el-option
          label="作业库"
          :value="2"
        >
        </el-option>
      </el-select>
      <el-button type="danger" v-if="mode===2" class="add" size="small"  @click="newDialog=true">新建作业</el-button>
    </div>

    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='tableData'></c-table>

    <el-dialog title="作业总结" :visible.sync="summaryDialog" width="500px">
      <el-form label-width="80px" :rules="rules" ref="summaryForm"  :model="summaryForm">
        <el-form-item prop="summary" label="总结">
          <el-input v-model="summaryForm.summary" type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" @click="saveSummary" style="display: block; margin: auto">保存</el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="新建作业" :visible.sync="newDialog" width="500px">
      <el-form label-width="80px" :rules="rules" ref="newForm"  :model="newForm">
        <el-form-item prop="homeworkname" label="题目">
          <el-input v-model="newForm.homeworkname"></el-input>
        </el-form-item>
        <el-form-item prop="homeworknote" label="作业说明">
          <el-input v-model="newForm.homeworknote"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <input type="file" @change="changeFile($event)" />
        </el-form-item>
        <el-button type="primary" @click="createWork" style="display: block; margin: auto">立即创建</el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="批改作业" :visible.sync="checkDialog" width="500px">
      <el-form label-width="80px" :rules="rules" ref="checkForm"  :model="checkForm">
        <div class="studentInfo">
          <img class="face" :src="mediaURL + checkInfo.studentpic">
          <img class="file" alt="附件" src="@/assets/homework/file.png" v-if="checkInfo.answerfile" @click="download(checkInfo.answerfile)">
          <div class="info">
            <div>
              {{checkInfo.studentname}}
              {{checkInfo.studentNO}}
            </div>
            <div class="datetime">
              {{checkInfo.datetime}}
            </div>
          </div>
        </div>
        <el-form-item label="学生回答">
          <div>{{checkInfo.answer}}</div>
        </el-form-item>
        <el-form-item prop="teacherscore" label="分数">
          <el-input-number v-model.number="checkForm.teacherscore" size="mini" :min="0" label="描述文字"></el-input-number>
          <span style="padding-left: 20px;">优秀作业展示</span>
          <el-switch v-model="checkForm.boolpub">
          </el-switch>
        </el-form-item>
        <el-form-item prop="teachernote" label="评价">
          <el-input type="textarea" v-model="checkForm.teachernote"></el-input>
        </el-form-item>
        <el-button type="primary" @click="saveCheck" style="display: block; margin: auto">保存</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
import check from '@/views/teacherFunction/homework/check'
import downloadfile from '@/utils/utils.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      mode: 1,
      newDialog: false, // 弹框显示
      checkDialog: false, // 弹框显示
      summaryDialog: false, // 弹框显示
      checkInfo: {// 试卷详情
        id: '',
        answer: '',
        datetime: '',
        teacherscore: '',
        teachernote: '',
        boolpub: '',
        boolscore: '',
        studentid: '',
        studentNO: '',
        studentname: '',
        studentpic: '',
        answerfile: '',
        summary: ''
      },
      workData: {
        title: ['作业名称', '说明', '发布时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['发布', '附件', '删除'] // 最后的按钮 没有可以空
      },
      releaseData: {
        title: ['作业名称', '说明', '发布时间', '总结', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看', '附件', '总结'] // 最后的按钮 没有可以空
      },
      detailId: '',
      detailData: {
        title: ['名字', '学号', '完成情况', '操作'],
        list: [],
        data: [],
        btn: ['批改']
      },
      stateOption: [
        {
          text: '正常',
          code: 0
        },
        {
          text: '病假',
          code: 1
        },
        {
          text: '缺勤',
          code: 2
        },
        {
          text: '迟到',
          code: 3
        }
      ],
      newForm: {// 创建新作业表单
        teacherid: '',
        homeworkname: '',
        homeworknote: '',
        homeworkmultimedia: ''
      },
      summaryForm: {
        summary: '',
        id: ''
      },
      checkForm: {
        id: '',
        teacherid: '',
        teachernote: '',
        teacherscore: 0,
        boolpub: false
      },
      rules: {// 表单规则
        homeworkname: [
          { required: true, message: '请输入作业名称', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入总结', trigger: 'blur' }
        ],
        homeworknote: [
          { required: true, message: '请输入作业说明', trigger: 'blur' }
        ],
        teacherscore: [
          { required: true, message: '分数不能为空' },
          { type: 'number', message: '分数必须为数字值' }
        ]
      }
    }
  },
  components: {
    'c-table': table,
    'c-check': check
  },
  computed: {
    mediaURL () {
      return this.$store.state.mediaURL
    },
    tableData () {
      switch (this.mode) {
        case 1:
          return this.releaseData
        case 2:
          return this.workData
        case 3:
          return this.detailData
      }
    }
  },
  mounted () {
    this.getList()
    this.getReleaseList()
  },
  methods: {
    // 获取作业库列表
    getList () {
      let data = {
        url: 'homework/t/',
        teacherid: this.$store.state.userInfo.id
      }
      this.$store.dispatch('get', data).then((res) => {
        this.workData.data = res.data
        this.workData.list = []
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 'id' && key !== 'multimediafile') {
              arr.push(item[key])
            }
          }
          this.workData.list.push(arr)
        }
        this.workData.data.reverse()
        this.workData.list.reverse()
      })
    },
    // 获取已发布的作业列表
    getReleaseList () {
      let data = {
        url: 'homework/r/',
        teacherid: this.$store.state.userInfo.id,
        scheduleid: this.$store.state.courseInfo.dbid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.releaseData.data = res.data
        this.releaseData.list = []
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 'releaseid' && key !== 'id' && key !== 'multimediafile') {
              arr.push(item[key])
            }
          }
          this.releaseData.list.push(arr)
        }
        this.releaseData.data.reverse()
        this.releaseData.list.reverse()
      })
    },
    // 删除作业
    deleteWork (id) {
      let data = {
        url: 'homework/tdelhomework/',
        user_id: this.$store.state.userInfo.id,
        boolshow: 0,
        id: id,
        trans: true
      }
      this.$confirm('此操作将永久删除该作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('post', data).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除作业
    createWork (id) {
      let data = {
        url: 'homework/tpubhomework/',
        param: new FormData()
      }
      this.$refs['newForm'].validate((valid) => {
        if (valid) {
          data.param.append('teacherid', this.$store.state.userInfo.id)
          data.param.append('homeworkname', this.newForm.homeworkname)
          data.param.append('homeworknote', this.newForm.homeworknote)
          data.param.append('homeworkmultimedia', this.newForm.homeworkmultimedia)
          this.$store.dispatch('uploadFile', data).then((res) => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.newDialog = false
            this.getList()
          })
        } else {
          this.$message({
            message: '请正确输入'
          })
        }
      })
    },
    // 发布作业
    releaseWork (id) {
      let data = {
        url: 'homework/tpubreleasehomework/',
        teacherid: this.$store.state.userInfo.id,
        scheduleid: this.$store.state.courseInfo.dbid,
        homeworkid: id,
        trans: true
      }
      this.$confirm('此操作将发布该作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('post', data).then((res) => {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.getReleaseList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消发布'
        })
      })
    },
    // 总结作业
    saveSummary () {
      this.$refs['summaryForm'].validate((valid) => {
        if (valid) {
          let data = {
            url: 'homework/thomeworksummary/',
            trans: true,
            id: this.summaryForm.id,
            summary: this.summaryForm.summary
          }
          this.$store.dispatch('post', data).then((res) => {
            this.getReleaseList()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.summaryDialog = false
          })
        } else {
          this.$message({
            message: '请正确输入'
          })
        }
      })
    },
    // 获取作业情况
    getDetail (id) {
      this.detailId = id
      let data = {
        url: 'homework/a/',
        scheduleid: this.$store.state.courseInfo.dbid,
        releasehomeworkid: id
      }
      this.mode = 3
      this.$store.dispatch('get', data).then((res) => {
        this.detailData.data = res.data
        this.detailData.list = []
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'studentname' || key === 'studentNO') {
              arr.push(item[key])
            } else if (key === 'id') {
              if (item.id === '') {
                arr.push('未提交')
              } else {
                arr.push((item.teacherscore !== 'null' && item.teacherscore) || '等待批改')
              }
            }
          }
          this.detailData.list.push([arr[2], arr[1], arr[0]])
        }
        this.detailData.data.reverse()
        this.detailData.list.reverse()
      })
    },
    // changeFile
    changeFile (e) {
      this.newForm.homeworkmultimedia = e.target.files[0]
    },
    // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      if (type === '查看') {
        this.getDetail(data.releaseid)
      } else if (type === '批改') {
        console.log(data)
        if (data.id) {
          this.checkDialog = true
          this.checkInfo = data
          this.checkForm.id = data.id
          this.checkForm.teachernote = (data.teachernote !== 'null' && data.teachernote) || ''
          this.checkForm.teacherscore = (data.teacherscore !== 'null' && data.teacherscore) || 0
          this.checkForm.boolpub = data.boolpub
        } else {
          this.$message({
            message: '学生没有提交'
          })
        }
      } else if (type === '附件') {
        if (data.multimediafile) {
          this.download(data.multimediafile)
        } else {
          this.$message({
            message: '没有附件'
          })
        }
      } else if (type === '删除') {
        this.deleteWork(data.id)
      } else if (type === '发布') {
        this.releaseWork(data.id)
      } else if (type === '总结') {
        this.summaryForm.summary = data.summary
        this.summaryForm.id = data.releaseid
        this.summaryDialog = true
      }
    },
    // saveCheck
    saveCheck () {
      this.$refs['checkForm'].validate((valid) => {
        let data = {
          url: 'homework/tpubhomeworknote/',
          trans: true,
          id: this.checkForm.id,
          teacherid: this.$store.state.userInfo.id,
          teachernote: this.checkForm.teachernote,
          teacherscore: this.checkForm.teacherscore,
          boolpub: this.checkForm.boolpub ? 'True' : 'False'
        }
        if (valid) {
          this.$store.dispatch('post', data).then((res) => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.checkDialog = false
            this.getDetail(this.detailId)
          })
        } else {
          this.$message({
            message: '请正确输入'
          })
        }
      })
    },
    download (path) {
      this.$message({
        message: '下载中',
        type: 'success'
      })
      downloadfile(this.mediaURL + path, path.split('/').reverse()[0])
    },
    back () {
      this.mode = 1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.record{
  overflow: hidden;
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
.back{
  width: 30px;
  height: 30px;
  display: block;
  cursor: pointer;
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
