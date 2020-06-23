<template>
  <div class="main">
    <div class="select">
      <el-select v-model="schoolvalue" placeholder="请选择学校" size="mini" style="width: 120px;">
        <el-option
          v-for="item in schooloptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          style="font-size: 10px;"
        >
        </el-option>
      </el-select>
      <span class="cascaderlist">
        <el-cascader
          v-model="optionsdata"
          size="mini"
          :options="options"
          :props="{ checkStrictly: true }"
          @change="handleChange"
          clearable></el-cascader>
      </span>
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
      <img :src="showcatelogy(item.path)" class="icon">
      <span class="listfont">{{item.material_name}}</span>
      <div class="funicon">
        <img src="@/assets/history/下载.png" @click="download(item.path)">
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
import downloadfile from 'downloadjs'

export default {
  name: 'publicmaterial',
  data () {
    return {
      Listdata: {},
      radio: '',
      schooloptions: [{
        value: '1',
        label: '北京理工大学'
      }],
      schoolvalue: '',
      options: [],
      optionsdata: ['1', '1'],
      materialdata: [],
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
    getList (school_id = 1, subject_id = 1, major_id = 1) {
      let data = {
        url: 'material/public/',
        user_id: this.$store.state.userInfo.tloginid,
        subject_id: subject_id,
        school_id: school_id,
        major_id: major_id
      }
      this.$store.dispatch('get', data).then(res => {
        console.log(res)
        this.options = []
        this.Listdata = res.data.material_data
        for (let i in res.data.subject_data) {
          let data = {}
          data.value = i
          data.label = res.data.subject_data[i]
          data.children = []
          for (let j in res.data.major_data[i]) {
            let childdata = {}
            childdata.value = j
            childdata.label = res.data.major_data[i][j]
            data.children.push(childdata)
          }
          this.options.push(data)
        }
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
          if ((/\.(doc|docx)$/i.test(i.path))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '3') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(excel|xls|xlsl)$/i.test(i.path))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '4') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(ppt|pptx)$/i.test(i.path))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '5') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/i.test(i.path))) {
            this.radiodata.push(i)
          }
        }
      }
      if (this.filevalue === '6') {
        this.radiodata = []
        for (let i of this.Listdata) {
          if ((/\.(mp4|avi|mov|rmvb|rm|flv|3GP)$/i.test(i.path))) {
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
      this.filevalue = value
      this.showdata()
    },
    // 改变radio的值
    changelabel (value) {
      this.radio = value
      // this.getList()
      this.showdata()
    },
    handleChange (value) {
      console.log(value)
      if (value.length > 1) {
        this.getList(undefined, value[0], value[1])
      } else {
        this.getList(undefined, value[0], -1)
      }
    },
    download (url) {
      downloadfile('http://192.168.1.34:8000/media/' + url)
    }
  },
  mounted () {
    // 这个是开发阶段的默认值，后期要删掉
    this.schoolvalue = this.schooloptions[0].value
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
  .el-cascader-panel{
    font-size: 12px;
  }
</style>
