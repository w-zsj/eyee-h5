<template>
    <div class="main">
        <div>
            <div class="information">
                <h4>商品信息</h4>
                <div class="line">
            </div>
            <div class="message-box">
                <div class="message-img">
                    <img :src="orderDetailData.orderpic" alt="">
                </div>
                <div class="trade-name">
                    <p>{{orderDetailData.name}}</p>
                    <div class="trade-detail">
                        <p>{{orderDetailData.color}}</p>
                        <p>品牌：{{orderDetailData.brandname}}</p>
                        <p>货号：{{orderDetailData.goodsno}}</p>
                    </div>
                </div>
            </div>
            <div class="line line-two"></div>
            <div class="price">
                <p>买家拍下价：<span>￥{{orderDetailData.price}}</span></p>
            </div>
            <div class="line"></div>
            <div class="go-buy">
                <div class="go-buyleft">
                    <div class="logo-img">
                        <img src="/static/img/source/logo@2x.png" alt="">
                    </div>
                    <div><p class="go-buyleftp">斗牛球鞋</p></div>
                </div>
                <div class="go-buyright">
                    <div class="gobuy-font" @click="goProductDetail(orderDetailData.productid)"><p>去购买</p></div>
                    <div class="gobuy-img">
                        <img src="/static/img/source/buy_btn@2x.png" alt="">
                    </div>
                </div>
            </div>
    </div>

    <div class="detail">
        
        <div class="more-title">
            <p>溯源详情</p>
        </div>

        <div class="line"></div>
        <div class="detail-num">
            <p>溯源码已被{{checkuserTotal}}位用户验证</p>
        </div>
        <div class="small-tips">
            <p>溯源码在交易的整个链路中可被多个用户验证,实现对每个买家交易信息的跟踪~</p>
        </div>   
    </div>
        </div>
    <div  v-for="(item,index) in checkuserList"  :key="index" >
          <div hidden :class="{'':friends}"></div>
        <div class="usersbox" :class="{ 'border-b':item.friends,'border-none':!item.friends }">
            <div class="user-time">
            <p>验证用户：{{item.phonenumber}}</p>
            <p class="tracetime">{{item.checkingtime}}</p>
            </div>           
            <img  @click="tabopen(item)" class="source-open" :src="item.tabOpen?'../../../static/img/source/source_details_close@2x.png':'/static/img/source/source_details_open@2x.png'" alt="">      
        </div>
        <transition name="draw">
                <div class="box" v-show="item.boxshow">
                    <img class="linkimg1" src="/static/img/source/link@2x.png" alt="">
                    <img class="linkimg2" src="/static/img/source/link@2x.png" alt="">
                    <div class="box1 box1-top">
                        <p>交易信息</p>
                        <div class="box1-right">
                            <p v-if="flag"  style="width:40%;" class="ellipsis">{{item.customername}}</p>
                            <img @click="togglebox2()" :src="boxshowtwo?'../../../static/img/source/source_details_up@2x.png':'../../../static/img/source/source_details_down@2x.png'" alt="">
                        </div>                      
                    </div>
                    <transition name="drawtwo">  
                            <div class="box2" v-show="boxshowtwo">
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>买家信息</p>
                                    <div class="inter1-right">
                                        <p style="padding-right:5px">{{item.customername}}</p>
                                        <p>{{item.customernumber}}</p>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>支付方式</p>
                                    <div class="inter1-right">
                                        <p>{{item.paytype}}</p>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>支付金额</p>
                                    <div class="inter1-right">
                                        <p class="paymoney">￥{{item.price}}</p>
                                    </div>
                                </div>
                            </div>
                    </transition> 
                    
                </div>
            </transition>
            <transition name="draw"> 
                <div class="box" v-show="item.boxshow">
                    <img class="linkimg1" src="/static/img/source/link@2x.png" alt="">
                    <img class="linkimg2" src="/static/img/source/link@2x.png" alt="">
                    <div class="box1">
                        <p>鉴定详情</p>
                        <div class="box1-right boxa-right">
                            <p v-if="flag" style="width:40%;" class="ellipsis">{{item.checkresult}}</p>
                            <img @click="togglebox3()" :src="boxshowthree?'../../../static/img/source/source_details_up@2x.png':'../../../static/img/source/source_details_down@2x.png'" alt="">
                        </div>
                    </div>
                    <transition name="drawthree">
                            <div class="box2" v-show="boxshowthree">
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>鉴定结果</p>
                                    <div class="inter1-right">
                                        <p>{{item.checkresult}}</p>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="inter2">
                                    <p>鉴定图片</p>
                                    <div class="trace">
                                        <div v-for="(imgs,imgIndex) in item.picture"  :key="imgIndex+'-lable'" class="traceimg">
                                            <img :src="imgs">
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <div class="inter2">
                                    <p>结果备注：</p>
                                    <p class="resulttit">{{item.resultremark}}</p>
                                </div>
                            </div>
                    </transition> 
                </div>
            </transition>
            <transition name="draw"> 
                <div class="box" v-show="item.boxshow">
                    <img class="linkimg1" src="/static/img/source/link@2x.png" alt="">
                    <img class="linkimg2" src="/static/img/source/link@2x.png" alt="">
                    <div class="box1">
                        <p>订单跟踪</p>
                        <div class="boxb-right">
                            <p v-if="flag"  style="width:40%;" class="ellipsis">{{item.orderstatus}}</p>
                            <img @click="togglebox4(item)" :src="boxshowfour?'../../../static/img/source/source_details_up@2x.png':'../../../static/img/source/source_details_down@2x.png'" alt="">
                        </div>
                    </div>
                    <transition name="drawfour">  
                            <div class="box2" v-show="boxshowfour">
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>订单编号：</p>
                                    <p class="order">{{item.orderno}}</p>
                                    <div class="inter1-right color">
                                        <p>{{item.orderstatus}}</p>
                                    </div>
                                </div>
                               
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>买家地址：</p>
                                </div>
                                <div class="location">
                                    <img class="locationimg" src="/static/img/source/location@2x.png" alt="">
                                    <div class="userloc">
                                        <p>收货人：{{item.receiver}}</p>
                                        <p>{{item.customeraddress}}</p>
                                    </div>
                                    <div class="userlocphone">
                                        <p>{{item.number}}</p>
                                    </div>
                                </div>
                                 <div class="line"></div>
                                <div class="inter1">
                                    <p>物流跟踪：</p>
                                </div>
                                <div class="follow">
                                        <div class="point" :class="{ 'point-b':item.bgcolor1 === false,'point-none':item.bgcolor1 === true }"></div>
                                        <div class="s-line" :class="{ 'point-b':item.bgcolor2 === false,'point-none':item.bgcolor2 === true }"></div>
                                        <div class="point" :class="{ 'point-b':item.bgcolor2 === false,'point-none':item.bgcolor2 === true }"></div>
                                        <div class="s-line" :class="{ 'point-b':item.bgcolor3 === false,'point-none':item.bgcolor3 === true }"></div>
                                        <div class="point" :class="{ 'point-b':item.bgcolor3 === false,'point-none':item.bgcolor3 === true }"></div>
                                        <div class="s-line" :class="{ 'point-b':item.bgcolor4 === false,'point-none':item.bgcolor4 === true }"></div>
                                        <div class="point" :class="{ 'point-b':item.bgcolor4 === false,'point-none':item.bgcolor4 === true }"></div>
                                </div>
                                <div class="follow">
                                        <p  :class="{ 'font-b':item.color1 === false,'font-none':item.color1 === true }">商家发货</p>
                                        <p  :class="{ 'font-b':item.color2 === false,'font-none':item.color2 === true }">平台鉴定</p>
                                        <p  :class="{ 'font-b':item.color3 === false,'font-none':item.color3 === true }">平台发货</p>
                                        <p  :class="{ 'font-b':item.color4 === false,'font-none':item.color4 === true }">交易完成</p>
                                </div>
                                <div class="line"></div>
                                <div class="inter1">
                                    <p>物流详情：</p>
                                </div>
                                <div class="rode" v-for="(log,cindex) in item.logistics1.slice(0,4)" :key="cindex+'-labl'" v-show="logshow">
                                    <div class="rodedetail">
                                        <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics1.length-item.logistics1.length+3 != cindex" class="vertical-line"></div>
                                    </div>
                                    <div class="rodeitem">
                                        <p>{{log.title}}</p>
                                        <p class="timers">{{log.createdat}}</p>
                                    </div>
                                </div>

                                <div class="logisticsclick" @click="detailshow(item)" v-show="btnshow">
                                    <p v-show="logshow">{{item.logistics1.length-4}}条物流信息</p>
                                    <p v-show="logdetailshow">收起</p>
                                    <img :src="logdetailshow?'../../../static/img/source/logistics_icon_packup_default@2x.png':'../../../static/img/source/logistics_icon_more_default@2x.png'" alt="">
                                </div>

                                

                                <div class="rode" v-for="(log,cindex) in item.logistics1" :key="cindex+'-lab'" v-show="logdetailshow">
                                    <div class="rodedetail">
                                        <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics1.length-1 != cindex" class="vertical-line"></div>
                                    </div>
                                    <div class="rodeitem">
                                        <p>{{log.title}}</p>
                                        <p class="timers">{{log.createdat}}</p>
                                    </div>
                                </div>
                                <div class="rode  rodecenter" v-for="(log,aindex) in item.logistics2.slice(0,4)" :key="aindex+'-la'" v-show="logshow2">
                                    <div class="rodedetail  rodedetailcenter">
                                        <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics2.length-item.logistics2.length+3 != aindex" class="vertical-line vertical-linecen"></div>
                                    </div>
                                    <div class="rodeitem">
                                        <p>{{log.title}}</p>
                                        <p class="checkadd">{{log.comments}}</p>
                                        <img class="checkpicture" :src="log.checkpicture" alt="">
                                        <p class="timers">{{log.updatedat}}</p>
                                    </div>
                                </div>


                                 <div class="logisticsclick2" @click="detailshow2(item)" v-show="btnshow2">
                                    <p v-show="logshow2">{{item.logistics2.length-4}}条物流信息</p>
                                    <p v-show="logdetailshow2">收起</p>
                                    <img :src="logdetailshow2?'../../../static/img/source/logistics_icon_packup_default@2x.png':'../../../static/img/source/logistics_icon_more_default@2x.png'" alt="">
                                </div>

                                <div class="rode  rodecenter" v-for="(log,aindex) in item.logistics2" :key="aindex+'-l'" v-show="logdetailshow2">
                                    <div class="rodedetail  rodedetailcenter">
                                        <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics2.length-1 != aindex" class="vertical-line vertical-linecen"></div>
                                    </div>
                                    <div class="rodeitem">
                                        <p>{{log.title}}</p>
                                        <p class="checkadd">{{log.comments}}</p>
                                        <img class="checkpicture" :src="log.checkpicture" alt="">
                                        <p class="timers">{{log.updatedat}}</p>
                                    </div>
                                </div>

                                <div class="rode" v-for="(log,sindex) in item.logistics3.slice(0,4)" :key="sindex+'-lable1'" v-show="logshow1">
                                    <div class="rodedetail">
                                        <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics3.length-item.logistics3.length+3 != sindex" class="vertical-line"></div>
                                    </div>
                                    <div class="rodeitem">
                                        <p>{{log.title}}</p>
                                        <p class="timers">{{log.createdat}}</p>
                                    </div>
                                </div>
                                <div class="logisticsclick1" @click="detailshow1(item)" v-show="btnshow1">
                                    <p v-show="logshow1">{{item.logistics3.length-4}}条物流信息</p>
                                    <p v-show="logdetailshow1">收起</p>
                                    <img :src="logdetailshow1?'../../../static/img/source/logistics_icon_packup_default@2x.png':'../../../static/img/source/logistics_icon_more_default@2x.png'" alt="">
                                </div>
                                    <div class="rode" v-for="(log,sindex) in item.logistics3" :key="sindex+'-lable2'" v-show="logdetailshow1 ">
                                        <div class="rodedetail">
                                            <img src="/static/img/source/location_tracking@2x.png" alt="">
                                        <div v-show="item.logistics3.length-1 != sindex" class="vertical-line"></div>
                                    </div>
                                    <div class="rodeitem">
                                            <p>{{log.title}}</p>
                                            <p class="timers">{{log.createdat}}</p>
                                    </div>
                                </div>
                            </div>
                    </transition> 
                </div>
            </transition>
    </div>
    
    
            
    </div>
