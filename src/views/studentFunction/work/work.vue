<template>
  <div class="work">
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='listData'></c-table>
    <el-dialog class="workDialog" title="作业提交" :visible.sync="is_dialogShow">
      <div class="title">
        <div class="tt">作业题目：</div>
        <div>{{currentWork.name}}</div>
        <img v-if="currentWork.multimediafile" src="@/assets/classFunciton/downloadR.png" @click="download(currentWork.multimediafile)" class="file-download" alt="">
      </div>
      <div class="note">
        <div class="tt">作业备注：</div>
        <div>{{currentWork.note}}</div>
      </div>
      <div class="input-box">
        <div class="file-box" v-if="!currentWork.done">
          <input :disabled="currentWork.done" @change="selectFile" class="file-input" type="file">
          <img class="file-img" src="@/assets/classFunciton/file.png" alt="">
          <div class="file-text">{{workForm.fileName || '上传附件'}}</div>
        </div>
        <div class="file-box" v-if="workForm.file && currentWork.done" @click="download(workForm.file)">
          <img class="file-img" src="@/assets/classFunciton/file.png" alt="">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_dialogShow = false">取消</el-button>
        <el-button type="primary" @click="uploadWork">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
import downloadfile from '@/utils/utils.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      listData: {
        title: ['试卷名称', '说明', '创建时间', '情况', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['提交'] // 最后的按钮 没有可以空
      },
      workForm: {
        text: '',
        file: '',
        fileName: '',
        done: false
      },
      is_dialogShow: false,
      currentWork: {}
    }
  },
  components: {
    'c-table': table
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(){
      let userId = this.$store.state.userInfo.id
      let data = {
        url: 'homework/s/',
        scheduleid: this.$store.state.courseInfo.dbid,
        studentid: userId
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.listData.list = []
        this.listData.data = res.data
        for (let item of res.data) {
          let arr = []
          for (let key in item) {
            if (key === 'datetime' || key === 'name' || key === 'note' || key === 'studentanswer') {
              if(key === 'studentanswer'){
                arr.push(!item['studentanswer'] && !item['studentanswerfile'] ? '未提交' : '已完成')
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
    selectFile (e) {
      this.workForm.fileName = e.target.files[0].name
      this.workForm.file = e.target.files[0]
    },
    showWorkDetial (item) {
      this.is_dialogShow = true
      item.done = !(!item.studentanswerfile && !item.studentanswer)
      this.workForm.text = item.studentanswer
      this.workForm.file = item.studentanswerfile
      this.workForm.fileName = item.studentanswerfile.split('/').reverse()[0]
      this.currentWork = item
    },
    // 下载素材
    download (path) {
      downloadfile(this.$store.state.mediaURL + path, path.split('/').reverse()[0])
    },
    uploadWork () {
      let data = {
        url: 'homework/spubhomeworkanswer/',
        param: new FormData()
      }
      data.param.append('studentid', this.$store.state.userInfo.id)
      data.param.append('scheduleid', this.$store.state.courseInfo.dbid)
      data.param.append('homeworkid', this.currentWork.releaseid)
      data.param.append('homeworkstudentanswer', this.workForm.text)
      data.param.append('myfile', this.workForm.file)
      this.$store.dispatch('uploadFile', data).then(res => {
        if (res.code === 200) {
          this.is_dialogShow = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.is_dialogShow = false
          this.getList()
        }
      })
    },
     // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      console.log(data)
      if (type === '提交') {
        this.showWorkDetial(data)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.work{
  .table{
    margin: 30px auto;
  }
  .dialog{

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
        width: 60px;
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
</style>