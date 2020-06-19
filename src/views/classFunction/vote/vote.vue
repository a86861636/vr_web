<template>
  <div class="main">
    <!--    <el-button type="danger" round class="addbutton" @click="adddata">添加</el-button>-->
    <c-table @tableBtn='handleBtn(arguments)' @postdata="adddata" :width="500" :tableData='recordData'
             :isadd="true"></c-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="950px">
      <div id="votetable" style="width: 600px;height: 400px;"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogadddataVisible"
      width="950px">
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
  </div>
</template>

<script>
import table from '@/components/normalTable'
import echarts from 'echarts'

export default {
  name: 'vote',
  data () {
    return {
      recordData: {
        title: ['已发布试卷名称', '创建时间', '学生提交情况', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['图表', '删除'] // 最后的按钮 没有可以空
      },
      dialogVisible: false,
      dialogadddataVisible: false,
      chartsdata: '',
      votedata: {
        name: '',
        answer: [
          {answer: ''},
          {answer: ''}
        ]
      },
      imgFile: ''
    }
  },
  methods: {
    // 获取投票列表
    getList () {
      console.log(this.$store.state.userInfo.tloginid)
      let data = {
        url: 'vote/t/',
        teacherid: this.$store.state.userInfo.tloginid,
        scheduleid: this.$store.state.courseInfo.dbid
      }
      console.log(data)
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.recordData.data = res.data
        for (let item of res.data) {
          console.log(item)
          let arr = []
          arr[0] = item.name
          arr[1] = '还没有时间接口'
          arr[2] = item.answernum
          this.recordData.list.push(arr)
        }
      })
    },
    // 显示图表
    handleBtn (value) {
      console.log(value)
      let type = value[0]
      let data = JSON.parse(value[1])
      console.log(type)
      if (type === '图表') {
        this.tablescheduleid = data.releaseid
        this.dialogVisible = true
        this.$nextTick(function () {
          this.initChart()
        })
      }
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
        console.log(res)
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
          console.log(res.data.Ring.series)
          let newlegend = []
          let newseries = []
          for (let i of res.data.Ring.series) {
            console.log(i)
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
          break
        } else {
          let data = {
            url: 'vote/tpubvote/',
            param: new FormData()
          }
          data.param.append('filePath', this.imgFile)
          data.param.append('teacherid', this.$store.state.userInfo.tloginid)
          data.param.append('votename', this.votedata.name)
          data.param.append('votenote', '无')
          data.param.append('voteanswernum', this.votedata.answer.length)

          // 后台的接口是需要6个选项都提交，所以要把剩下的值都赋值为空
          // let formdata = {
          //   name: '',
          //   answer: [
          //     {answer: ''},
          //     {answer: ''}
          //   ]
          // }

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
          this.$store.dispatch('uploadFile', data).then(res => {
            console.log(res)
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
          break
        }
      }
    },
    // 删除指定下标
    deletedata (id) {
      console.log(id)
      if (id > 1) {
        this.votedata.answer.splice(id, 1)
        console.log(this.votedata.answer)
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
        // console.log(e.target.result)
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
      // console.log(new Blob([u8arr], { type: mime }))
      callback(new Blob([u8arr], {type: mime}))
    },

    selectedFile (event) {
      let file = event.target.files[0]

      this.fileByBase64(file, (base64) => {
        this.base64ByBlob(base64, blob => {
          // console.log(blob, 'blob')
          var url = window.URL.createObjectURL(blob)
          this.imgFile = url
          console.log(this.imgFile)
        })
      })
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
</style>