</template>
<script>
import { getOrderDetail } from "./../../common/api/traceability";

const DOMAIN = process.env.NODE_ENV !== 'production' ? window.location.origin : 'https://m.eyee.com'

export default {
  data() {
    return {
      boxshowtwo: false,
      boxshowthree: false,
      boxshowfour: false,
      logshow: true,
      logshow1: true,
      logshow2: true,
      logdetailshow: false,
      logdetailshow1: false,
      logdetailshow2: false,
      btnshow:true,
      btnshow1:true,
      btnshow2:true,
      orderDetailData: [],
      checkuserList: [],
      checkuserTotal: 0,
      userboxCheck: false,
      tabOpen: true,
      friends: true,
      flag: true,
      
    };
  },
  created() {
    let id = this.$route.params.id;
    this.getOrderDetail(id)
  },
  methods: {
    tabopen(item) {
      item.tabOpen = !item.tabOpen;
      item.boxshow = !item.boxshow;
      item.friends = !item.friends;
      this.friends = !this.friends;
    },
    goProductDetail(productid) {
      // this.$router.push({ path: `/productDetail/${productid}` })
      // console.log(productid)
      window.location.href = `${DOMAIN}/sneaker/detail/${productid}`
    },
    getOrderDetail(uniqueid) {
      var _ = this;
      getOrderDetail({ uniqueid: uniqueid })
        .then(res => {
          if (res) {

            _.orderDetailData = res;
            _.checkuserList = res.checkuser.map(item => {
               item["tabOpen"] = false;
               item["boxshow"] = false;
               item["friends"] = true;
               item["bgcolor1"] = false;
               item["bgcolor2"] = false;
               item["bgcolor3"] = false;
               item["bgcolor4"] = false;
               item["color1"] = false;
               item["color2"] = false;
               item["color3"] = false;
               item["color4"] = false;
              return item
            });
            _.checkuserTotal = res.checkuser.length;
            console.log(res.checkuser.length);
          }
        })
        .catch(err => {
          this.toast("加载失败");
        });
    },
    togglebox2() {
      this.boxshowtwo = !this.boxshowtwo;
    },
    togglebox3() {
      this.boxshowthree = !this.boxshowthree;
    },
    togglebox4(item) {
      this.boxshowfour = !this.boxshowfour;
      if (item.logistics === "0") {
        item.bgcolor1 = false;
        item.bgcolor2 = false;
        item.bgcolor3 = false;
        item.bgcolor4 = false;
        item.color1 = false;
        item.color2 = false;
        item.color3 = false;
        item.color4 = false;
      } else if (item.logistics === "1") {
        item.bgcolor1 = true;
        item.bgcolor2 = false;
        item.bgcolor3 = false;
        item.bgcolor4 = false;
        item.color1 = true;
        item.color2 = false;
        item.color3 = false;
        item.color4 = false;
      } else if (item.logistics === "2") {
        item.bgcolor1 = true;
        item.bgcolor2 = true;
        item.bgcolor3 = false;
        item.bgcolor4 = false;
        item.color1 = true;
        item.color2 = true;
        item.color3 = false;
        item.color4 = false;
      } else if (item.logistics == "3") {
        item.bgcolor1 = true;
        item.bgcolor2 = true;
        item.bgcolor3 = true;
        item.bgcolor4 = false;
        item.color1 = true;
        item.color2 = true;
        item.color3 = true;
        item.color4 = false;
      }else if (item.logistics == "4") {
        item.bgcolor1 = true;
        item.bgcolor2 = true;
        item.bgcolor3 = true;
        item.bgcolor4 = true;
        item.color1 = true;
        item.color2 = true;
        item.color3 = true;
        item.color4 = true;
      };
      if(item.logistics1.length<=4){
        this.logshow = false;
        this.logdetailshow = true;
        this.btnshow = false;
      }else{
        this.btnshow = true;
      };
      if(item.logistics2.length<=4){
        this.logshow2 = false;
        this.logdetailshow2 = true;
        this.btnshow2 = false;
      }else{
        this.btnshow2 = true;
      };
      if(item.logistics3.length<=4){
        this.logshow1 = false;
        this.logdetailshow1 = true;
        this.btnshow1 = false;
      }else{
        this.btnshow1 = true;
      }
    },
    detailshow(item) {
      console.log(this.logdetailshow);
        this.logshow = !this.logshow;
        this.logdetailshow = !this.logdetailshow;
      
    },
    detailshow1(item) {
        this.logshow1 = !this.logshow1;
        this.logdetailshow1 = !this.logdetailshow1; 
    },
    detailshow2(item) {
        this.logshow2 = !this.logshow2;
        this.logdetailshow2 = !this.logdetailshow2; 
    }
  }
};
</script>
<style>
p {
  font-weight: 600;
}
.main {
  width: 100%;
  background-color: #f5f5f5;
}

