<template>
    <div>
         <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>商家入驻</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="pagebg">
          <img src="/static/img/shopbg.png" alt="">
          <div class="next" @click.stop="next">
            <span class="" @click.stop="merchantsdeal"><em :class="{'selected':iconselected}" @click.stop="iconClassSelected"></em> 同意《商家协议》</span>
          </div>
          <span @click="applynext()" class="protocol" :class="{'spanBg':!iconselected}">申请入驻</span>
        </div>
        <div class="enter-message">
           <span class="advantage">商家入驻优势</span>
           <!-- <span class="subheading">斗牛官方交易申明</span> -->
           <div class="enter-content">
             <!-- <p><span>1.</span>可以同时出售多双球鞋</p> -->
             <p><span>1.</span>可以同时出售多个商品</p>
             <p><span>2.</span>球鞋商品可享受<em>0佣金</em>优惠</p>
             <p><span>3.</span>不必每次缴纳保证金</p>
           </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      iconselected: true // radio 选中
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {},
  methods: {
    applynext() {
      // this.$router.push("/autheninfo");
      if (this.iconselected) {
        this.$router.push("/shoppay");
      } else {
        this.toast("请阅读协议");
      }
    },
    iconClassSelected() {
      this.iconselected = !this.iconselected;
    },
    merchantsdeal() {
      // this.toast("查看协议 去富文本");
      this.$router.push({
        path: "buyerSellKnow",
        query: {
          type: 3
        }
      });
    }
  }
};
</script>
<style scoped>
.pagebg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: -1;
}
.pagebg img {
  width: 100%;
  height: 100%;
}
.pagebg span.protocol {
  outline-style: none;
  position: absolute;
  z-index: 2;
  bottom: 4.6vh;
  left: 50%;
  transform: translateX(-50%);
  width: 78vw;
  height: 40px;
  color: #333;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  background: url("/static/img/shopbtnbg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  font-size: 20px;
  /* shopbtnbg */
}
.pagebg span.spanBg {
  background: url("/static/img/shopbtnbggrey.png") 0 0 no-repeat;
  background-size: 100% 100%;
  color: #999999;
}
.enter-message {
  color: #fff;
  margin-top: 62vh;
  margin-left: 30px;
  font-size: 18px;
  line-height: 28px;
}
.advantage {
  border-bottom: 1px solid #979797;
  padding-bottom: 3px;
}
.subheading {
  font-size: 14px;
  border-bottom: 1px solid #979797;
  padding-bottom: 3px;

  /* width: 40vw; */
}
.enter-content {
  font-size: 12px;
  color: #d0d0d0;
  line-height: 20px;
  margin-top: 15px;
}
.enter-content span {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  font-family: "PingFang";
}
.enter-content em {
  color: #f6d44a;
  padding: 0 2px;
  font-weight: bold;
  font-family: "PingFang";
}
.next {
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  text-align: center;
  bottom: 20vw;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}
.next span {
  position: relative;
}
.next span em {
  width: 20px;
  height: 20px;
  background: url("/static/img/d_apply_choose1.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  border-radius: 50%;
  left: -25px;
  top: 0px;
}
.next span em.selected {
  background: url("/static/img/d_apply_choose2.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.next.nextbg {
  background: #333;
}
</style>

