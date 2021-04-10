<template>
    <div>
        <div class="broadcast" v-if="messageInfo.length>0">
          <!-- :style="cssTop" id="broadcastUl" -->
            <ul class="broadcast-ul"  ref="broadcastUl"  :class="{anim:animate==true}">
                <li v-for="(item,index) in messageInfo" :key='index' ref="broadcastli" class="ellipsis">
                  <div class="headerUrl" v-if="item.imageurl">
                    <img src="https://files.eyee.com/EYEE/icons/cut-banner-gs.png" alt="" v-if="insq">
                    <img v-else :src="item.imageurl" alt="" >
                  </div>
                  {{item.message}}
                </li>
            </ul>
        </div>
        <div class="banner" v-if="bannertype">
            <img :src="imageurllist" alt="">
        </div>
    </div>
     
</template>
<script>
import { Gadio } from "../../common/api/bargain";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      animate: false,
      imageurllist: "",
      clearTime: null,
      GadioMessege: []
    };
  },

  props: {
    bannertype: { type: Boolean, default: false }
  },
  mounted() {
    this.guangbo();
    this.infoScroll();
  },
  computed: {
    ...mapGetters({
      insq: "insq"
    }),
    messageInfo() {
      return this.GadioMessege;
    }
  },
  methods: {
    guangbo() {
      // 广播
      Gadio({}).then(res => {
        if (res && res.messagelist) {
          this.GadioMessege = res.messagelist;
          this.imageurllist = res.banner;
        }
      });
    },
    infoScroll() {
      this.scroll();
      setTimeout(() => {
        this.infoScroll();
      }, 3000);
    },
    scroll() {
      this.animate = true;
      setTimeout(() => {
        this.messageInfo.push(this.messageInfo[0]);
        this.messageInfo.shift();
        this.animate = false;
      }, 500);
    }
  }
};
</script>
<style>
/* .in-out-translate-fade */
body {
  padding-bottom: 0 !important;
}
.fix-btm {
  position: sticky;
  left: 0;
  bottom: -1px;
  width: 100%;
  background: #fff;
}
.broadcast {
  height: 24px;
  position: relative;
  overflow: hidden;
  background: #ffeba5;
}
.headerUrl {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  /* margin-left: 10px; */
  /* background: red; */
  border-radius: 50%;
  display: inline-block;
  overflow: hidden;
  vertical-align: text-bottom;
}
.broadcast ul {
  height: 24px;
  font-size: 14px;
  color: #333;
  position: absolute;
  left: 0;
  top: 0;
  /* opacity: 1; */
  /* transition: all 0.5s; */
  /* overflow: hidden; */
}
.anim {
  transition: all 0.5s;
  margin-top: -28px;
}
.broadcast ul li {
  height: 24px;
  line-height: 24px;
  padding-left: 10px;
}
.broadcast ul.anim li{
  height: 28px;
  line-height: 28px;
}
.banner {
  width: 100%;
  /* height: 220px; */
  overflow: hidden;
  margin-bottom: 15px;
}
.banner img {
  width: 100%;
  height: 100%;
}
</style>