.information {
  position: relative;
  top: 0.8rem;
  left: 1%;
  width: 98%;
  background-color: white;
  border: 0px;
  border-radius: 5px;
}
.information h4 {
  font-size: 0.95rem;
  width: 80%;
  padding: 10pt 0 10pt 20pt;
}
.line {
  position: relative;
  left: 2%;
  width: 96%;
  height: 1px;
  background-color: #cccccc;
}
.line-two {
  position: relative;
  top: 1rem;
}
.message-box {
  display: flex;
  position: relative;
  top: 0.5em;
  left: 0.5em;
  justify-content: space-around;
}
.message-img {
  width: 8rem;
}
.message-img img {
  margin: 1em 0 1em 0em;
}
.trade-name {
  width: 80%;
}
.trade-name p {
  padding: 0 0.2em 0 0.5em;
  font-size: 0.85rem;
  line-height: 17pt;
  color: #333333;
}
.trade-detail {
  margin: 0.8em 0 0 0;
}
.trade-detail p {
  font-size: 0.85rem;
  line-height: 14pt;
}
.price {
  text-align: right;
  padding: 15pt 10pt 6pt 20pt;
}
.price p {
  font-size: 0.85rem;
}
.go-buy {
  display: flex;
  padding: 0.5em 0.5em 0.5em 1em;
}
.go-buyleft {
  display: flex;
}
.go-buyleftp {
  font-size: 1.2rem;
  margin-left: 0.5rem;
  margin-top: -0.25rem;
}
.logo-img {
  width: 15%;
}
.go-buyright {
  display: flex;
  position: absolute;
  right: 0.5rem;
}

