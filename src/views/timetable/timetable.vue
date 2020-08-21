<template>
  <div class="class-table">
    <div>
      学年学期：
      <el-select v-model="currentTermDate" @change="handleSelectWeek" placeholder="请选择">
        <el-option
          v-for="item in termList"
          :key="item.semesterdate_id"
          :label="item.semesterdate_id"
          :value="item.semesterdate_id">
        </el-option>
      </el-select>
      &nbsp;&nbsp;&nbsp;周次：
      <el-select v-model="currentWeek" @change="handleSelectWeek" placeholder="请选择">
        <el-option
          v-for="item in weekList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="table-wrapper">
      <div class="tabel-container">
        <table>
          <thead>
          <tr>
            <th>{{monthNumber}}月</th>
            <th v-for="(item, index) in calendar" :key="index"> {{item.week}} <br> {{item.day}}日</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(courseNum, courseIndex) in coursesLen" :key="courseIndex">
            <td>
              <p>{{'第' + digital2Chinese(courseNum) + "节"}}</p>
            </td>
            <td v-for="(weekNum, weekIndex) in weeks" :key="weekIndex" @click="toteacherFunction(fieldCharacter(weekIndex, courseIndex, true))">
              {{ fieldCharacter(weekIndex, courseIndex) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      weekList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], // 所有教学周
      termList: [], // 所有学期
      currentTermDate: '', // 当前学期
      currentTerm: '', // 当前学期
      currentWeek: '', // 当前教学周
      monthNumber: '', // 月份
      calendar: [], // 几号
      weeks: [], // 周一到周日集合
      coursesLen: 0, // 最大课节数
      classTableData: { // mock模拟的数据
        weekCourse: [
          {
            week: 1,
            courses: []
          },
          {
            week: 2,
            courses: []
          },
          {
            week: 3,
            courses: []
          },
          {
            week: 4,
            courses: []
          },
          {
            week: 5,
            courses: []
          },
          {
            week: 6,
            courses: []
          },
          {
            week: 7,
            courses: []
          }
        ],
        courseDtailsList: []
      }
    }
  },
  created () {
    this.getdate(this.getFullDate(), true)
  },
  methods: {
    /**
       *  添加接口传递过来的数据，进行参数的转化
       *  @param {String} date 日期 格式20200210
       *  @param {Boolean} first 第一次获取
       * */
    getdate (date, first) {
      // console.log(this.classTableData.weekCourse)
      let data = {
        url: 'schedule/theweek/' + this.$store.state.userInfo.id + '/' + date + '/',
        user_id: this.$store.state.userInfo.id,
        semester_id: this.currentTerm.id || ''
      }
      if (this.$store.state.userInfo.user_type==='s') {
        data.url = 'schedule/stheweek/' + this.$store.state.userInfo.id + '/' + date + '/'
      }
      this.$store.dispatch('get', data).then((res) => {
        // console.log(res)
        this.calendar = res.calendar
        this.classTableData.courseDtailsList = res.courseDtailsList
        if (first) {
          this.currentWeek = res.weekSchool[0]
          this.termList = res.semester_list.reverse()
          this.currentTermDate = this.termList[0].semesterdate_id
          this.currentTerm = this.termList[0]
          this.$store.state.currentTerm = this.currentTerm
          this.$store.state.currentWeek = this.currentWeek
        }

        for (let j of this.classTableData.weekCourse) {
          j.courses = []
          for (let i of this.classTableData.courseDtailsList) {
            if (i.week === j.week) {
              let arr = []
              arr = i.section.split(',')
              for (let x of this.getarr(arr)) {
                let obj = {}
                obj.info = i
                obj.subject = i.subject
                obj.section = x
                j.courses.push(obj)
              }
            }
          }
        }
        this.updateData()
        this.initWeekCourses()
      })
    },
    /**
       * 更新mock模拟的数据，对数据进行排序
       */
    updateData () {
      /* 将数据按从周日到周六排序 */
      this.classTableData.weekCourse.sort((a, b) => {
        return a.week - b.week
      })

      /* 将数据按从第一节到第n节排序 */
      for (let v of this.classTableData.weekCourse) {
        for (let k in v) {
          if (k === 'courses') {
            v[k].sort((a, b) => {
              return a.index - b.index
            })
          }
        }
      }

      // console.log(JSON.stringify(this.classTableData.weekCourse))
    },

    /**
       * 计算周数据及课节数
       */
    initWeekCourses () {
      const that = this
      this.weeks = [] // 周集合
      this.coursesLen = 0 // 最大的课节数
      this.weeks = this.classTableData.weekCourse.map((item, index) => {
        for (let k in item) {
          if (k === 'courses') {
            let maxCoursesLen = 0
            /* 取出一周中最大的课节数及当天的最大课节数 */
            for (let j of item.courses) {
              j.section > that.coursesLen && (that.coursesLen = j.section) // 取所有一周里最大课节值
              j.section > maxCoursesLen && (maxCoursesLen = j.section) // 取当天最大课节值
            }

            /* 如果当天的课节总数小于当天的最大课节值 */
            if (item[k].length < maxCoursesLen) {
              for (let i = 0; i < maxCoursesLen; i++) { // 以最大课节值为终点遍历当天课节
                if (!item[k][i] || item[k][i].section !== (i + 1)) { // 如果下标课节不存在或着与循环的下标不匹配
                  item[k].splice(i, 0, '') // 填充空课节
                }
              }
            }
          }
        }
        this.coursesLen = 13
        return item.week
      })
    },

    /**
       * 处理格子数据，无数据转换为字符串'-'
       * @param {Number} weekIndex 周几对应的下标
       * @param {Number} courseNum 第几节课对应的下标
       * @returns {String} 返回对应的字符
       */
    fieldCharacter (weekIndex, courseIndex, getInfo) {
      // 要在判断前把接口重新排序好
      this.sortarr(this.classTableData.weekCourse[weekIndex], courseIndex)
      if (
        this.classTableData.weekCourse[weekIndex] &&
          this.classTableData.weekCourse[weekIndex].courses[courseIndex] &&
          this.classTableData.weekCourse[weekIndex].courses[courseIndex].section === courseIndex + 1
          // this.classTableData.weekCourse[weekIndex] === courseIndex
      ) {
        if (getInfo) {
          return this.classTableData.weekCourse[weekIndex].courses[courseIndex].info
        }
        return this.classTableData.weekCourse[weekIndex].courses[courseIndex].subject
      }
      return '-'
    },
    /**
       * 去除数组里面所有字符串的空白字符
       * 并且要把转化成的字符串转换为整数
       */
    getarr (arr) {
      let res = []
      for (let i of arr) {
        i = i.replace(/\s+/g, '')
        i = parseInt(i)
        res.push(i)
      }
      return res
    },

    /**
       * 后台传递过来的数据课程顺序是乱的，需要做一次排序
       * 思路是把新增的课程的课程数和课程名称覆盖成section的课程下标
       * 比如新增的课程的的section为1，名字为VR应用项目策划，那么就把下标为0的课程覆盖
       * */
    sortarr (obj) {
      if (obj.courses.length !== 0) {
        for (let i in obj.courses) {
          if (obj.courses[i].section !== undefined) {
            if (i !== obj.courses[i].section - 1) {
              // console.log(obj.courses[i].section)
              if (obj.courses[obj.courses[i].section - 1] === '') {
                let newdata = {}
                newdata.section = obj.courses[i].section
                newdata.subject = obj.courses[i].subject
                // console.log(newdata)
                // 把原来的下标覆盖上去
                obj.courses[obj.courses[i].section - 1] = newdata
                // 在修改值后把原来的值赋值为空
                obj.courses[i] = ''
              }
            }
          }
        }
      }
    },

    /**
       * 数字转中文
       * @param {Number} num 需要转换的数字
       * @param {Boolean} identifier 标识符
       * @returns {String} 转换后的中文
       */
    digital2Chinese (num, identifier) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三']
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num]
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
      this.$store.state.currentTerm = this.currentTerm
      this.$store.state.currentWeek = this.currentWeek
      this.getdate(selectDate)
    },

    toteacherFunction (courseInfo) {
      if (courseInfo === '-') {
        return false
      }
      window.localStorage.setItem('courseInfo', JSON.stringify(courseInfo))
      this.$store.state.courseInfo = courseInfo
      if (this.$store.state.userInfo.user_type==='s') {
        this.$router.push('/studentFunction/index')
      }else{
        this.$router.push('/teacherFunction/index')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .class-table {
    .table-wrapper {
      margin-top: 20px;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    .tabel-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      table {
        table-layout: fixed;
        width: 720px;

        thead {
          background-color: #67a1ff;

          th {
            color: #fff;
            line-height: 17px;
            height: 45px;
            font-weight: normal;
          }
        }

        tbody {
          background-color: #eaf2ff;

          td {
            color: #677998;
            line-height: 16px;
          }
        }

        th,
        td {
          width: 60px;
          padding: 12px 2px;
          font-size: 12px;
          text-align: center;
        }

        tr td:first-child {
          color: #333;

          .period {
            font-size: 8px;
          }
        }
      }
    }
  }
</style>
