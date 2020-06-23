<template>
  <div class="main">
    <div class="line">
      <el-button type="danger" class="add" size="small" @click="adddata">新建问答</el-button>
    </div>
    <c-table class="table" :width="500" :tableData='recordData' @tableBtn='handleBtn(arguments)'></c-table>

    <el-dialog
      title="发布问答"
      :visible.sync="dialogadddataVisible"
      width="500px">
        <el-form label-width="80px">
          <el-form-item prop="homeworknote" label="作业说明">
            <el-input v-model="teachernote"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <input type="file" @change="changeFile($event)" />
          </el-form-item>
          <el-button type="primary" @click="postqaa" style="display: block; margin: auto">立即创建</el-button>
        </el-form>
        <!-- <div class="questionslist">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入题目信息"
            class="questions"
            v-model="teachernote">
          </el-input>
          <div class="addfile">
            <div class="uploadimg" @click="openImg">
              <span v-if="imgUrl==''" style="font-size: 13px;">上传附件</span>
              <img style="height:100%;width:100%;" v-if="imgUrl!=''" :src="imgUrl"/>
            </div>
          </div>
        </div>
      </div>
      <div class="postquestion">
        <input v-show="false" type="file" accept="image/*" @change="tirggerFile($event)" ref="input"/>
        <el-button type="danger" @click="postqaa">发起投票</el-button> -->
    </el-dialog>

    <el-dialog
      :visible.sync="questdetail"
      width="700px">
      <div class="vote">
        <div class="voteheader">回答详情</div>
        <div class="answerheader">
          <span>{{quest.teaname}}</span>
          <span>{{quest.QASdatetime}}</span>
          <span v-if="quest.QAmultimedia!==''">有附件</span>
          <span v-else>无附件</span>
        </div>
        <div class="answercontent">
          问题：{{quest.QAname}}
        </div>
        <div v-if="quest.QAmultimedia!==''" class="questionimg">
          <div v-if="showendstr(quest.QAmultimedia)">
<!--            <img :src="'http://192.168.1.34:8000/media/'+quest.QAmultimedia">-->
            <el-image :src="'http://192.168.1.34:8000/media/'+quest.QAmultimedia"  style="width: 150px;" :preview-src-list="['http://192.168.1.34:8000/media/'+quest.QAmultimedia]" >
            </el-image>
          </div>
        </div>
        <el-divider>学生回答</el-divider>
        <div v-if="quesdetaildata.length!==0" class="answerscroll">
          <div v-for="(item,keys) in quesdetaildata" :key="keys" class="answerdetail">
            <img :src="'http://192.168.1.34:8000/media/'+item.stupic">
            <div class="answerrow">
              <div class="answercolume">
                <span style="color: #909399;">{{item.stuname}}</span>
                <span style="margin-left: auto;color: #909399;">回答时间：{{item.QASdatetime}}</span>
              </div>
              <span style="padding-top: 10px;color: #909399;">学号：{{item.stuNO}}</span>
              <div class="stuanswer">
                回答：{{item.QAname}}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="nonepng">
          <img src="@/assets/classFunciton/none.png">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'