.gobuy-font {
  color: #666666;
  font-weight: 100;
  font-size: 1rem;
  margin-left: 0.5rem;
  margin-top: -0.1rem;
}
.gobuy-img {
  width: 15%;
  margin-left: 1%;
}
.detail {
  position: relative;
  left: 1%;
  top: 1.3em;
  border: 0px;
  border-radius: 5px;
  width: 98%;
  background-color: #fff;
  padding: 0 0 1rem 0;
}
.usersbox {
  position: relative;
  margin-top: -1rem;
}
.border-b {
  background-image: url("/static/img/source/source_details_close_second@2x.png");
  background-size: 100% 100%;
}
.border-none {
  background-image: url("/static/img/source/source_details_open_second@2x.png");
  background-size: 100% 100%;
}
.detail-two {
  margin-top: -1.5rem;
}
.more-title {
  width:80%;
  padding: 12pt 0 7pt 20pt;
  font-size: 0.95rem;
}
.detail-num {
  margin-top: 1rem;
  text-align: center;
  color: #ffc700;
  font-size: 1.2rem;
  font-weight: 100;
  font-family: PingFangSC;
}
.small-tips {
  margin-top: 1.5rem;
  padding: 0 0.8rem 0 0.8rem;
  color: #999999;
  font-size: 0.1rem;
  text-align: center;
}

