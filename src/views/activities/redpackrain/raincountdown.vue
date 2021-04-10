<template>
  <div class="rain_wrap">
    <div class="countdown">
      <div class="countdown_text">
        {{second}}<span>S</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "raincountdown",
  data() {
    return {
      second: 5,
      secondRun: null
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    }
  },
  mounted() {
    let _ = this;
    _.countdownTime();
  },
  beforeCreate() {
    document.getElementsByTagName("body")[0].className="rain_wrap_body";
  },
  beforeDestroy: function() {
    let _ = this;
    document.body.removeAttribute("class","rain_wrap_body");
    clearInterval(_.secondRun);
  },
  methods: {
    countdownTime() {
      let _ = this;
      _.secondRun = setInterval(() => {
        if (_.second <= 0) {
          _.$router.replace("/raingame");
        } else {
          _.second--;
        }
        
      }, 1000);
    }
  }
};
</script>
<style>
.rain_wrap_body {
  width: 100%;
  height: 100%;
  background: url("/static/imgs/redpackrain/ipx.png") repeat-y;
  background-size: 100% 9.0667vw;;
}
</style>
<style scoped>
.rain_wrap{
  width: 100%;
  height: 100%;
  padding-bottom: 10vw;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  background: url("/static/imgs/redpackrain/bg.jpg?new")  no-repeat;
  background-size: 100% 255.2vw;
}
.countdown {
  width: 80.1333vw;
  height: 102.8vw;
  background: url("/static/imgs/redpackrain/countdown.png") no-repeat;
  background-size: 100% 100%;
  margin: 65.6vw auto 0;
  position: relative;
  overflow: hidden;
}
.countdown_text {
  margin: 62.6667vw auto 0;
  height: 12.8vw;
  line-height: 12.8vw;
  text-align: center;
  width: 29.3333vw;
  font-size: 38px;
  color: #ffe493;
  font-weight: bold;
  font-family: 'OswaldBold';
  text-shadow: 3px 3px 3px #74222c;
}
.countdown_text span {
  font-size: 28px;
}
</style>