export default {
  name: 'question',
  data () {
    return {
      recordData: {
        title: ['问题', '创建时间', '是否有附件', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['查看'] // 最后的按钮 没有可以空
      },
      nums: 0,
      dialogadddataVisible: false,
      teachernote: '',
      isSelectFile: false,
      questdetail: false,
      imgUrl: '',
      fileList: '',
      quesdetaildata: [],
      quest: [],
      srcList: []
    }
  },
  methods: {
    // 获取列表信息
    getList () {
      let data = {
        url: 'questioning/t/',
        scheduleid: this.$store.state.courseInfo.dbid
      }
      this.$store.dispatch('get', data).then(res => {
        this.recordData.data = res.data
        for (let item of res.data) {
          let arr = []
          arr[0] = item.QAname
          arr[1] = item.QASdatetime
          if (item.QAmultimedia !== '') {
            arr[2] = '有'
          } else {
            arr[2] = '无'
          }
          this.recordData.list.push(arr)
        }
      })
    },
    // 添加投票
    adddata () {
      this.dialogadddataVisible = true
    },
    tirggerFile (event) {
      let file = event.target.files[0]
      let url = ''
      var reader = new FileReader()
      reader.readAsDataURL(file)
      let that = this
      reader.onload = function (e) {
        url = this.result.substring(this.result.indexOf(',') + 1)
        that.imgUrl = 'data:image/png;base64,' + url
        // that.$refs['imgimg'].setAttribute('src','data:image/png;base64,'+url);
      }
      this.fileByBase64(file, (base64) => {
        this.base64ByBlob(base64, blob => {
          var url = window.URL.createObjectURL(blob)
          this.fileList = url
        })
      })
    },
    fileByBase64 (file, callback) {
      var reader = new FileReader()
      // 传入一个参数对象即可得到基于该参数对象的文本内容
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        // target.result 该属性表示目标对象的DataURL
        callback(e.target.result)
      }
    },
    base64ByBlob (base64, callback) {
      // eslint-disable-next-line one-var
      var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      callback(new Blob([u8arr], {type: mime}))
    },
    openImg () {
      this.$refs.input.click()
    },
    changeFile (e) {
      this.fileList = e.target.files[0]
    },
    postqaa () {
      let data = {
        url: 'questioning/tpubqanote/',
        param: new FormData()
      }
      data.param.append('teacherid', this.$store.state.userInfo.tloginid)
      data.param.append('scheduleid', this.$store.state.courseInfo.dbid)
      data.param.append('teachernote', this.teachernote)
      data.param.append('filePath', this.fileList)
      this.$store.dispatch('uploadFile', data).then(res => {
        this.$message({
          message: '问答信息提交成功',
          type: 'success'
        })
        this.dialogadddataVisible = false
        this.teachernote = ''
        this.recordData = {
          title: ['发布人', '创建时间', '学生回答情况', '操作'], // 标题
          list: [], // 对应的内容
          data: [], // 对应的数据
          btn: ['查看'] // 最后的按钮 没有可以空
        }
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    },
    handleBtn (value) {
      let type = value[0]
      let data = value[1]
      let quid = JSON.parse(data).id
      this.quest = JSON.parse(data)
      if (type === '查看') {
        let data = {
          url: 'questioning/s/',
          questionid: quid
        }
        this.$store.dispatch('get', data).then(res => {
          this.quesdetaildata = res.data
          this.questdetail = true
        })
        //   this.tablescheduleid = date.releaseid
        //   this.dialogVisible = true
        //   this.$nextTick(function () {
        //     this.initChart()
        //   })
      }
    },
    // 判断是否为图片文件
    showendstr (str) {
      return (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(str))
    }
  },
  computed: {
    mediaUrl () {
      return this.$store.state.mediaUrl
    }
  },
  mounted () {
    this.getList()
  },
  components: {
    'c-table': table
  }
}
</script>

<style scoped>
.table{
  margin: 20px auto;
}

.voteheader {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.questions {
  border-radius: 30px;
  padding-top: 20px;
  width: 85%;
}

.addfile {
  line-height: 70px;
  font-size: 30px;
  width: 8%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.postquestion {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.questionslist {
  display: flex;
  flex-direction: row;
}

.uploadimg {
  width: 73px;
  height: 73px;
  border: 1px solid;
  text-align: center;
  margin-left: 10px;
}

.answerheader {
  padding-left: 7px;
}

.answerheader span {
  padding-left: 10px;
}

.answercontent {
  padding-left: 17px;
  padding-top: 20px;
  font-weight: bold;
}

.answerdetail {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.answerdetail span {
  padding-left: 15px;
}

.answerdetail img {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}

.answerrow {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.answercolume {
  display: flex;
  flex-direction: row;
}

.stuanswer {
  margin-left: 15px;
  margin-top: 20px;
  font-weight: bold;
}

.answerscroll {
  height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.answerscroll::-webkit-scrollbar {
  display: none;
}

.questionimg {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.questionimg img {
  width: 150px;
}

.nonepng{
  text-align: center;
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
</style>
