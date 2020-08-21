<template>
  <div class="work">
    <c-table class="table" @tableBtn='handleBtn(arguments)' :width="500" :tableData='listData'></c-table>
    <el-dialog class="voteDialog" title="投票" :visible.sync="is_dialogShow">
      <div>
        <div class="title">
            {{currentVote.name}}
          </div>
        <div :class="{option: true,active: item.active}" v-for="(item,index) in currentVote.option" :key="index" @click="chooseOption(currentVote.option, index)">{{abc[index]+'.'+item.text}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="is_dialogShow = false">取消</el-button>
        <el-button type="primary" @click="uploadVote">提交</el-button>
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
      abc: ['A', 'B', 'C', 'D', 'E', 'F'],
      listData: {
        title: ['试卷名称', '投票情况', '操作'], // 标题
        list: [], // 对应的内容
        data: [], // 对应的数据
        btn: ['投票'] // 最后的按钮 没有可以空
      },
      workForm: {
        text: '',
        file: '',
        fileName: '',
        done: false
      },
      is_dialogShow: false,
      currentVote: {}
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
        url: 'vote/s/',
        scheduleid: this.$store.state.courseInfo.dbid,
        studentid: userId
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.listData.list = []
        for (let item of res.data) {
          item.option = []
          for(let i = 1;i<=item.answernum;i++){
            console.log('answer'+i)
            item.option.push({text:item['answer'+i],active: false})
          }
          let arr = []
          for (let key in item) {
            if (key === 'name' || key === 'stuanswer') {
              if(key === 'stuanswer'){
                arr.push(item[key]==='null'?'未投票':'已完成')
              }else{
                arr.push(item[key])
              }
            }
          }
          // let sortArr = [arr[1], arr[0], this.trans(arr[2])]
          this.listData.list.push(arr)
        }
        this.listData.data = res.data
        console.log(this.listData)
      })
    },
    selectFile (e) {
      this.workForm.fileName = e.target.files[0].name
      this.workForm.file = e.target.files[0]
    },
    showVoteDetial (item) {
      this.currentVote = item
      this.is_dialogShow = true
    },
    uploadVote () {
      if(!this.currentVote.optionIndex){
        this.$message({
          message: '请选择'
        })
        return false
      }
      let data = {
        url: 'vote/spubvote/',
        trans: true,
        scheduleid: this.$store.state.courseInfo.dbid,
        studentid: this.$store.state.userInfo.id,
        voteanswer: this.currentVote.optionIndex,
        voteid: this.currentVote.id
      }
      this.$store.dispatch('post', data).then(res => {
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
    chooseOption (list, index) {
      if (this.currentVote.stuanswer !== 'null') {
        return false
      }
      for (let item of list) {
        item.active = false
      }
      this.currentVote.optionIndex = index + 1
      list[index].active = !list[index].active
    },
     // 处理表格按钮事件
    handleBtn (value) {
      let type = value[0]
      let data = JSON.parse(value[1])
      console.log(data)
      if (type === '投票') {
        if(data.stuanswer==='null'){
          this.showVoteDetial(data)
        }else{
          this.$message({message: '已投票'})
        }
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
}
.voteDialog{
  .title{
    color: #454545;
    font-size: 16px;
  }
  .option{
    color: #A7A7A7;
    font-size: 16px;
    margin: 10px 0 0 0;
    cursor: pointer;
  }
  .active{
    color: red;
  }
}
</style>