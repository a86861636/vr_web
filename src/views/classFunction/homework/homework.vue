<template>
  <div class="record">
    <div @click="back">返回</div>
    <div class="line"></div>
    <c-table v-if="mode==='record'" class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='paperData'></c-table>
    <c-table v-if="mode==='detail'" class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='detailData'></c-table>

    <el-dialog title="打卡状态" :visible.sync="dialogFormVisible" width="500px">
      <el-select v-model="form.state" placeholder="请选择" style="width: 100%">
        <el-option v-for="(item,index) in stateOption" :key="index" :label="item.text" :value="item.text"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeState">确 定</el-button>
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
      mode: 'record',
      detail_id: '',
      dialogFormVisible: false,
      paperData: {
        title: ['试卷名称', '说明', '发布时间', '操作'], // 标题
        list: [], // 对应的内容
        date: [], // 对应的数据
        btn: ['查看'] // 最后的按钮 没有可以空
      },
      detailData: {
        title: ['学号', '学生名字', '完成情况', '操作'],
        list: [],
        date: [],
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
      form: {
        state: '',
        s_sign_in_id: ''
      }
    }
  },
  components: {
    'c-table': table
  },
  mounted () {
    this.getList()
  },
  methods: {
    /**
       * 获取点名记录
       */
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'exam/a/',
        scheduleid: this.$store.state.courseInfo.dbid,
        teacherid: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.paperData.date = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 'exampaper_id' && key !== 'releaseexampaper_id') {
              arr.push(item[key])
            }
          }
          this.paperData.list.push(arr)
        }
        // this.paperData.list = res.data
      })
    },
    /**
       * 获取点名详情
       */
    getDetail (paperId, stuId) {
      let data = {
        url: 'exam/getanswerdetail/',
        student_pid: stuId || '',
        user_type: 't',
        released_paper_id: 17 || paperId
      }
      this.mode = 'detail'
      this.$store.dispatch('get', data).then((res) => {
        this.detailData.list = []
        this.detailData.date = res.student_list
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
    /**
       * 修改学生考勤状态
       */
    changeState () {
      let data = {
        url: 'signin/tsigninpost/' + this.form.s_sign_in_id + '/' + this.trans(this.form.state) + '/0/'
      }
      this.$store.dispatch('get', data).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getDetail(this.detail_id)
        this.dialogFormVisible = false
      })
    },
    /**
       * 数字转中文
       * @param {Array} value value[0]为按钮文本 value[1]当行数据obj
       */
    trans (param) {
      if (param) {
        return '已提交'
      } else {
        return '未提交'
      }
    },
    /**
       * 数字转中文
       * @param {Array} value value[0]为按钮文本 value[1]当行数据obj
       */
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      if (type === '查看') {
        this.detail_id = data.exampaper_id
        this.getDetail(data.exampaper_id)
      } else if (type === '批改') {
        console.log(data)
        this.$router.push({path: '/classFunction/exam/check', query: { stuId: data.student_pid, paperId: this.detail_id }})
      }
    },
    back () {
      this.mode = 'record'
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
  height: 2px;
  margin: 60px auto 0px auto;
  background: #DFDFE2;
}
.table{
  margin: 20px auto;
}
</style>
