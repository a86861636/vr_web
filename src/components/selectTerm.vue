<template>
  <div class="selectTerm">
    <div class="selectWeek">
        <div>周数:&nbsp;&nbsp;</div>
        <el-select v-model="currentWeek" size="mini" style="width: 80px" @change="handleSelectWeek" placeholder="请选择">
          <el-option
            v-for="item in weekList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
    <el-menu
      class="menu"
      background-color="#F7F9F9"
      :default-active="courseInfo.dbid+''"
      text-color="#000000">
      <el-menu-item v-for="item of classList" :key="item.dbid" :index="item.dbid+''" class="item" @click="changeClass(item)">
        <span slot="title">{{item.subject}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'selectTerm',
  data () {
    return {
      weekList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], // 所有教学周
      termList: [], // 所有学期
      currentTermDate: '', // 当前学期
      currentTerm: '', // 当前学期
      currentWeek: '', // 当前教学周
      classList: '',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created () {
    if (!this.$store.state.currentTerm) {
      this.getdate(this.getFullDate(), true)
    } else {
      this.currentTerm = this.$store.state.currentTerm
      this.currentWeek = this.$store.state.currentWeek
      this.getdate(this.getFullDate(this.currentTerm.semester_startdate, this.currentWeek), true)
    }
  },
  computed: {
    courseInfo () {
      return this.$store.state.courseInfo
    }
  },
  methods: {
    changeClass (courseInfo) {
      window.localStorage.setItem('courseInfo', JSON.stringify(courseInfo))
      this.$store.state.courseInfo = courseInfo
    },
    /**
       *  添加接口传递过来的数据，进行参数的转化
       *  @param {String} date 日期 格式20200210
       *  @param {Boolean} first 第一次获取
       * */
    getdate (date, first) {
      // console.log(this.classTableData.weekCourse)
      let data = {
        url: 'schedule/theweek/47/' + date + '/',
        user_id: this.$store.state.userInfo.tloginid,
        semester_id: this.currentTerm.id || ''
      }
      this.$store.dispatch('get', data).then((res) => {
        console.log(res)
        if (first) {
          this.currentWeek = res.weekSchool[0]
          this.termList = res.semester_list.reverse()
          this.currentTermDate = this.termList[0].semesterdate_id
          this.currentTerm = this.termList[0]
        }
        this.classList = res.courseDtailsList
      })
    },
    /**
       * 获取学年学期第几周的第一天日期
       * @param {String} start 学期开始日期
       * @param {Number} week 第几周
       * @returns {String} 转换后年月日 格式20200210
       */
    getFullDate (start, week) {
      // 获取当天日期
      let curDate = new Date()
      let year = curDate.getFullYear().toString()
      let month = (curDate.getMonth() + 1).toString()
      let day = curDate.getDate().toString()
      // 选择周数时那天的日期
      if (week) {
        curDate = new Date(start.slice(0, 4) + '-' + start.slice(4, 6) + '-' + start.slice(6))
        let selectDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000 * (week - 1) * 7)
        year = selectDate.getFullYear().toString()
        month = (selectDate.getMonth() + 1).toString()
        day = selectDate.getDate().toString()
      }
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.monthNumber = month
      return year + month + day
    },
    /**
       * 更改学期和周数后重新获取课程表
       */
    handleSelectWeek () {
      for (let item of this.termList) {
        if (item.semesterdate_id === this.currentTermDate) {
          this.currentTerm = item
          break
        }
      }
      let selectDate = this.getFullDate(this.currentTerm.semester_startdate, this.currentWeek)
      this.getdate(selectDate)
    }
  }
}
</script>
<style scoped>
.selectTerm{
  width: 210px;
  background-color: rgb(247, 249, 249);
}
.selectWeek{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  font-size: 12px;
}
</style>
