<template>
  <div class="video" ref="vcontainer">
    <div class="questionDialog" v-if="questionDialog">
      <div class="box">
        <div class="title">
          <img class="type" src="@/assets/index/单选题.png" v-if="currentQuestion.question_type===1" alt="">
          <img class="type" src="@/assets/index/多选题.png" v-if="currentQuestion.question_type===2" alt="">
          <img class="type" src="@/assets/index/简答题.png" v-if="currentQuestion.question_type===3" alt="">
          {{currentQuestion.title}}
        </div>
        <div>
          <div :class="{option: true,active: item.active}" v-for="(item,index) in currentQuestion.option" :key="index" @click="chooseOption(item)">
            {{abc[index]+'.'+item.label}}
          </div>
        </div>
        <div class="right_answer" v-if="currentQuestion.is_done">
          正确答案：{{currentQuestion.abc_answer}}
        </div>
        <el-button size="small" v-if="!currentQuestion.is_done" class="surebtn" type="primary" @click="sureAnswer">确认</el-button>
        <i class="el-icon-close close-icon" @click="closeQuestion"></i>
      </div>
    </div>
    <div ref="logo" class="logo" :style="'top:' + logo.top + 'px'" id="logo">{{user_id}}</div>
    <video class="video-player" controls="controls" controlsList="nodownload" ref="v" @timeupdate="handleTimeUpdate" @ended="handleEnd">
      <source :src="playURL" />
    </video>
    <div :class="{'controller-btn':true, 'controller-btn-fullscreen': !is_fullscreen, 'controller-btn-fullscreen-small': is_fullscreen}" @click="toggleFullscreen">
      <font-awesome-icon :icon="['fas', 'expand']"></font-awesome-icon>
    </div>
  </div>
</template>

<script>
import { TimelineMax } from 'gsap'
import videoSlider from '@/components/videoSlider'
function secToTimer (originalSec) {
  const min = Math.floor(originalSec / 60)
  const sec = Math.floor(originalSec % 60)
  const minStr = min < 10 ? `0${min}` : String(min)
  const secStr = sec < 10 ? `0${sec}` : String(sec)
  return `${minStr}:${secStr}`
}

