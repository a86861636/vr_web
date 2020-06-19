<template>
  <div class="record">
    <div class="line">
      <img class="back" src="@/assets/classFunciton/back.png" @click="back" v-if="mode != 'home'" />
    </div>
    <c-table v-if="mode==='home'" class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='recordData'></c-table>
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
      mode: 'home',
      detail_id: '',
      dialogFormVisible: false,
      recordData: {
        title: ['签到开始', '正常', '病假', '缺勤', '迟到', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看'] // 最后的按钮 没有可以空
      },
      detailData: {
        title: ['学号', '学生名字', '打卡时间', '打卡状态', '操作'],
        list: [],
        data: [],
        btn: ['修改']
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
        url: 'signin/tsigninrecords/',
        schedule_id: this.$store.state.courseInfo.dbid,
        teacher_id: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.recordData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 't_signin_id') {
              arr.push(item[key])
            }
          }
          this.recordData.list.push(arr)
        }
        // this.recordData.list = res.data
      })
    },
    /**
       * 获取点名详情
       */
    getDetail (id) {
      let data = {
        url: 'signin/getstudentstate/',
        t_sign_in_id: id
      }
      this.mode = 'detail'
      this.$store.dispatch('get', data).then((res) => {
        this.detailData.list = []
        this.detailData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key !== 's_signin_id') {
              arr.push(item[key])
            }
          }
          let sortArr = [arr[4], arr[3], arr[5], this.trans(arr[2])]
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
      for (let item of this.stateOption) {
        if (item.code === param) {
          return item.text
        } else if (item.text === param) {
          return item.code
        }
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
        this.detail_id = data.t_signin_id
        this.getDetail(data.t_signin_id)
      } else if (type === '修改') {
        this.form.s_sign_in_id = data.s_sign_in_id
        this.form.state = this.trans(data.state)
        this.dialogFormVisible = true
      }
    },
    back () {
      this.mode = 'home'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.record{
  overflow: hidden;
}
.nodata{
  text-align: center;
}
.line{
  width: 500px;
  height: 60px;
  margin: 0px auto 0px auto;
  border-bottom: #DFDFE2 2px solid;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
