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
    <div class="list" v-for="item in radiodata" :key="item.id">
      <img :src="showcatelogy(item.materialurl)" class="icon">
      <span class="listfont">{{item.name}}</span>
      <div class="funicon">
        <img src="@/assets/history/垃圾.png" @click="deletematerial(item.id)">
        <img src="@/assets/history/下载.png" @click="download(item.materialurl)">
        <img src="@/assets/history/转发.png" @click="upload(item.id)">
      </div>
    </div>
    <div v-if="radiodata.length===0" style="text-align: center;">
      <img src="@/assets/history/nodata.png">
    </div>

    <el-dialog
      :visible.sync="dialoguploadVisible"
      width="390px">
      <div>
        <div><span style="font-size: 12px;">请选择要上传素材的班级:</span>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="font-size: 10px;"
            >
            </el-option>
          </el-select>
        </div>
        <div slot="footer" style="text-align: right;margin-top: 30px;margin-right: 30px;">
          <el-button type="primary" size="mini" @click="uploadvalue">上传</el-button>
        </div>
      </div>
    </el-dialog>
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
  name: 'personmaterial',
  data () {
    return {
      Listdata: {},
      radio: '',
      dialoguploadVisible: false,
      selectlist: [],
      options: [],
      value: '',
      materialdata: [],
      materialid: 0,
      radiodata: [],
      img: '',
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
        url: 'material/personal/',
        user_id: this.$store.state.userInfo.tloginid,
        semester_id: this.$store.state.userInfo.current_semester
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.materialdata = res.data.material_list
        this.selectlist = res.data.schedule_id
        this.showdata()
        this.initselecedata()
      })
    },
    showdata () {
      if (this.filevalue === '1') {
        this.radiodata = this.materialdata
      }
      if (this.filevalue === '2') {
        this.radiodata = []
        for (let i of this.materialdata) {
          if ((/\.(doc|docx)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '3') {
        this.radiodata = []
        for (let i of this.materialdata) {
          if ((/\.(excel|xls|xlsl)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '4') {
        this.radiodata = []
        for (let i of this.materialdata) {
          if ((/\.(ppt|pptx)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '5') {
        this.radiodata = []
        for (let i of this.materialdata) {
          if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(i.materialurl))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '6') {
        this.radiodata = []
        for (let i of this.materialdata) {
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
      if ((/\.(ppt|pptx)$/i.test(category))) {
        return ppt
      }
      if ((/\.(pdf)$/i.test(category))) {
        return pdf
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
    selectfilecate (value) {
      console.log(value)
      this.filevalue = value
      this.showdata()
    },
    // 改变radio的值
    changelabel (value) {
      this.radio = value
      // this.getList()
      this.showdata()
    },
    // 删除素材
    deletematerial (id) {
      let data = {
        user_id: this.$store.state.userInfo.tloginid,
        trans: true,
        url: 'material/delete/',
        material_id: id
      }
      console.log(data)
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
    // 下载素材
    download (url) {
      downloadfile(this.$store.state.mediaURL + url)
    },
    // 上传素材到班级
    upload (id) {
      this.dialoguploadVisible = true
      this.materialid = id
      this.value = ''
    },
    //  初始化下拉列表
    initselecedata () {
      for (let i of this.selectlist) {
        console.log(i)
        let data = {}
        data.label = i.sche_name
        data.value = i.id
        console.log(data)
        this.options.push(data)
      }
    },
    // 提交素材post请求
    uploadvalue () {
      if (this.value === '') {
        this.$message.error('请选择班级')
      } else {
        let data = {
          url: 'material/publishMaterial/',
          user_id: this.$store.state.userInfo.tloginid,
          material_id: this.materialid,
          schedule_id: this.value,
          trans: true
        }
        console.log(data)
        this.$store.dispatch('post', data).then((res) => {
          if (res.data === '发布成功') {
            console.log(res)
            this.$message({
              type: 'success',
              message: '上传成功!'
            })
          }
          if (res.data === '请勿重复发布') {
            this.$message({
              type: 'error',
              message: '素材已存在于该课程，请不要重复发布!'
            })
          }
        })
        this.dialoguploadVisible = false
      }
    },
    selectedFile (event) {
      console.log(event)
      let file = event.target.files[0]
      console.log(file)
      let typeid = this.getcatelogy(file.name)
      let data = {
        url: 'material/tuploadfilenew/',
        param: new FormData()
      }
      data.param.append('teacherid', this.$store.state.userInfo.tloginid)
      data.param.append('name', file.name)
      data.param.append('typeid', typeid)
      data.param.append('note', '无说明')
      data.param.append('myfile', file)
      console.log(data)
      this.$store.dispatch('uploadFile', data).then(res => {
        console.log(res)
        this.getList()
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      })
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
  .list {
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: 28px;
    border-bottom: 1px solid #E4E7ED;
  }

  .icon {
    width: 25px;
  }

  .listfont {
    font-size: 12px;
    padding-left: 10px;
    line-height: 25px;
    color: #606266;
  }

  .funicon {
    margin-left: auto;
  }

  .funicon img {
    width: 20px;
    padding-right: 10px;
    cursor: pointer;
  }
</style>
