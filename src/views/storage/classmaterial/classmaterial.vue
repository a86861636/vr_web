<template>
  <div class="main">
      <div class="select">
        <el-select v-model="value" placeholder="请选择" size="mini" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="font-size: 10px;"
          >
          </el-option>
        </el-select>
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
      </div>
    <div class="list" v-for="item in radiodata" :key="item.id">
      <img :src="showcatelogy(item.materialurl)" class="icon">
      <span class="listfont">{{item.name}}</span>
      <div class="funicon">
        <img src="@/assets/history/垃圾.png" @click="unpublish(item.id)">
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
  name: 'classmaterial',
  data () {
    return {
      Listdata: {},
      radio: '',
      options: [],
      value: '',
      selectval: 0,
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
    getList (sch_id = '') {
      let data = {
        url: 'material/class/',
        user_id: this.$store.state.userInfo.tloginid,
        semester_id: this.$store.state.userInfo.current_semester,
        schedule_id: sch_id
        // schedule_id: this.$store.state.courseInfo.dbid
      }
      console.log(data)

      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        this.Listdata = res.data.material_list
        // 遍历所有的课程添加到下拉框中
        for (let i of res.data.schedule_list) {
          let data = {}
          data.label = i.name
          data.value = i.id
          console.log(data)
          this.options.push(data)
        }
        console.log(this.options)
        this.showdata()
        this.value = this.options[this.options.length - 1].label
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
    selectfilecate (value) {
      console.log(value)
      this.filevalue = value
      this.showdata()
    },
    getcatelogy (arr) {
      if ((/\.(doc|docx|excel|xls)$/i.test(arr.materialurl))) {
        return arr
      }
    },
    // 改变radio的值
    changelabel (value) {
      console.log(value)
      this.radio = value
      this.showdata()
    },
    handleChange (value) {
      this.selectval = value
      this.getList(this.selectval)
    },
    download (url) {
      downloadfile(this.$store.state.mediaURL + url)
    },
    unpublish (id) {
      console.log(id)
      let data = {
        url: 'material/unpublishMaterial/',
        // param: new FormData()
        class_material_id: id,
        user_id: this.$store.state.userInfo.tloginid,
        trans: true
      }
      // data.param.append('class_material_id', id)
      // data.param.append('user_id', this.$store.state.userInfo.tloginid)
      console.log(data)
      this.$confirm('此操作将从班级素材撤销该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('post', data).then((res) => {
          console.log(res)
          // this.getList()
          this.getList(this.selectval)
        })
        this.$message({
          type: 'success',
          message: '撤销成功!'
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
  .select{
    margin-bottom: 15px;
    margin-left: 12px;
    color: #303133;
  }
</style>