export default {
  name: 'MyVideo',
  props: [
    'videoSrc',
    'questionList'
  ],
  components: {
    'video-slider': videoSlider
  },
  data () {
    return {
      logo: {
        top: 0
      },
      playURL: '',
      tm: null,
      video: null,
      isPaused: true,
      isMuted: true,
      videoTime: '00:00 / 00:00',
      totalTime: 0,
      per: 0,
      abc: ['A', 'B', 'C', 'D', 'E', 'F'],
      is_fullscreen: false,
      questionDialog: false,
      currentQuestion: {
        // option_a: '1111',
        // option_b: '2222',
        // option_c: '3333',
        // option_d: '4444',
        // option_e: null,
        // option_f: null,
        // option: [{
        //   label: '1111',
        //   active: false,
        //   right: true
        // }, {
        //   label: '1111',
        //   active: false,
        //   right: true
        // }],
        // abc_answer: '',
        // question_type: 1,
        // right_answer: '4',
        // show_time: 10,
        // is_done: false,
        // is_correct: false,
        // title: '测试单选题'
      }
    }
  },
  methods: {
    toggleFullscreen () {
      const isFullscreen = document.webkitIsFullScreen || document.fullscreen
      if (isFullscreen) {
        const exitFunc = document.exitFullscreen || document.webkitExitFullscreen
        exitFunc.call(document)
      } else {
        const element = this.$refs.vcontainer
        const fullscreenFunc = element.requestFullscreen || element.webkitRequestFullScreen
        fullscreenFunc.call(element)
      }
    },
    handleEnd () {
      this.pauseVideo()
    },
    refreshTime () {
      if (!this.video) {
        this.per = 0
        return `${secToTimer(0)} / ${secToTimer(0)}`
      }
      const curTime = this.video.currentTime || 0
      const duration = this.video.duration || 0
      // this.per = Math.floor(duration / curTime)
      this.totalTime = Math.ceil(duration)
      this.per = Math.ceil(curTime)
      console.log(this.questionList)
      // console.log(this.per)
      return `${secToTimer(curTime)} / ${secToTimer(duration)}`
    },
    showQuestion () {
      if (this.video) {
        const curTime = Math.ceil(this.video.currentTime) || 0
        for (let item of this.questionList) {
          if (item.show_time === curTime && !item.is_showed) {
            console.log(111)
            this.pauseVideo()
            item.is_showed = true
            item.option = []
            item.is_done = false
            item.is_correct = false
            item.abc_answer = ''
            let i = 0
            for (let letter of this.abc) {
              i++
              if(!!item['option_' + letter.toLowerCase()]){
                item.option.push({label: item['option_' + letter.toLowerCase()], active: false, right: item.right_answer.indexOf(i + '') > -1})
              }
              if (item.right_answer.indexOf(i + '') > -1) {
                item.abc_answer = item.abc_answer + letter
              }
            }
            this.currentQuestion = item
            this.questionDialog = true
            console.log(item)
          }
        }
      }
    },
    chooseOption (item) {
      item.active = !item.active
      this.$forceUpdate()
    },
    sureAnswer () {
      let i = 0
      let j = 0
      for (let item of this.currentQuestion.option) {
        if (item.right) {
          i++
          if (item.active) {
            j++
          }
        }
      }
      if (i === j) {
        this.currentQuestion.is_correct = true
      } else {
        this.currentQuestion.is_correct = false
      }
      this.currentQuestion.is_done = true
      this.$forceUpdate()
    },
    handleTimeUpdate () {
      this.showQuestion()
      // this.videoTime = this.refreshTime()
    },
    playVideo () {
      this.isPaused = false
      this.video.play()
    },
    pauseVideo () {
      this.isPaused = true
      this.video.pause()
    },
    stopMove () {
      this.tm.clear()
      this.tm.eventCallback('onComplete', null)
    },
    startMove () {
      let _self = this
      let vc = _self.$refs.vcontainer
      let logo = _self.$refs.logo
      _self.logo.top = Math.random(1) * (vc.clientHeight - 100)
      _self.tm.set('#logo', {left: -logo.clientWidth}).to('#logo', 40, {
        left: vc.clientWidth,
        onComplete () {
          _self.logo.top = Math.random(1) * (vc.clientHeight - 100)
        }
      })
    },
    fullListener () {
      let _self = this
      document.addEventListener('fullscreenchange', function () {
        _self.is_fullscreen = !_self.is_fullscreen
        _self.stopMove()
        _self.startMove()
      })
      document.addEventListener('webkitfullscreenchange', function () {
        _self.is_fullscreen = !_self.is_fullscreen
        _self.stopMove()
        _self.startMove()
      })
      document.addEventListener('mozfullscreenchange', function () {
        _self.is_fullscreen = !_self.is_fullscreen
        _self.stopMove()
        _self.startMove()
      })
      document.addEventListener('MSFullscreenChange', function () {
        _self.is_fullscreen = !_self.is_fullscreen
        _self.stopMove()
        _self.startMove()
      })
    },
    closeQuestion () {
      if (this.currentQuestion.is_done) {
        this.questionDialog = false
        this.playVideo()
      } else {
        this.$message({
          type: 'info',
          message: '请完成题目'
        })
      }
    }
  },
  mounted () {
    this.video = this.$refs.v
    this.tm = new TimelineMax({repeat: -1})
    this.fullListener()
    this.startMove()
  },
  computed: {
    user_id () {
      return this.$store.state.userInfo.user_id || ''
    }
  },
  watch: {
    videoSrc () {
      console.log('videoSrc')
      this.playURL = this.videoSrc
      this.video.src = this.playURL
      this.playVideo()
    }
  }
}
</script>

<style lang="less" scoped>
.video {
  position: relative;
}
.logo{
  position: absolute;
  left: 0;
  top: 50%;
  z-index: 5;
  color: white;
  opacity: 0.5;
}
.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  background: black;
}
.controller-btn {
  cursor: pointer;
  transition: 0.5s;
  position: relative;
  opacity: 0;
}
.controller-btn-fullscreen {
  position: absolute;
  right: 20px;
  bottom: 24px;
  color: rgb(255, 255, 255);
  font-size: 20px;
  padding: 19px;
}
.controller-btn-fullscreen-small {
  position: absolute;
  right: 10px;
  bottom: 8.5px;
  color: white;
  font-size: 15px;
  padding: 9px;
}
.questionDialog{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba( 0,0,0,0.7);
  z-index: 99;
  .box{
    width: 400px;
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: white;
    border-radius: 30px;
    .close-icon{
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 25px;
      cursor: pointer;
    }
    .title{
      position: relative;
      padding: 2px 0 0 30px;
    }
    .type{
      position: absolute;
      left: 0;
      top: 0;
      height: 25px;
      width: 25px;
    }
    .option{
      padding: 0 0 0 30px;
      margin-top: 5px;
      cursor: pointer;
    }
    .active{
      color: red;
    }
    .surebtn{
      display: block;
      margin: 30px auto 0 auto;
    }
    .right_answer{
      margin-top: 10px;
    }
  }
}
</style>
