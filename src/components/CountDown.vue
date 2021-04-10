
<template>
  <div>{{ time }}</div>
</template>

<script>
export default {
  props: {
    /**
     * 倒计时目标时间
     * 如果为类型为Number 则传入需要倒计时的毫秒数
     * 如果为类型为Date 则提供所需要倒计时的截至时间
     */
    target: {
      type: [Number, Date],
      required: true
    },
    /**
     * 是否现实天
     */
    showDay: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * 日期格式化，showDay为true传入长度为4的输入，否则为传入长度为3的输入
     * 例如: ['时','分','秒'] => xx时xx份xx秒
     * 默认为 xx:xx:xx
     */
    format: {
      type: Array,
      required: false,
      default: () => []
    },
    /**
     * 是否停止时间
     */
    clearTimer: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      time: "",
      resultFormat: [],
      changeFormat: false
    };
  },
  mounted() {
    this.getFormat();
  },
  methods: {
    getFormat() {
      const len = this.format.length;

      if (!this.showDay) this.resultFormat.push("");

      if (len >= 3) {
        for (let i = 0; i < len; i++) {
          if (this.resultFormat.length >= 4) break;
          if (this.format[i]) {
            this.resultFormat.push(this.format[i].toString());
          }
        }

        if (this.resultFormat.length >= 4) this.changeFormat = true;
      }

      this.getLastTime();
    },
    init(gapTime) {
      setTimeout(() => {
        this.getLastTime(gapTime);
      }, 1000);
    },
    getLastTime(gapTime) {
      if (this.target instanceof Date) {
        gapTime = Math.ceil((this.target - new Date().getTime()) / 1000);
      } else if (typeof this.target === 'number') {
        gapTime ? gapTime-- : gapTime = Math.ceil(this.target / 1000)
      } else {
        console.error('target 类型错误')
        return
      }

      let result = "";
      let time = "00:00:00";
      let day = "00";
      const format = this.resultFormat;

      if (gapTime > 0) {
        day = this.formatNum(parseInt(gapTime / 86400));
        let lastTime
        if (this.showDay) {
          lastTime = gapTime % 86400;
        } else {
          lastTime = gapTime
        }
        const hour = this.formatNum(parseInt(lastTime / 3600));
        lastTime = lastTime % 3600;
        const minute = this.formatNum(parseInt(lastTime / 60));
        const second = this.formatNum(lastTime % 60);

        if (this.changeFormat) {
          time = `${hour}${format[1]}${minute}${format[2]}${second}${
            format[3]
          }`;
        } else time = `${hour}:${minute}:${second}`;

        if (!this.clearTimer) this.init(gapTime);
      } else {
        this.endfn();
      }

      if (this.showDay) {
        if (this.changeFormat) {
          result = `${day}${format[0]} ${time}`;
        } else {
          result = `${day}d ${time}`;
        }
      } else {
        result = time;
      }
      this.time = result;
    },
    formatNum(num) {
      return num > 9 ? num : `0${num}`;
    },
    endfn() {
      /**
       * 倒计时结束回调事件
       * @type {Event}
       */
      this.$emit("callback", {});
    }
  }
};
</script>