<template>
<!-- 拍卖入口 图片动效 组件 -->
  <div>
    <div id="app" class="nextSlide">
      <ul class="slides">
        <li
          :class="slidePosition(index, slide)"
          v-for="(slide, index) in slideData"
          :key="index"
        >
          <img v-if="slidePosition(index, slide) !== 'slide-right' && slidePosition(index, slide) !== 'slide-right-out'" :src="slide.imageurl" alt="" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "auction-img",
  data() {
    return {
      slider: {
        counter: 0,
        slides: []
      },
      currentItem: {}
    };
  },
  props: {
    listArr: {
      type: Array,
      required: false
    }
  },
  computed: {
    slideData() {
      let data = [];
      this.slider.slides.forEach(slide => data.push(slide));
      this.slider.slides.forEach(slide => data.push(slide));
      this.slider.slides.forEach(slide => data.push(slide));
      return data;
    }
  },
  watch: {
      listArr:function(arr){
          this.slider.slides = arr
      }
  },
  mounted() {
    if (this.listArr) {
      this.slider.slides = this.listArr;
    }
  },
  methods: {
    slidePosition(index, slide) {
      let counter = this.slider.counter;
      if (index == counter) {
        return "slide-center";
      }
      let right = counter + 1;
      if (right > this.slideData.length - 1) {
        right = 0;
      }
      if (index == right) {
        return "slide-right";
      }
      let left = counter - 1;
      if (left < 0) {
        left = this.slideData.length - 1;
      }
      if (index == left) {
        return "slide-left";
      }
      let rightOut = counter + 2;
      if (rightOut == this.slideData.length) {
        rightOut = 0;
      }
      if (rightOut == this.slideData.length + 1) {
        rightOut = 1;
      }
      if (index == rightOut) {
        return "slide-right-out";
      }
      let leftOut = counter - 2;
      if (leftOut == -1) {
        leftOut = this.slideData.length - 1;
      }
      if (leftOut == -2) {
        leftOut = this.slideData.length - 2;
      }
      if (index == leftOut) {
        return "slide-left-out";
      }
    },
    nextSlide() {
      if (this.slider.counter == this.slideData.length - 1) {
        this.slider.counter = 0;
      } else {
        this.slider.counter++;
      }
      this.$emit('currentChange',this.slideData[this.slider.counter])
    },
    previousSlide() {
      if (this.slider.counter == 0) {
        this.slider.counter = this.slideData.length - 1;
      } else {
        this.slider.counter--;
      }
    }
  }
};
</script>


<style scoped>
.slider {
  overflow: hidden;
}

img {
  width: 100%;
  height: auto;
}

ul {
  position: relative;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32vw;
  width: 100%;
}
ul li {
  position: absolute;
  height: 26.6667vw;
  width: 26.6667vw;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 400ms ease-in-out;
  opacity: 0;

  overflow: hidden;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 4px;
  background: #fff;
}

ul .slide-left {
  transform: translate(50%,-5%) scale(1.2);
  opacity: 0;
  z-index: 5;
}

ul .slide-center {
  transform: translate(5%,-5%) scale(1);
  opacity: 1;
  z-index: 4;
}

ul .slide-right {
  transform: translate(0%) scale(1);
  opacity: 1;
  background: #f5f5f5;
  z-index: 3;
}

ul .slide-right-out {
  transform: translate(-5%,5%) scale(1);
  opacity: 1;
  z-index: 2;
  background: #f0f0f0;
}

ul .slide-left-out {
  transform: translate(-10%,10%) scale(1);
  opacity: 0;
}
</style>