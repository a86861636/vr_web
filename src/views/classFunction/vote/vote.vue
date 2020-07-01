<template>
  <div class="main">
    <div class="line">
      <el-select v-model="mode" placeholder="请选择" size="small" style="width: 120px;">
        <el-option
          label="已发布"
          :value="1"
        >
        </el-option>
        <el-option
          label="投票库"
          :value="2"
        >
        </el-option>
      </el-select>
      <el-button type="danger" v-if="mode===2" class="add" size="small" @click="adddata">新建问答</el-button>
    </div>
    <!--    <el-button type="danger" round class="addbutton" @click="adddata">添加</el-button>-->
    <c-table @tableBtn='handleBtn(arguments)' class="table" @postdata="adddata" :width="500" :tableData='tableData'></c-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="950px">
      <div id="votetable" style="width: 600px;height: 400px;"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogadddataVisible"
      @close="handleaddClose"
      width="550px">
      <div class="vote">
        <div class="voteheader">创建投票应用</div>
        <div class="questionslist">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入题目信息"
            class="questions"
            v-model="votedata.name">
          </el-input>
          <div class="imgBox">
            <img class="img" :src=" imgFile || require('@/assets/classFunciton/img.png')" />
            <input type="file" @change="selectedFile($event)" class="upload">
          </div>
        </div>
        <div class="questionslist" v-for="(item,keys) in this.votedata.answer" :key="keys">
          <el-input
            type="text"
            :rows="1"
            placeholder="请输入选项内容"
            class="questions"
            v-model="item.answer">
            <template slot="prepend">{{showlabel(keys)}}</template>
          </el-input>
          <el-button type="danger" @click="deletedata(keys)" icon="el-icon-delete" circle v-if="keys>1"
                    class="deletebutton"></el-button>
        </div>
        <div class="footer">
          <el-button class="addquestion" type="primary" @click="addmessage">添加投票选项</el-button>
          <el-button class="postquestion" type="danger" @click="postmessage">发起投票</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogvoteVisible"
      @close="handlevoteClose"
      width="550px">
      <div class="vote">
        <div class="voteheader">投票问卷</div>
        <div class="questionslist">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入题目信息"
            class="questions"
            v-model="votedetail.votename">
          </el-input>
          <div class="imgBox">
            <img class="img" :src=" voteFile || require('@/assets/classFunciton/img.png')" />
            <input type="file" @change="selectedvoteFile($event)" class="upload">
          </div>
        </div>
        <div class="questionslist" v-for="(item,keys) in this.votedetail.answer" :key="keys">
          <el-input
            type="text"
            :rows="1"
            placeholder="请输入选项内容"
            class="questions"
            v-model="item.answer">
            <template slot="prepend">{{showlabel(keys)}}</template>
          </el-input>
          <el-button type="danger" @click="deletedata(keys)" icon="el-icon-delete" circle v-if="keys>1"
                     class="deletebutton"></el-button>
        </div>
        <div class="footer">
          <el-button class="addquestion" type="primary" @click="addvote">添加投票选项</el-button>
          <el-button class="postquestion" type="danger" @click="savevote">修改完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import table from '@/components/normalTable'
import echarts from 'echarts'

