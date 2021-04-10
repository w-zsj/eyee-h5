<template>
  <div>
    <v-header>
      <div class="nav-tab2 ellipsis">商品详情</div>
    </v-header>
    <div class="play-product-video">
      <div class="video-box flex-center">
        <video ref="myVideo" width="100%" height="auto"
               webkit-playsinline="true"
               playsinline="true"
               x5-video-player-type="h5"
               x5-video-player-fullscreen="true"
               x5-video-orientation="portraint"
               preload="auto"
               style="object-fit:fill"
               @waiting="handleWaiting"
               @playing="handlePlaying"
               @error="handleError"
               @canplaythrough="state.isLoading = false"
               @stalled="state.isLoading = true"
               :poster="videoImg">
          <source :src="videoPath" type="video/mp4"></source>
        </video>
      </div>
      <!-- 控制窗口 -->
      <div
        class="control"
        ref="control"
        @touchstart="touchEnterVideo"
        @touchend="touchLeaveVideo"
      >
        <!-- 播放 || 暂停 || 加载中-->
        <div class="play flex-center" @touchstart.stop="clickPlayBtn">
          <img
            class="play-btn"
            v-show="!state.playing && !state.isLoading"
            src="../../assets/image/icon_play_big.png"
          >
          <img
            class="refresh-btn"
            v-show="state.isLoading"
            src="../../assets/image/icon_refresh_big.png"
          >
        </div>
        <div class="play-time flex-center" v-show="isProgressMove">
          <span class="display-time">{{video.displayTime}}</span>
          <span class="split-line">/</span>
          <span class="total-time">{{video.totalTime}}</span>
        </div>
        <!-- 控制条 -->
        <div class="control-bar">
        <span class="progress" ref="progress">
          <div class="progress-btn progress-btn-focus act" v-show="!state.playing || isProgressMove">
            <span :style="{width:video.progress.percent+'%'}"></span>
          </div>
          <div class="progress-btn progress-btn-blur" v-show="state.playing && !isProgressMove">
            <span :style="{width:video.progress.percent+'%'}"></span>
          </div>
          <!-- 设置手动移动的进度条 -->
          <span
            class="progress-move"
            @touchmove.stop.prevent="moveIng($event)"
            @touchstart.stop="moveStart($event)"
            @touchend.stop="moveEnd($event)"
          ></span>
        </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { throttle } from "@/utils/util";

  const pad = val => {
    val = Math.floor(val);
    if (val < 10) {
      return "0" + val;
    }
    return val + "";
  };
  const timeParse = sec => {
    let min = 0;
    min = Math.floor(sec / 60);
    sec = sec - min * 60;
    return pad(min) + ":" + pad(sec);
  };
  export default {
    data() {
      return {
        videoPath: this.$route.query.videoPath,
        videoImg: this.$route.query.videoImg,
        // progress进度条元素
        progressBar: {
          $progress: null, // 进度条DOM对象
          pos: null
        },
        // video元素
        $video: null,
        // 视频容器元素
        player: {
          $player: null,
          pos: null
        },
        // video控制显示设置
        video: {
          loaded: 0, // 缓存长度
          displayTime: "00:00", // 进度时间
          totalTime: "00:00", // 总时间
          progress: {
            width: 0, // 进度条长度
            percent: 0 // 进度条当前百分比位置
          }
        },
        // 定时器
        hideTimer: null,
        // 播放状态控制
        state: {
          // controlBtnShow: true, // 播放按钮
          controlBarShow: false, // 控制条
          fullScreen: false,
          playing: false,
          isLoading: false,
          isEnd: false,
          isError: false
        },
        // 首次触摸
        isFirstTouch: true,
        // 暂停状态触摸
        isPauseTouch: false,
        isProgressMove: false
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        // 初始化video,获取video元素
        this.$video = this.$refs.myVideo;
        this.initPlayer();
      },
      // 初始化播放器容器, 获取video-player元素
      // getBoundingClientRect()以client可视区的左上角为基点进行位置计算
      initPlayer() {
        const $player = this.$el;
        const $progress = this.$refs.progress;
        // 播放器位置
        this.player.$player = $player;
        this.progressBar.$progress = $progress;
        this.player.pos = $player.getBoundingClientRect();
        this.progressBar.pos = $progress.getBoundingClientRect()
        this.video.progress.width = Math.round($progress.getBoundingClientRect().width);
      },
      moveStart() {
        this.isProgressMove = true;
      },
      moveIng(e) {
        this.isProgressMove = true;
        let currentX = e.targetTouches[0].pageX;
        let offsetX = currentX - this.progressBar.pos.left;
        // 边界检测
        if (offsetX <= 0) {
          offsetX = 0
        }
        if (offsetX >= this.video.progress.width) {
          offsetX = this.video.progress.width
        }

        let percent = offsetX / this.video.progress.width;
        this.$video.duration && this.setPlayTime(percent, this.$video.duration)
      },
      moveEnd(e) {
        // console.log("触摸结束...");
        this.isProgressMove = false;
        let currentX = e.changedTouches[0].pageX;
        let offsetX = currentX - this.progressBar.pos.left;
        // 这里的offsetX都是正数
        let percent = offsetX / this.video.progress.width;
        this.$video.duration && this.setPlayTime(percent, this.$video.duration)
      },
      handlePlaying() {
        this.state.isLoading = false;
        this.state.playing = true;
      },
      // 设置手动播放时间
      setPlayTime(percent, totalTime) {
        this.video.progress.percent = percent * 100;
        this.$video.currentTime = Math.floor(percent * totalTime);
      },
      // 获取播放时间
      getPlayTime() {
        const percent = this.$video.currentTime / this.$video.duration;
        this.video.progress.percent = percent * 100;
        // 赋值时长
        this.video.totalTime = timeParse(this.$video.duration);
        this.video.displayTime = timeParse(this.$video.currentTime);
      },
      // 点击播放 & 暂停按钮
      clickPlayBtn() {
        let _ = this;
        if (_.state.isLoading) return;
        _.isFirstTouch = false;
        _.state.playing = !this.state.playing;
        _.state.isEnd = false;
        if (_.$video) {
          // 播放状态
          if (_.state.playing) {
            try {
              _.$video.play();
              _.isPauseTouch = false;
              // // 监听播放进度
              _.$video.addEventListener(
                "timeupdate",
                throttle(_.getPlayTime, 100, 1)
              );
              // 监听结束
              _.$video.addEventListener("ended", e => {
                // 重置状态
                _.state.playing = false;
                _.state.isEnd = true;
                // this.state.controlBtnShow = true;
                _.video.displayTime = "00:00";
                _.video.progress.percent = 0;
                _.$video.currentTime = 0;
              });
            } catch (e) {
              // 捕获url异常出现的错误
            }
          } else { // 停止状态
            _.isPauseTouch = true;
            _.$video.pause();
          }
        }
      },
      // 触碰播放区
      touchEnterVideo() {
        if (this.isFirstTouch) return;
        if (this.hideTimer) {
          clearTimeout(this.hideTimer);
          this.hideTimer = null;
        }
        // this.state.controlBtnShow = true;
        this.state.controlBarShow = true;
      },
      // 离开播放区
      touchLeaveVideo() {
        let _ = this;
        if (_.isFirstTouch) return;
        if (_.hideTimer) {
          clearTimeout(_.hideTimer);
        }
        // 暂停触摸, 不隐藏
        if (_.isPauseTouch) {
          // this.state.controlBtnShow = true;
          _.state.controlBarShow = true;
        } else {
          _.hideTimer = setTimeout(() => {
            _.state.controlBarShow = false;
            // 加载中只显示loading
            // this.state.controlBtnShow = this.state.isLoading;
            _.hideTimer = null;
          }, 3000);
        }
      },
      // 等待数据加载
      handleWaiting() {
        // this.state.controlBtnShow = true;
        this.state.isLoading = true;
      },
      // 数据加载出错
      handleError() {
        // console.log('数据加载错误');
        this.state.isError = true;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .play-product-video {
    position: relative;
    .flex-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .video-box {
      position: relative;
      background: #0f0f0f;
      height: calc(100vh - 48px);
    }
    .control {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      background-color: transparent;
      .play {
        width: 100vw;
        height: 50vh;
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .play-btn {
        width: 40px;
        height: 48px;
      }
      .refresh-btn {
        width: 50px;
        height: 50px;
        animation: rotate 0.75s 0s linear infinite;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(180deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .play-time {
        position: absolute;
        width: 100vw;
        bottom: 70px;
        line-height: 42px;
        font-size: 28px;
        font-weight: 700;
        .display-time {
          color: #ffffff;
        }
        .split-line {
          font-size: 20px;
          margin: 0 5px;
          color: #c8c8c8;
        }
        .total-time {
          color: #c8c8c8;
        }
      }
      &-bar {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        height: 60px;
        display: flex;
        align-items: center;
        span {
          font-size: 12px;
          color: #fff;
          font-weight: 500;
          white-space: nowrap;
        }
        .progress {
          position: relative;
          width: 100vw;
          height: 2px;
          background: rgba(255, 255, 255, 0.4);
          .progress-move {
            width: 100%;
            height: 26px;
            position: absolute;
            z-index: 100;
            left: 0;
            top: 0;
            transform: translateY(-50%);
            background-color: transparent;
          }
          .progress-btn {
            width: 100vw;
            background: rgba(255, 255, 255, .2);
            position: absolute;
            left: 0;
            top: 0;
            transition: all 16ms;
            span {
              position: absolute;
              left: 0;
              top: 0;
              transition: all 0.1s linear;
            }
          }
          .progress-btn-blur {
            height: 1px;
            span {
              height: 1px;
              background: rgba(255, 255, 255, .4);
            }
          }
          .progress-btn-focus {
            height: 2px;
            span {
              height: 2px;
              background: #fff;
            }
            &.act {
              height: 2px;
              span {
                background: #fff;
                height: 2px;
                &::before {
                  content: "";
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #fff;
                  position: absolute;
                  right: -6px;
                  top: 50%;
                  transform: translateY(-50%);
                  z-index: 3;
                }
              }
            }
          }
          .progress-loaded {
            background-color: red;
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 100%;
            border-radius: 2px;
            transition: all 16ms;
          }
        }
      }
    }
  }
</style>
