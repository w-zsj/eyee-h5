<template>
    <div class="model">
        <!-- 弹框 -->
        <div class="bg" @click.stop="close(1)"></div>
        <transition name="cutGoing">
        <div class="cutinfo"  :class="modelBgClassBG">
            <div class="cut_name">
                <div>
                    <p v-html="cutText"></p>
                </div>
            </div>
            <div class="cut_btn" v-if="showBtn==2">
                <span @click.stop="close(1)">取消</span>
                <span @click.stop="close(2)">继续助力</span>
            </div>
            <div class="cut_btn goto" v-if="showBtn==1">
                <span @click.stop="close(3)">去看看</span>
            </div>
            <div class="cut_btn goto" v-if="showBtn==4">
                <span @click.stop="close(4)">我也想要</span>
            </div>
            <div class=" cutfailBtn" v-if="showBtn==5">
                <span @click.stop="close(5)" style="width:100%">重新助力</span>
                <span @click.stop="close(3)" style="width:100%">去看看其他商品</span>
            </div>
            <div class="cut_btn goto" v-if="showBtn==6">
                <span @click.stop="close(6)">去支付</span>
            </div>

            <div class="close" v-if="showBtn==7" @click.stop="close(1)">
               X
            </div>
            <div class="cut_btn goto" v-if="showBtn==8">
                <span @click.stop="close(8)">那好吧</span>
            </div>
        </div>
        </transition>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    modelBgClassBG: String, //cutagain重新助力 gotopay 去支付 cutgoing进行中  cutOver活动结束 cutLater来晚了 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
    showBtn: Number,
    cutText: String
  },
  mounted(){
    //   alert(this.showBtn)
  },
  methods: {
    close(type) {
      this.$emit("close", type);
    }
  }
};
</script>
<style  scoped>
.cutGoing-enter-active,
.cutGoing-leave-active {
  transition: opacity 0.3s;
}
.cutGoing-enter,
.cutGoing-leave-to {
  opacity: 0;
}
.bg {
  background: rgba(0, 0, 0, 0.5);
  z-index: 105;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.cutinfo {
  width: 275px;
  padding-bottom: 20px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("/static/img/cutgoing.png") 0 0 no-repeat #fff;
  background-size: 100% 100%;
  text-align: center;
  font-size: 14px;
  color: #333;
  border-radius: 10px;
  z-index: 106;
  line-height: 25px;
}
.cutinfo.guize{
  text-align: left;
  font-size: 12px;
  padding: 0 10px 20px 10px;
}
.cutinfo.guize .cut_name{
  margin-top: 70px;
      text-indent: -1em;
    padding: 0 12px;
    padding-right: 0;
}
.guize .close{
  position: absolute;
  width: 40px;
  height: 40px;
  border: 1px solid #fff;
  border-radius: 50%;
  color: #fff;
  bottom: -60px;
  left: 50%;
  margin-left: -20px;
  text-align: center;
  line-height: 40px;
  font-size: 24px;
}
/* cutgoing 进行中  cutOver活动结束 cutLater来晚了 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人 */
.cutinfo.cutGoing {
  background: url("/static/img/cutgoing.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutOver {
  background: url("/static/img/cutOver.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutLater {
  background: url("/static/img/cutLater.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutFail {
  background: url("/static/img/cutFail.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutorderPass {
  background: url("/static/img/cutorderPass.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutSuccess {
  background: url("/static/img/cutSuccess.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutNewpeople {
  background: url("/static/img/cutNewpeople.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.gotopay {
  background: url("/static/img/gotopay.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.cutbg {
  background: url("/static/img/cutbg.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo.guize {
  background: url("/static/img/guize.png") 0 0 no-repeat #fff;
  background-size: 100% auto;
}
.cutinfo .cut_name {
  margin-top: 160px;
}

.cutinfo .cut_btn {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.cutinfo .cut_btn span {
  width: 46%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #ffc700;
  background: #ffc700;
  border-radius: 5px;
  color: #333;
}
.cutinfo .cut_name {
  margin-top: 160px;
}
.cutinfo .cut_btn {
  padding: 0 20px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 15px;
}
.cutfailBtn{
  padding: 0 10px;
}
.cutfailBtn span{
  width: 100%;
  display: block;
  background: #ffc700;
  border-radius: 5px;
  color: #333;
  margin: 10px 0;
  line-height: 34px;
}
.cutinfo .cut_btn span:nth-child(1) {
  color: #999;
  background: none;
  border: 1px solid #ccc;
}
.cutinfo .cut_btn.goto span {
  width: 100%;
  background: #ffc700;
  color: #333;
  border: 1px solid #ffc700;
}

.no_cut {
  position: relative;
  width: 80%;
  height: 0;
  left: 10%;
  text-align: center;
  padding-top: 80%;
  /* background: url("/static/img/cutdefaultbg.png") 0 0 no-repeat; */
  background-size: 100% 100%;
}
.no_cut span {
  position: absolute;
  bottom: -30px;
  left: 10px;
}
</style>


