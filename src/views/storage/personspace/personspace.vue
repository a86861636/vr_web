<template>
  <div class="main">
    <div class="selectcss">
      <el-select v-model="filevalue" placeholder="请选择" size="mini" style="width: 120px;" @change="selectfilecate">
        <el-option
          v-for="item in fileoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          style="font-size: 10px;"
        >
        </el-option>
      </el-select>
      <div style="position:relative;margin-left: auto;">
        <input type="file" accept="image/*" style="position: absolute;zoom: 133%;width: 60px;opacity: 0;" @change="selectedFile($event)" ref="input"/>
        <el-button type="danger" size="small">上传素材</el-button>
      </div>
    </div>
    <div class="list" v-for="item in radiodata" :key="item.id" v-if="radiodata.length!==0">
      <img :src="showcatelogy(item.materialurl)" class="icon">
      <span class="listfont">{{item.name}}</span>
      <div class="funicon">
        <img src="@/assets/history/垃圾.png" @click="deletematerial(item.id)">
        <img src="@/assets/history/下载.png" @click="download(item.materialurl)">
      </div>
    </div>
    <div v-if="radiodata.length===0" style="text-align: center;">
      <img src="@/assets/history/nodata.png">
    </div>
  </div>
</template>

<script>
import jpg from '@/assets/history/JPG.png'
import word from '@/assets/history/word.png'
import pdf from '@/assets/history/PDF.png'
import ppt from '@/assets/history/ppt.png'
import video from '@/assets/history/video.png'
import excel from '@/assets/history/excel.png'
import txt from '@/assets/history/txt.png'
import downloadfile from '@/utils/utils.js'
export default {
  name: 'personspace',
  data () {
    return {
      Listdata: {},
      radiodata: [],
      fileoptions: [{
        value: '1',
        label: '所有文件'
      }, {
        value: '2',
        label: 'word'
      }, {
        value: '3',
        label: 'excel'
      }, {
        value: '4',
        label: 'ppt'
      }, {
        value: '5',
        label: '图片'
      }, {
        value: '6',
        label: '视频'
      }],
      filevalue: '1'
    }
  },
  methods: {
    getList () {
      let data = {
        url: 'myspace/t/',
        teacherid: this.$store.state.userInfo.tloginid
      }
      console.log(data)
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.Listdata = res.data
        this.showdata()
      })
    },
    showdata () {
      if (this.filevalue === '1') {
        this.radiodata = this.Listdata
      }
      if (this.filevalue === '2') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(doc|docx)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '3') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(excel|xls|xlsl)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '4') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(ppt|pptx)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '5') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '6') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(mp4|avi|mov|rmvb|rm|flv|3GP)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
    },
    // 显示文件类型来改变logo
    showcatelogy (category) {
      if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(category))) {
        return jpg
      }
      if ((/\.(doc|docx)$/i.test(category))) {
        return word
      }
      if ((/\.(pdf)$/i.test(category))) {
        return pdf
      }
      if ((/\.(ppt|pptx)$/i.test(category))) {
        return ppt
      }
      if ((/\.(mp4|avi|mov|rmvb|rm|flv|3GP)$/i.test(category))) {
        return video
      }
      if ((/\.(excel|xls|xlsl)$/i.test(category))) {
        return excel
      }
      if ((/\.(txt)$/i.test(category))) {
        return txt
      }
    },
    getcatelogy (arr) {
      if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(arr))) {
        return 1
      }
      if ((/\.(mp4|avi|mov|rmvb|rm|flv|3GP)$/i.test(arr))) {
        return 2
      }
      if ((/\.(doc|docx)$/i.test(arr))) {
        return 3
      }
      if ((/\.(ppt|pptx)$/i.test(arr))) {
        return 4
      }
      if ((/\.(excel|xls|xlsl)$/i.test(arr))) {
        return 5
      }
      if ((/\.(pdf)$/i.test(arr))) {
        return 6
      }
    },
    // 删除素材
    deletematerial (id) {
      let data = {
        file_id: id,
        trans: true,
        url: 'myspace/delete/',
        user_id: this.$store.state.userInfo.tloginid,
        user_type: 't'
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('post', data).then((res) => {
          console.log(res)
          this.getList()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    selectfilecate (value) {
      console.log(value)
      this.filevalue = value
      this.showdata()
    },
    selectedFile (event) {
      let file = event.target.files[0]
      let typeid = this.getcatelogy(file.name)
      let data = {
        url: 'myspace/tupload/',
        param: new FormData()
      }
      data.param.append('teacherid', this.$store.state.userInfo.tloginid)
      data.param.append('name', file.name)
      data.param.append('typeid', typeid)
      data.param.append('note', '无说明')
      data.param.append('image', file)
      console.log(data)
      this.$store.dispatch('uploadFile', data).then(res => {
        console.log(res)
        this.getList()
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      })
    },
    download (url) {
      downloadfile(this.$store.state.mediaURL + url)
    }
  },
  mounted () {
    this.radio = 1
    this.getList()
  }
}
</script>

<style scoped lang="scss">
  .main {
    padding: 20px;
  }
  .selectcss{
    width: 100%;
    text-align: left;
    margin-bottom: 15px;
    display: flex;
  }
  .selectcss span{
    font-size: 12px;
    margin-left: 14px;
  }
  .list{
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: 28px;
    border-bottom: 1px solid #E4E7ED;
  }
  .icon{
    width: 25px;
  }
  .listfont{
    font-size: 12px;
    padding-left: 10px;
    line-height: 25px;
    color: #606266;
  }
  .funicon{
    margin-left: auto;
  }
  .funicon img{
    width: 20px;
    padding-right: 10px;
    cursor: pointer;
  }
</style>