export default {
  name: 'vote',
  data () {
    return {
      mode: 1,
      libData: {
        title: ['投票名称', '创建时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['发布', '删除', '编辑'] // 最后的按钮 没有可以空
      },
      releaseData: {
        title: ['投票名称', '创建时间', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['详情', '删除'] // 最后的按钮 没有可以空
      },
      dialogVisible: false,
      dialogadddataVisible: false,
      dialogvoteVisible: false,
      chartsdata: '',
      votedata: {
        name: '',
        answer: [
          {answer: ''},
          {answer: ''}
        ]
      },
      imgFile: '',
      voteFile: '',
      votedetail: {
        id: '',
        votename: '',
        answer: []
      },
      isfalse: false,
      addfilepath: '',
      votefilepath: ''
    }
  },
  computed: {
    tableData () {
      if (this.mode === 1) {
        return this.releaseData
      } else {
        return this.libData
      }
    }
  },
  methods: {
    // 获取未发布投票列表
    getList () {
      let data = {
        url: 'vote/t/',
        teacherid: this.$store.state.userInfo.tloginid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.libData.data = res.data
        for (let item of res.data) {
          // console.log(item)
          let arr = []
          arr[0] = item.name
          arr[1] = item.create_time
          this.libData.list.push(arr)
        }
      })
    },
    getReleaseList () {
      let data = {
        url: 'vote/r/',
        teacherid: this.$store.state.userInfo.tloginid,
        scheduleid: this.$store.state.courseInfo.dbid
      }
      this.$store.dispatch('get', data).then((res) => {
        this.releaseData.data = res.data
        for (let item of res.data) {
          let arr = []
          arr[0] = item.name
          arr[1] = item.create_time
          this.releaseData.list.push(arr)
        }
      })
    },
    // 显示图表
    handleBtn (value) {
      if (this.mode === 1) {
        let type = value[0]
        let data = JSON.parse(value[1])
        if (type === '详情') {
          this.tablescheduleid = data.releaseid
          this.dialogVisible = true
          this.$nextTick(function () {
            this.initChart()
          })
        } else {
          this.$confirm('此操作将撤销该投票, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            let requrl = {
              url: 'vote/tdelreleasevote/',
              id: data.releaseid,
              boolshow: 0,
              trans: true
            }
            this.$store.dispatch('post', requrl).then((res) => {
              console.log(res)
              this.releaseData.list = []
              this.getReleaseList()
            })
            this.$message({
              message: '成功撤销',
              type: 'success'
            })
          })
        }
      } else {
        let type = value[0]
        let data = JSON.parse(value[1])
        if (type === '发布') {
          let reqdata = {
            url: 'vote/pubonevote/',
            teacherid: this.$store.state.userInfo.tloginid,
            scheduleid: this.$store.state.courseInfo.dbid,
            voteid: data.id,
            trans: true
          }
          this.$store.dispatch('post', reqdata).then((res) => {
            console.log(res)
            this.releaseData.list = []
            this.getReleaseList()
            this.$message({
              message: '发布成功',
              type: 'success'
            })
          })
        }
        if (type === '删除') {
          let reqdata = {
            url: 'vote/tdelvote/',
            id: data.id,
            boolshow: 0,
            trans: true
          }
          console.log(reqdata)
          this.$store.dispatch('post', reqdata).then((res) => {
            console.log(res)
            this.$confirm('此操作将撤销该投票, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.libData.list = []
              this.getList()
              this.$message({
                message: '成功删除问卷',
                type: 'success'
              })
            })
          })
        }
        if (type === '编辑') {
          console.log(data)
          this.dialogvoteVisible = true
          this.votedetail.votename = data.name
          this.votedetail.id = data.id
          this.voteFile = 'http://192.168.1.34:8000/media/' + data.multimedia
          this.votedetail.answer.push({answer: data.answer1})
          this.votedetail.answer.push({answer: data.answer2})
          if (data.answer3 !== 'null') {
            this.votedetail.answer.push({answer: data.answer3})
          }
          if (data.answer4 !== 'null') {
            this.votedetail.answer.push({answer: data.answer4})
          }
          if (data.answer5 !== 'null') {
            this.votedetail.answer.push({answer: data.answer5})
          }
          if (data.answer6 !== 'null') {
            this.votedetail.answer.push({answer: data.answer6})
          }
        }
      }
    },
    savevote () {
      // 先判断所有的选项是否为空
      for (let i of this.votedetail.answer) {
        if (i.answer === '') {
          this.$message({
            showClose: true,
            message: '选项中有空',
            type: 'error'
          })
          this.isfalse = false
        } else {
          this.isfalse = true
        }
      }
      if (this.isfalse === true) {
        let data = {
          url: 'vote/tupdatevote/',
          param: new FormData()
        }
        data.param.append('id', this.votedetail.id)
        data.param.append('myfile', this.votefilepath)
        data.param.append('teacherid', this.$store.state.userInfo.tloginid)
        data.param.append('votename', this.votedetail.votename)
        data.param.append('votenote', '无')
        data.param.append('voteanswernum', this.votedetail.answer.length)
        data.param.append('filePath', this.voteFile)
        for (let i = 0; i < 6; i++) {
          if (this.votedetail.answer[i] === undefined) {
            this.votedetail.answer[i] = ''
          }
        }
        data.param.append('vote_answer1', this.votedetail.answer[0].answer)
        data.param.append('vote_answer2', this.votedetail.answer[1].answer)
        data.param.append('vote_answer3', this.votedetail.answer[2].answer)
        data.param.append('vote_answer4', this.votedetail.answer[3].answer)
        data.param.append('vote_answer5', this.votedetail.answer[4].answer)
        data.param.append('vote_answer6', this.votedetail.answer[5].answer)

        this.$store.dispatch('uploadFile', data).then(res => {
          this.libData.list = []
          this.getList()
          // 把选项的值清空
          // this.votedetail = {
          //   name: '',
          //   answer: [
          //     {answer: ''},
          //     {answer: ''}
          //   ]
          // }
          this.$message({
            message: '问卷修改成功',
            type: 'success'
          })
          this.dialogvoteVisible = false
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 关闭Dialog的时候重置选项框
    handlevoteClose () {
      this.votedetail = {
        id: '',
        votename: '',
        answer: []
      }
      this.voteFile = ''
    },
    handleaddClose () {
      this.votedetail = {
        id: '',
        votename: '',
        answer: []
      }
      this.imgFile = ''
    },
    // 初始化图表
    initChart () {
      this.chart = echarts.init(document.getElementById('votetable'))

      // 请求的值
      let tabledata = {
        url: 'vote/wedges/',
        teacherid: this.$store.state.userInfo.tloginid,
        releasevoteid: this.tablescheduleid
      }
      this.$store.dispatch('get', tabledata).then((res) => {
        let data = {
          color: ['#DFE6A4', '#73C0AE', '#58afed', '#A4D9F8', '#EEA77B', '#EB7B7D'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['还没有学生投票']
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {value: 1, name: '还没有学生投票'}
              ]
            }
          ]
        }
        if (res.data === '目前没有学生投票！') {
          this.chart.setOption(data)
        } else {
          let newlegend = []
          let newseries = []
          for (let i of res.data.Ring.series) {
            let obj = {}
            obj.value = i.data
            obj.name = i.name
            newseries.push(obj)
            newlegend.push(i.name)
          }
          data = {
            color: ['#DFE6A4', '#73C0AE', '#58afed'],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 10,
              data: newlegend
            },
            series: [
              {
                name: '投票结果',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: newseries
              }
            ]
          }
          this.chart.setOption(data)
        }
      })
    },
    // 添加投票
    adddata () {
      this.dialogadddataVisible = true
    },
    // 添加投票信息
    addmessage () {
      switch (this.votedata.answer.length) {
        case 2:
          this.votedata.answer.push({answer: ''})
          break
        case 3:
          this.votedata.answer.push({answer: ''})
          break
        case 4:
          this.votedata.answer.push({answer: ''})
          break
        case 5:
          this.votedata.answer.push({answer: ''})
          break
        case 6:
          this.$message.error('选项上限，不能添加！')
          break
      }
    },
    // 添加修改问卷的选项
    addvote () {
      switch (this.votedetail.answer.length) {
        case 2:
          this.votedetail.answer.push({answer: ''})
          break
        case 3:
          this.votedetail.answer.push({answer: ''})
          break
        case 4:
          this.votedetail.answer.push({answer: ''})
          break
        case 5:
          this.votedetail.answer.push({answer: ''})
          break
        case 6:
          this.$message.error('选项上限，不能添加！')
          break
      }
    },
    // 提交代码
    postmessage () {
      // 先判断所有的选项是否为空
      for (let i of this.votedata.answer) {
        if (i.answer === '') {
          this.$message({
            showClose: true,
            message: '选项中有空',
            type: 'error'
          })
          this.isfalse = false
        } else {
          this.isfalse = true
        }
      }
      if (this.isfalse === true) {
        let data = {
          url: 'vote/tpubvote/',
          param: new FormData()
        }
        data.param.append('myfile', this.addfilepath)
        data.param.append('teacherid', this.$store.state.userInfo.tloginid)
        data.param.append('votename', this.votedata.name)
        data.param.append('votenote', '无')
        data.param.append('voteanswernum', this.votedata.answer.length)

        for (let i = 0; i < 6; i++) {
          if (this.votedata.answer[i] === undefined) {
            this.votedata.answer[i] = ''
          }
        }

        data.param.append('vote_answer1', this.votedata.answer[0].answer)
        data.param.append('vote_answer2', this.votedata.answer[1].answer)
        data.param.append('vote_answer3', this.votedata.answer[2].answer)
        data.param.append('vote_answer4', this.votedata.answer[3].answer)
        data.param.append('vote_answer5', this.votedata.answer[4].answer)
        data.param.append('vote_answer6', this.votedata.answer[5].answer)

        // console.log(data.param.get('vote_answer1'))
        // console.log(data.param.get('vote_answer2'))
        // console.log(data.param.get('vote_answer3'))
        // console.log(data.param.get('vote_answer4'))
        // console.log(data.param.get('vote_answer5'))
        // console.log(data.param.get('vote_answer6'))
        this.$store.dispatch('uploadFile', data).then(res => {
          // 把选项的值清空
          this.votedata = {
            name: '',
            answer: [
              {answer: ''},
              {answer: ''}
            ]
          }
          this.$message({
            message: '投票息提交成功',
            type: 'success'
          })
          this.dialogadddataVisible = false
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 删除指定下标
    deletedata (id) {
      if (id > 1) {
        this.votedetail.answer.splice(id, 1)
      }
    },
    // 把数组的id转换为字母
    showlabel (data) {
      return String.fromCharCode(data + 65)
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

    selectedFile (event) {
      let addfile = event.target.files[0]
      this.addfilepath = addfile
      this.fileByBase64(addfile, (base64) => {
        this.base64ByBlob(base64, blob => {
          var url = window.URL.createObjectURL(blob)
          this.imgFile = url
        })
      })
    },
    selectedvoteFile (event) {
      let votefile = event.target.files[0]
      this.votefilepath = votefile
      this.fileByBase64(votefile, (base64) => {
        this.base64ByBlob(base64, blob => {
          var url = window.URL.createObjectURL(blob)
          this.voteFile = url
        })
      })
    }
  },
  mounted () {
    this.getList()
    this.getReleaseList()
  },
  components: {
    'c-table': table
  }
}
</script>

<style scoped>
.main {
  padding: 20px;
}

.addbutton {
  margin-right: 35px;
  margin-top: 20px;
}

.deletebutton {
  margin-left: 20px;
  margin-top: 17px;
  height: 45px;
  width: 45px;
}

.upload {
  /*display: none;*/
  /*opacity: 0;*/
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
  width: 90%;
}

.addquestion {
  margin-top: 10px;
  float: left;
}

.postquestion {
  margin-top: 10px;
  float: right;
}

.questionslist {
  display: flex;
  flex-direction: row;
}

.imgBox{
  width: 50px;
  height: 50px;
  position: relative;
  margin: 22px 0 0 15px;
}
.img{
  width: 100%;
  height: 100%;
}
.upload{
  display: block;
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.footer{
  padding: 10px 0 0 0;
  height: 50px;
}

.table{
  margin: 20px auto;
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
