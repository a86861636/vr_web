<template>
  <div class="record">
    <div class="line">
      <img class="back" src="@/assets/classFunciton/back.png" @click="back" v-if="iconShow" />
      <el-select v-model="mode" v-if="mode!==3" placeholder="请选择" size="small" style="width: 120px;">
        <el-option
          label="已发布"
          :value="1"
        >
        </el-option>
        <el-option
          label="试卷库"
          :value="2"
        >
        </el-option>
      </el-select>
      <el-button type="danger" size="small" v-if="mode===2"  @click="openNewDialog">新建试卷</el-button>
    </div>
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='tableData'></c-table>

    <el-dialog title="新增试卷" :visible.sync="newDialog" width="500px">
      <c-new v-if="newDialog" @close='closeNew' @fresh="getList"></c-new>
    </el-dialog>
    <el-dialog title="编辑试卷" :visible.sync="editDialog" width="500px">
      <c-edit v-if="editDialog" :editData="editData" @close='closeEdit' @fresh="getList"></c-edit>
    </el-dialog>
    <el-dialog title="批改试卷" :visible.sync="checkDialog" width="500px">
      <c-check @close='closeCheck' :paperId="detail_id" :stuId="checkInfo.student_pid"></c-check>
    </el-dialog>
    <el-dialog title="发布试卷" :visible.sync="releaseDialog" width="500px">
      <el-form :model="releaseForm" ref="releaseForm" label-width="100px" class="releaseForm">
        <el-form-item
          label="限制时间"
          prop="limit_time"
          :rules="[
            { required: true, message: '不能为空'},
            { type: 'number', message: '必须为数字值'}
          ]"
        >
        <el-input type="text" v-model.number="releaseForm.limit_time" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="releasePaper" style="display: block; margin: auto">立即创建</el-button>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
import check from '@/views/classFunction/exam/components/check'
import cnew from '@/views/classFunction/exam/components/new'
import edit from '@/views/classFunction/exam/components/edit'
export default {
  name: 'HelloWorld',
  data () {
    return {
      mode: 1,
      newDialog: false,
      editDialog: false,
      checkDialog: false,
      releaseDialog: false,
      releaseForm: {
        teacherid: '',
        scheduleid: '',
        exampaperid: '',
        limit_time: 0
      },
      detail_id: '',
      checkInfo: {},
      paperQus: [],
      editData: {},
      paperData: {
        title: ['试卷名称', '说明', '创建时间', '学期占比', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['编辑', '发布', '删除'] // 最后的按钮 没有可以空
      },
      releaseData: {
        title: ['试卷名称', '说明', '学期占比%', '发布时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看', '撤销'] // 最后的按钮 没有可以空
      },
      detailData: {
        title: ['学号', '学生名字', '完成情况', '操作'],
        list: [],
        data: [],
        btn: ['批改']
      }
    }
  },
  computed: {
    iconShow () {
      return this.mode === 3
    },
    tableData () {
      switch (this.mode) {
        case 1:
          return this.releaseData
        case 2:
          return this.paperData
        case 3:
          return this.detailData
      }
    }
  },
  components: {
    'c-table': table,
    'c-check': check,
    'c-new': cnew,
    'c-edit': edit
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取试卷列表
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'exam/getpaperlist/',
        schedule_id: this.$store.state.courseInfo.dbid,
        user_id: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.releaseData.list = []
        this.releaseData.data = []
        this.paperData.list = []
        this.paperData.data = []
        for (let item of res.data.all_release_paper) {
          this.releaseData.data.push(item)
          let arr = []
          for (let key in item) {
            if (key === 'paper_name' || key === 'paper_note' || key === 'paper_percent' || key === 'release_time') {
              arr.push(item[key])
            }
          }
          this.releaseData.list.push(arr)
        }
        for (let item of res.data.all_paper) {
          this.paperData.data.push(item)
          let arr = []
          for (let key in item) {
            if (key === 'paper_name' || key === 'paper_note' || key === 'paper_percent' || key === 'create_time') {
              arr.push(item[key])
            }
          }
          this.paperData.list.push(arr)
        }
        this.releaseData.list.reverse()
        this.releaseData.data.reverse()
        this.paperData.list.reverse()
        this.paperData.data.reverse()
        // this.paperData.list = res.data
      })
    },
    // 获取点名详情
    getDetail (paperId, stuId) {
      let data = {
        url: 'exam/getanswerdetail/',
        student_pid: stuId || '',
        user_type: 't',
        released_paper_id: paperId
      }
      this.mode = 3
      this.$store.dispatch('get', data).then((res) => {
        this.detailData.list = []
        this.detailData.data = res.student_list
        for (let item of res.student_list) {
          let arr = []
          for (let key in item) {
            if (key !== 'student_pid') {
              arr.push(item[key])
            }
          }
          let sortArr = [arr[1], arr[0], this.trans(arr[2])]
          this.detailData.list.push(sortArr)
        }
      })
    },
    // 数字转中文 @param {Array} value value[0]为按钮文本 value[1]当行数据obj
    trans (param) {
      if (param) {
        return '已提交'
      } else {
        return '未提交'
      }
    },
    // 发布试卷
    releasePaper () {
      this.$refs['releaseForm'].validate((valid) => {
        if (valid) {
          let data = {
            url: 'exam/tpubexampaper/',
            teacherid: this.$store.state.userInfo.tloginid,
            scheduleid: this.$store.state.courseInfo.dbid,
            exampaperid: this.releaseForm.exampaperid,
            limit_time: this.releaseForm.limit_time,
            trans: true
          }
          this.$store.dispatch('post', data).then((res) => {
            this.getList()
            this.releaseDialog = false
            this.$message({
              message: '发布成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    // 删除试卷
    deletePaper (id) {
      let data = {
        url: 'exam/deletepaper/',
        teacher_id: this.$store.state.userInfo.tloginid,
        paper_id: id,
        trans: true
      }
      this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
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
    // 撤销已发布的试卷
    cancelPaper (id) {
      let data = {
        url: 'exam/unreleasedpaper/',
        user_id: this.$store.state.userInfo.tloginid,
        released_paper_id: id,
        trans: true
      }
      this.$confirm('此操作将撤销该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('post', data).then((res) => {
          this.$message({
            message: '撤销成功',
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
    // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      if (type === '查看') {
        this.detail_id = data.release_paper_id
        this.getDetail(data.release_paper_id)
      } else if (type === '批改') {
        if (data.is_handle) {
          this.checkDialog = true
          this.checkInfo = data
        } else {
          this.$message({
            message: '学生没有提交'
          })
        }
      } else if (type === '发布') {
        this.releaseForm.exampaperid = data.paper_id
        this.releaseDialog = true
      } else if (type === '删除') {
        this.deletePaper(data.paper_id)
      } else if (type === '撤销') {
        console.log(data)
        this.cancelPaper(data.release_paper_id)
      } else if (type === '编辑') {
        this.editData = data
        this.editDialog = true
      }
    },
    // 返回
    back () {
      this.mode = 1
    },
    // 关闭批改对话框
    closeCheck () {
      this.checkDialog = false
    },
    // 关闭批改对话框
    closeNew () {
      this.newDialog = false
    },
    // 关闭批改对话框
    closeEdit () {
      this.editDialog = false
    },
    // 打开新建对话框
    openNewDialog () {
      this.newDialog = true
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
.add{
  cursor: pointer;
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