.user-time {
  display: flex;
  margin-top: 1.5rem;
  padding: 1rem 0.8rem 1rem 1rem;
}
.user-timetwo {
  padding: 2rem 0.8rem 1rem 1rem;
}
.user-time p {
  font-size: 0.8rem;
}
.tracetime {
  margin-left: 20%;
  margin-top: 0.15rem;
}
.source-open {
  width: 8%;
  position: relative;
  left: 46%;
  top: -0.5rem;
}
.box {
  width: 98%;
  background-color: white;
  position: relative;
  top: -0.5rem;
  left: 1%;
  border-radius: 4pt;
}
.draw-enter-active,
.draw-leave-active {
  transition: all 0s ease;
}
.draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
.drawtwo-enter-active,
.drawtwo-leave-active {
  transition: all 0s ease;
}
.drawtwo-enter, .drawtwo-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
.drawthree-enter-active,
.drawthree-leave-active {
  transition: all 0s ease;
}
.drawthree-enter, .drawthree-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
.drawfour-enter-active,
.drawfour-leave-active {
  transition: all 0s ease;
}
.drawfour-enter, .drawfour-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
.box1 {
  display: flex;
  margin: 0.8rem 0 1rem 0;
  padding: 1.4rem 0 1rem 1rem;
}

.box1-top {
  margin: 1.1rem 0 0 0;
}
.box1-right {
  flex: 1;
  display: flex;
  position: relative;
  right: 5%;
}
.boxa-right {
  position: relative;
  right: 5%;
}
.box1-right p {
  margin-left: 60%;
}

.box1-right img {
  width: 8%;
  height: 48%;
  margin: 0.5rem 0 0 1.5rem;
}
.boxb-right {
  flex: 1;
  display: flex;
  position: relative;
  right: 5%;
  color: red;
}
.boxb-right p {
  margin-left: 60%;
}

.boxb-right img {
  width: 8%;
  height: 48%;
  margin: 0.5rem 0 0 1.5rem;
}
.box2 {
  width: 100%;
}
.inter1 {
  display: flex;
  margin: 1rem;
}
.inter1 p {
  flex: 1;
  font-size: 0.9rem;
}
.order {
  position: relative;
}
.inter1-right {
  flex: 1;
  display: flex;
  text-align: right;
}
.color {
  color: red;
}

.inter1-right .paymoney {
  padding-bottom: 1rem;
}
.inter2 {
  width: 98%;
  position: relative;
  left: 1%;
  padding: 1rem 0 1rem 0.8rem;
}
.inter2 p {
  padding: 0rem 0 1rem 0rem;
  font-size: 0.9rem;
  color: #333333;
}

.trace {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  left: 3%;
  width: 94%;
  justify-content: space-around;
}
.traceimg {
  width: 100%;
  width: 60pt;
  height: 60pt;
  margin-bottom: 1rem;
}
.traceimg img {
  border: 1px dotted #333333;
  width: 100%;
  height: 100%;
}
.resulttit {
  text-indent: 25px;
  font-size: 0.8rem;
}

.location {
  display: flex;
  padding: 1rem;
}
.location img {
  width: 5%;
  height: 5%;
}
.userloc {
  position: relative;
  left: 1.8rem;
  bottom: 0.5rem;
}
.userloc p {
  margin: 0 0 0.5rem 0;
}
.userlocphone {
  flex: 1;
  text-align: right;
  margin-top: -1rem;
}
.follow {
  display: flex;
  position: relative;
  width:90%;
  left: 10%;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.point {
  width: 3.5%;
  height: 12px;
  border-radius: 50%;
}
.point-b {
  background-color: #cccccc;
}
.point-none {
  background-color: #ffc700;
}
.s-line {
  width: 20%;
  height: 2px;
  margin: 0.35rem 0.5rem;
}

.follow p {
  flex: 1;
  position: relative;
  left: -2%;
}
.font-b {
  color: #333333;
}
.font-none {
  color: #ffc700;
}
.rode {
  position: relative;
  top: 1rem;
}
.rodecenter {
  height: 10rem;
}
.rodedetail {
  margin-top: -1rem;
  padding: 0 0 0 1rem;
  height: 7rem;
}
.rodedetailcenter {
  height: 10rem;
}
.rodedetail img {
  width: 4%;
  position: relative;
  top: 0.5rem;
  right: 0%;
}
.vertical-line {
  width: 0.7%;
  height: 90%;
  background-color: #cccccc;
  position: relative;
  left: 1.7%;
}
.rodeitem {
  color: #999999;
  position: absolute;
  left: 14%;
  top: 0.4rem;
}
.rodeitem p {
  font-size: 1rem;
}

.logisticsclick {
  display: flex;
  background-color: #999999;
  padding: 0.3rem 0 0.3rem 0.5rem;
  border-radius: 13pt;
  position: absolute;
  right: 5%;
  top: 38rem;
  z-index: 100;
}
.logisticsclick p {
  font-size: 0.9rem;
  font-weight: 100;
  color: #fff;
}
.logisticsclick img {
  width: 15%;
  height: 15%;
  position: relative;
  top: 0.1rem;
  left: 0.5rem;
}
.logisticsclick1 {
  display: flex;
  background-color: #999999;
  padding: 0.3rem 0 0.3rem 0.5rem;
  border-radius: 13pt;
  position: absolute;
  right: 5%;
  bottom: 14rem;
  z-index: 100;
}
.logisticsclick1 p {
  font-size: 0.9rem;
  font-weight: 100;
  color: #fff;
}
.logisticsclick1 img {
  width: 15%;
  height: 15%;
  position: relative;
  top: 0.1rem;
  left: 0.5rem;
}
.logisticsclick2 {
  display: flex;
  background-color: #999999;
  padding: 0.3rem 0 0.3rem 0.5rem;
  border-radius: 13pt;
  position: absolute;
  right: 5%;
  bottom: 53rem;
  z-index: 100;
}
.logisticsclick2 p {
  font-size: 0.9rem;
  font-weight: 100;
  color: #fff;
}
.logisticsclick2 img {
  width: 15%;
  height: 15%;
  position: relative;
  top: 0.1rem;
  left: 0.5rem;
}
.checkpicture {
  width: 20%;
}

.timers {
  font-size: 0.6rem;
  margin-top: 0.5rem;
}

.linkimg1 {
  position: absolute;
  width: 4%;
  left: 8%;
  margin-top: -8%;
}
.linkimg2 {
  position: absolute;
  width: 4%;
  left: 87%;
  margin-top: -8%;
}
</style>


