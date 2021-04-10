<template>
    <div>
      <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>物流追踪</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div>
        <div class="statustext flex-between ">
          <div class="flex-col flex-between" v-for="(item,type) in progress" :key="type">
            <span :class="{'progress':item.type}">
              {{item.step}}
              <em ></em>
            </span>
            <p>{{personageShop&&type==2 ? "鉴定通过" :item.name}}</p>
          </div>

        </div>
             <!-- 订单复制 -->
        <div class="flex-between copy">
          <!-- <div class="orderno" v-if="!trackingList.expressno">物流跟踪:
            <input type="text" placeholder="暂无物流信息" id="orderno" readonly >
          </div>
          <div class="orderno" v-else> 物流跟踪:
            <input type="text" v-model="expressNo" id="orderno" readonly>
          </div> -->
          <div class="orderno"> 物流跟踪:
            <input type="text" v-model="expressNo" id="orderno" placeholder="暂无物流信息" readonly>
          </div>
          <div @click="copyText" class="copytext" v-if="trackingList.expressno">复制</div>
        </div>
        <!--卖家 待发货 v-if="trackingList.orderstatus===2&&personageShop"-->
        <div v-if="(trackingList.orderstatus===2||trackingList.orderstatus===14)&&personageShop&&upOrderNoType">
            <div class="trackingNumber">
                <div class="shuoming" v-if="isAftersale"> <span>买家申请售后,正在处理中...<br>请勿发货!</span></div>
                <div v-else>
                  <div class="shuoming" v-if="timetype"> 请在<span><span v-if="timeData.d>0">{{timeData.d}}天</span>{{timeData.H}}:{{timeData.m}}:{{timeData.s}}</span>内发货<br>
                  <p v-if="ispresell == 1">若超时未发货，或未能通过检验，保证金将全额赔偿<br>给买家和平台</p>
                   <p v-if="ispresell != 1">若超时将从保证金中扣除{{trackingList.redress}}元赔付给买家<br>已发货请填写物流单号</p>
                   </div>
                  <div class="shuoming" v-else> <span>您已超时未发货</span><br>若不及时发货平台将介入关闭订单<br>您需赔付买家{{trackingList.redress}}元</div>
                </div>
            </div>
            <div class="affirm-track" :class="{'noClick':isAftersale}" @click.stop="upOrderNo"> 上传单号 </div>
        </div>
         <!-- 上传物流单号 -->
        <div v-if="(trackingList.orderstatus===2||trackingList.orderstatus===14)&&personageShop&&!upOrderNoType">
          <div class="ordernoClass">
              <div class="ordernoClassType">
                <label for="">物流方式</label>
                <input type="text" placeholder="顺丰" readonly>
              </div>
              <div class="ordernoClassType">
                <label for="">物流单号</label>
                <input type="number" maxlength="12" placeholder="请输入物流单号" v-model="trackingNumber" @input="checkNum()">
              </div>
          </div>
          <!-- <div class="overflow-exp" v-if="!productNum&&!productList">您输入的物流单号已达上限，请更换单号！</div> -->
          <div class="choose" v-if="productList&&productList.length>1">
            <p class="quantity"><span>待发货订单</span>该包裹还可添加 {{productNum}} 个商品</p>
            <p class="attention">若一个包裹对应多个商品，发出请检查包裹商品数量是否齐全!</p>
          </div>
          <div class="logistics-list" v-if="productList&&productList.length>1">
            <div class="flex-aic logistics-item" v-for="(i,idx) in productList" @click="checkOrdernum(i,i.sellorderno,idx)">
              <div class="logistics-item-img">
                <img :src="i.productimageurl" alt="">
              </div>
              <div class="logistics-item-content">
                <div class="flex-between">
                  <span>订单编号：{{i.sellorderno}}</span>
                  <span>{{i.overtime}}</span>
                </div>
                <div class="logistics-item-second">{{i.productname}}</div>
                <div class="logistics-item-third">
                  <span>货号：{{i.sku}}</span>
                  <span class="logistics-item-size">{{i.productsize}}</span>
                  <span>x {{i.count}}</span>
                </div>
              </div>
              <div class=" logistics-item-check">
                <img :src="i.isDefault?'/static/img/red-act.png':(i.isChecked?'/static/img/d_apply_choose2.png':'/static/img/un-act.png')" alt="">
              </div>
            </div>
          </div>
          <div :class="{'affirm':isAffirm}" class="affirm-track track" @click.stop="affirmTrack"> 提交 </div>
        </div>
          <!-- 买家查看 待发货 -->
        <div class="userwaitshop" v-if="(trackingList.orderstatus===2||trackingList.orderstatus===14)&&!personageShop&&trackingList.traces.length==0">
          <p class="title">等待卖家发货</p>
        </div>

        <div class="list" v-if="trackingList.orderstatus!=2&&trackingList.orderstatus!=14 ||(!personageShop&&trackingList.traces.length>0) || trackingList.orderstatus===2&&personageShop&&trackingList.traces.length>0">
          <div v-for="(pitem,index) in trackingList.traces" :key="index" v-if="trackingListDispose">
            <div v-for="(item,indx) in pitem" :key="indx">
                  <!--    虚假发货- -->
                <div v-if="item.action===11" class="cancelorder flex-between">
                  <img src="/static/img/order_tracking_page_image.png" alt="">
                  <span>{{item.title}}</span>
                </div>
                  <!-- 平台鉴定未通过 -->
                <div class="cancelorder flex-between" v-if="item.action===12">
                  <img src="/static/img/order_tracking_page_image.png" alt="">
                  <span>{{item.title}}</span>
                </div>
                  <!-- 买家取消订单 -->
                <div class="cancelorder flex-between" v-if="item.action===9">
                  <img src="/static/img/order_tracking_page_image.png" alt="">
                  <span>{{item.title}}</span>
                </div>
                 <!-- 超时未发货 -->
                <div class="cancelorder flex-between" v-if="item.action===10">
                  <img src="/static/img/order_tracking_page_image.png" alt="">
                  <span>{{item.title}}</span>
                </div>
                <!-- <a href="tel:13248166371" v-if="index===0">13248166371移动WEB页面JS一键拨打号码咨询功能</a> -->
                  <!-- 物流-->
                <div class="ddlist" :class="{'black':index===0&&indx===0&&ind==0}" v-for="(itemin,ind) in item.logistics" :key="ind"
                 v-if="itemin.isShow" >
                  <div class="address">{{itemin.title}}</div>
                  <div class="time">{{itemin.createdat}}</div>
                  <span class="packup" v-if="ind===0&&item.logistics.length>=2" @click.stop="logistics(index,item.logistics)">
                    <i  v-if="!item.select">收起</i>
                    <i v-else> {{item.logistics.length-1}}条物流信息动态</i>
                    <em :class="{'up':!item.select}">></em>
                  </span>
                  <!-- //分割线 -->
                  <div v-if="item.select" class="zhedie">
                    <span></span><span></span>
                  </div>
                </div>
                <!-- 订单追踪 -->
                <div class="ddlist flaw" v-if="item.action!=9&&item.action!=10&&item.action!=11&&item.action!=12"
                  :class="{'first':indx===pitem.length-1,'black':index===0&&indx===0&&!item.logistics, 'red':(item.action===5||item.action===3||item.action===6||item.action>=13)&&index===0&&indx===0,'yellow':item.action===4}">
                  <div class="address">{{item.title}}</div>

                  <!-- 买家状态 有瑕疵 -->
                  <div class="case" >
                    <p class="reason">{{item.msg}}</p>
                    <div class="defective-pictures flex-wrap flex-tops">
                      <img v-for="(img,idx) in item.picsimg" :key="idx" :src="img" alt="" @click="previewImg(item.picsimg,idx)">
                    </div>
                    <div class="userSelect" v-if="item.action===3" >
                      <span  @click.stop="isaccept(item.trackid,1)">我能接受，同意发货</span>
                      <span @click.stop="isaccept(item.trackid,2)">不能接受，拒绝发货</span>
                    </div>
                  </div>
                  <div class="time">{{item.createdat}}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 瑕疵图片大图预览 -->
      <transition name='mask'>
        <div class="flex-center mask" v-if="isShowPreviewImg&&picsimg&&picsimg.length>0" @click="isShowPreviewImg = false">
           <div class="mask-content" @click.stop="">
            <swiper :options="swiperOption">
              <swiper-slide v-for="item in picsimg" :key="item">
                <img :src="item" alt="">
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </transition>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getTrace,
  acceptFlaw,
  shipMents,outdeleverylist,UploadExpressno
} from "../../../common/api/snekc2c.js";
import { DateDiff, _getDate } from "../../../common/util";
// hasdata:
// 0 - 商品已发货 （带有物流单号）
// 1 - 已签收-平台已收货
// 2 - 平台正在鉴定
// 3 - 平台查验商品有瑕疵问题需要您确认（只对买家可见，买家可操作，用户点击同意，变为4，不同意变为5）
// 4 - 您已接受瑕疵问题 同意继续发货（买家） 瑕疵问题，买家同意发货（卖家） （前端自动追加 平台鉴定通过）
// 5 - 因商品瑕疵问题 您已拒绝发货（买家） 瑕疵问题，买家拒绝发货 商品将到付退回（卖家）
// 6 - 平台鉴定不通过 商品将到付退回 （卖家）(此状态发生后会增加状态12)
// 7 - 平台鉴定通过（平台鉴定通过或买家同意瑕疵发货后才生成）
// 8 - 平台已发货，正在揽件（带有物流单号，根据uid判断当前物流信息是卖家的还是买家的）
// 9 - 由于买家取消订单，**元赔付款已转入您的斗牛APP账户余额中，请注意查收！（卖家） 由于您取消订单，将会从您的商品金额中扣除**元作为卖家的赔付款！（买家）
// 10 - 由于卖家超时未发货，**元赔付款已转入您的斗牛APP账户余额中，请注意查收！（买家） 由于您超时未发货，将从您的保证金中扣除**元赔付给买家！（卖家）
// 11 - 由于卖家虚假发货，**元赔付款已转入您的斗牛APP账户余额中，请注意查收！（买家） 由于您虚假发货，将从您的保证金中扣除**元赔付给买家！（卖家）
// 12 - 由于商品未达到平台鉴定标准，**元赔付款已转入您的斗牛APP账户余额中，请注意查收！（买家） 由于未通过平台鉴定，将从您的保证金中扣除**元赔付给买家！（卖家）
export default {
  data() {
    return {
      personageShop: true, // true 商家 false 个人 1：卖家，2买家
      expressNo: "", // 物流编号
      trackprogress: null, // 物流进度
      trackingNumber: "", // 待发货时 填写的物流编号
      isAffirm: "", // 提交单号的颜色
      progress: [
        { name: "卖家发货", step: 1 },
        { name: "平台鉴定", step: 2 },
        { name: "平台发货", step: 3 }
      ],
      isAftersale: false,
      trackingList: [],
      picsImg: "",
      upOrderNoType: true,
      timetype: true,
      timeData: { H: "00", m: "00", s: "00" },
      swiperOption: {
        // initialSlide: 2,
        slidesPerView: 1, //显示的slides数量
        freeModeMomentumBounce: false, //动量反弹
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左
        touchRatio:0.5,//触摸距离与slide滑动距离的比率
        onInit:(swiper) =>{
          swiper.slideTo(this.curIdx,0,false)
          console.log('swiper当前索引：',swiper.activeIndex,this.curIdx)
        }
      },
      picsimg:[],//蒙层展示的放大图片
      curIdx:0,//预览图片的索引
      isShowPreviewImg:false,
      productList: [],
      productNum:0,
      judgeNum:0,
      ordernumList: [], //存储选择的订单号
      ispresell: 0 // 是否是预售
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      shopType: "shopType",
      userInfo: "userInfo"
    }),
    trackingListDispose() {
      let rec = this.trackingList.traces;
      // if (rec) {
      //   for (var i = 0; i < rec.length; i++) {
      //     if (rec[i]) {
      //       for (let p = 0; p < rec[i].length; p++) {
      //         rec[i][p].picsimg = rec[i][p].pics.split(",");
      //       }
      //     }
      //   }
      // }
      // console.log(rec, "kkk");
      return rec;
    }
  },
  mounted() {
    this.getTraceOrder();
    //  role 1：卖家，2买家
    this.personageShop = this.$route.params.role == 1 ? true : false;

    console.log(
      "订单编号",
      this.$route.params.orderno,
      "角色",
      this.$route.params.role
    );


    // if(this.$route.params.orderno){
    //   this.ordernumList.push(this.$route.params.orderno)
    // }
  },
methods: {
  checkNum(e){
    let _ = this
    _.isAffirm = _.trackingNumber&&/^[0-9]{12}$/.test(_.trackingNumber)
    if(_.isAffirm){
      _.getProductList(_.trackingNumber)
    }
  },
  checkOrdernum(item, num, curVal) {
    let _ = this
    if(!!item.isDefault) return
    console.log('选择条件展示：',_.judgeNum,_.ordernumList.length+1)
    if(_.judgeNum&&(_.judgeNum >= _.ordernumList.length+1)){
      item.isChecked = !item.isChecked
      if (_.ordernumList&&_.ordernumList.length>0) {
        var idx = _.ordernumList.indexOf(num);
        console.log('索引值：',idx)
        if (idx > -1) {
          _.ordernumList.splice(idx, 1)
          _.productNum++
        }else{
          _.ordernumList.push(num)
          _.productNum--
        }
      }else{
        _.ordernumList.push(num)
        _.productNum--
      }
    }else{
      if(!item.isChecked&&(_.judgeNum == _.ordernumList.length)){
        _.toast(`该物流单号最多添加${_.judgeNum}件商品！`)
      }else if(!!item.isChecked&&(_.judgeNum == _.ordernumList.length)){
        var idx = _.ordernumList.indexOf(num);
        if (idx > -1) {
          item.isChecked = false
          _.ordernumList.splice(idx, 1)
          _.productNum++
        }
      }
    }
    console.log('选择的订单号：',_.ordernumList.join(','))
  },
  // 获取订单商品选择列表
  getProductList(expressno){
    let _ = this,opts
    opts = {
      orderno:_.$route.params.orderno,
      expressno:expressno,
      producttype:_.$route.query.producttype||21
    }
    outdeleverylist(opts).then( res => {
      if(res.list&&res.list.length>0){
         _.productList = res.list.map( i => {
          // _.$set(i,'isChecked',false)
          i.overtime = i.overtime.substr(0,16)
          if (_.$route.params.orderno == String(i.sellorderno)){
            i.isDefault = true
            _.ordernumList.push(_.$route.params.orderno)
          }else{
            i.isChecked = false
          }
          return i
        })
      }

      console.log('_.productList',_.productList)
      if(_.ordernumList&&_.ordernumList.length>0){
        _.productNum = res.num-1
      }else{
        _.productNum = res.num
      }
      _.judgeNum = res.num
    }).catch( err => {
      if(err && err.msg){
        _.toast(err.msg)
      }
      console.error(err);
    })
  },
  countdownTime(time, type) {
    this.timeData = DateDiff({ destination: time, type: "d" });
    let t = this.timeData;
    this.timetype = true;
    if (
      this.timeData.H <= 0 &&
      this.timeData.m <= 0 &&
      this.timeData.s <= 0
    ) {
      this.timetype = false;
      clearInterval(this.clearTime);
      t.H = t.m = t.s = "00";
      return;
    }
    t.d = t.d
    t.H = t.H < 10 ? "0" + t.H : t.H;
    t.m = t.m < 10 ? "0" + t.m : t.m;
    t.s = t.s < 10 ? "0" + t.s : t.s;
  },
  setentime(time, type) {
    let _ = this;
    _.clearTime = setInterval(function () {
      _.countdownTime(time, type);
    }, 1000);
  },
  copyText() {
    // 复制订单编号
    window.document.execCommand("Copy");
    var Url2 = window.document.getElementById("orderno");
    Url2.select();
    window.document.execCommand("Copy"); // 执行浏览器复制命令
    this.toast("复制成功！");
  },
  getTraceOrder() {
    // 参数 订单编号 orderno 和 角色role
    let option = {
      orderno: this.$route.params.orderno,
      role: this.$route.params.role
    };
    getTrace(option)
      .then(res => {
        this.trackingList = res;
        this.trackprogress = res.trackprogress;
        this.isAftersale = res.iscustomerservice ? res.iscustomerservice : false
        this.setentime(res.sendgoodsdeadline, "H");
        this.expressNo = res.expressno;
        this.ispresell = res.ispresell;
        let lo = this.trackingList.traces;
        if (lo) {
          for (let p = 0; p < lo.length; p++) {
            if (lo[p]) {
              for (let m = 0; m < lo[p].length; m++) {
                lo[p][m].select = true;
                if (lo[p][m] && lo[p][m].logistics) {
                  for (let t = 0; t < lo[p][m].logistics.length; t++) {
                    lo[p][m].logistics[t].isShow = false;
                    lo[p][m].logistics[0].isShow = true;
                  }
                }
                if (lo[p][m].pics) {
                  lo[p][m].picsimg = lo[p][m].pics.split("|");
                }
              }
            }
          }
        }
        let _ = this,
          pr = _.progress,
          progress = res.trackprogress;
        for (let p = 0; p < pr.length; p++) {
          if (progress === 3 && !_.personageShop) {
            progress = progress - 1;
          }
          if (p < progress) {
            pr[p].type = true;
          } else {
            pr[p].type = false;
          }
        }
        console.log("订单追踪", this.trackingList);
      })
      .catch(e => {
        console.error(e);
      });
  },
  logistics(index, item) {
    let L = this.trackingList;
    let lo = L.traces[index];
    if (lo) {
      for (let p = 0; p < lo.length; p++) {
        if (lo[p].logistics) {
          if (lo[p].select) {
            for (let t = 0; t < lo[p].logistics.length; t++) {
              lo[p].logistics[t].isShow = true;
            }
            lo[p].select = false;
          } else {
            for (let t = 0; t < lo[p].logistics.length; t++) {
              lo[p].logistics[t].isShow = false;
              lo[p].logistics[0].isShow = true;
            }
            lo[p].select = true;
          }
        }
      }
    }

    this.trackingList = [];
    this.trackingList = L;
  },
  isaccept(trackid, type) {
    // type  1: 能接受，同意发货2: 不能接受，拒绝发货
    let flaw = {
      orderno: this.$route.params.orderno,
      isaccept: type,
      trackid: trackid || ""
    };
    acceptFlaw(flaw)
      .then(res => {
        console.log("是否接受瑕疵", res);
        if (type === 1) this.toast("您已接受瑕疵，商品将继续发货");
        else this.toast("您已拒绝继续发货");
        this.getTraceOrder();
      })
      .catch(err => {
        console.log("错误信息", err);
      });
  },
  upOrderNo() {
    if (this.isAftersale) {
      this.toast("售后中 请勿发货");
    } else {
      this.upOrderNoType = false;
    }
  },
  affirmTrack() {
    if (this.trackingNumber) {
      let ship = {
        allorderno: this.ordernumList.join(','),
        expressno: this.trackingNumber,
        expresscompany: "顺丰"
      };
      let rexTracking = /^[0-9]{12}$/;
      if (!rexTracking.test(ship.expressno)) {
        this.toast("格式错误");
        return;
      }
      UploadExpressno(ship)
        .then(res => {
          this.toast("上传成功");
          this.getTraceOrder();
        })
        .catch(err => {
          this.toast(err.msg);
          console.error(err);
        });
    } else {
      this.toast("请填写物流单号");
    }
  },
  previewImg(picsimg,idx){
    let _ = this
    _.picsimg = picsimg
    _.curIdx = idx
    _.isShowPreviewImg = true
    console.log('图片信息展示：',_.picsimg,_.curIdx)
  }
}
};
</script>
<style scoped>
.outtimesend {
  font-size: 12px;
  text-align: center;
  margin-top: 60px;
  line-height: 24px;
}

.outtimesend img {
  width: 30%;
  display: block;
  margin: 0 auto;
  margin-bottom: 20px;
}
.trackingNumber {
  background: #fff;
  padding: 20vh 20px 0 20px;
}
.trackingNumber input {
  outline-style: none;
  list-style: none;
  border: 1px solid #666;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  text-align: center;
}
.trackingNumber .shuoming {
  font-size: 12px;
  line-height: 20px;
  padding-top: 18px;
  text-align: center;
}
.trackingNumber .shuoming span {
  font-size: 16px;
  color: #d0021b;
  font-weight: bold;
  padding: 0 3px;
  font-family: "PingFang";
}
.ordernoClass {
  margin: 10px 20px;
}
.ordernoClass .ordernoClassType {
  height: 40px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
  padding: 10px 20px;
  font-size: 14px;
  margin-bottom: 12px;
}
.ordernoClass .ordernoClassType input {
  font-size: 12px;
}
.cancelorder {
  margin: 15px;
  box-shadow: 0 0 5px #ccc;
  padding: 15px;
  border-radius: 5px;
}
.cancelorder img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  margin-right: 20px;
}
.cancelorder span {
  font-size: 12px;
  color: #333;
}

.affirm-track {
  position: fixed;
  bottom: 0;
  background: #333;
  line-height: 44px;
  height: 44px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  width: 100%;
}
.affirm-track.track {
  background: #ccc;
  color: #fff;
}
.affirm-track.affirm {
  background: #333;
}
.affirm-track.noClick {
  background: #ccc;
}
.statustext {
  background: url(/static/img/order_details_page_bg_state_default.png) 0 0
    no-repeat;
  background-size: cover;
  color: #fff;
  font-size: 12px;
  padding: 10px 7%;
  line-height: 80px;
  font-weight: bold;
  position: relative;
  /* padding: 10px; */
}
.outtime-no-send {
  padding: 16vw 15px 0 15px;
  font-size: 13px;
  color: #333;
}
.statustext span {
  width: 28px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  font-weight: bold;
  color: #333;
  font-size: 16px;
  display: inline-block;
  background: url("/static/img/sixangle_grey.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.statustext span.progress {
  background: url("/static/img/sixangle.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.statustext span::after {
  content: "";
  position: absolute;
  left: -260%;
  top: 50%;
  transform: translateY(-50%);
  width: 260%;
  height: 2px;
  background: #ccc;
}
.statustext span::before {
  content: "";
  position: absolute;
  right: -260%;
  top: 50%;
  transform: translateY(-50%);
  width: 260%;
  height: 2px;
  background: #ccc;
}
.statustext span.progress em::before {
  width: 260%;
  height: 2px;
  content: "";
  position: absolute;
  right: -260%;
  top: 50%;
  transform: translateY(-50%);
  background: #ffc700;
  z-index: 2;
}
.statustext span.progress em::after {
  width: 260%;
  height: 2px;
  content: "";
  position: absolute;
  left: -260%;
  top: 50%;
  transform: translateY(-50%);
  background: #ffc700;
  z-index: 2;
}
.statustext .flex-col:last-child span::before,
.statustext .flex-col:first-child span::after {
  content: "";
  width: 0%;
}
.statustext .flex-col:last-child span.progress em::before,
.statustext .flex-col:first-child span.progress em::after {
  content: "";
  width: 0%;
}
.statustext p {
  line-height: 20px;
  margin-top: 10px;
}
.copy {
  font-size: 14px;
  /* height: 50px; */
  line-height: 50px;
  background: #fff;
  padding: 0 15px;
  /* border-top: 10px solid #f5f4f9; */
  border-bottom: 10px solid #f5f4f9;
}
.copytext {
  /* width: 40px; */
  line-height: 18px;
  border: 1px solid #333;
  text-align: center;
  padding: 2px 10px;
}
.list {
  font-size: 12px;
  color: #999;
  background: #fff;
}
.list .ddlist {
  margin: 0 22px 0 40px;
  line-height: 24px;
  position: relative;
  font-size: 14px;
  padding: 15px 0;
  padding-top: 3px;
}
.list .ddlist.red .address {
  color: #d0021b;
}
.list .ddlist.yellow .address {
  color: #ffc700;
}
.list .ddlist.black {
  color: #333;
}

.list .ddlist .time {
  font-size: 10px;
}
.list .ddlist .packup {
  margin-top: 5px;
  position: absolute;
  top: 20px;
  right: 5px;
  color: #fff;
  background: #999;
  font-size: 12px;
  padding: 0 5px;
  /* height: 30px;
  line-height: 30px; */
  border-radius: 15px;
}
.list .ddlist .packup i {
  font-style: normal;
}
.list .ddlist .packup em {
  /* font-size: 14px; */
  transition: all 0.3s linear;
  display: inline-block;
  transform: rotate(90deg);
}
.list .ddlist .packup em.up {
  transform: rotate(-90deg);
}
.list .ddlist::before {
  content: "";
  width: 10px;
  height: 10px;
  background: url("http://files.eyee.com/mcdn/static/img/sixangle_grey.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: -26px;
  top: 10px;
  z-index: 2;
}
.list .ddlist.black:before {
  background: url("/static/img/dian.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.list .ddlist.red:before {
  background: url("/static/img/red_icon.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.list .ddlist::after {
  content: "";
  width: 2px;
  height: 100%;
  background: #e3e3e3;
  position: absolute;
  left: -22px;
  top: 15px;
  z-index: 1;
}
/* .list .ddlist.first::before {
  background: #333;
}
.list .ddlist .time {
  font-size: 12px;
}
.address {
  width: 60%;
}
.list .ddlist.first .address {
  font-size: 13px;
  color: #333;
}
.list .ddlist.first .time {
  font-size: 10px;
  color: #666;
} */
.list .ddlist.first:after {
  height: 0px;
  top: 0;
}
.zhedie span {
  display: block;
  height: 5px;
  border-bottom: 1px solid #f0f0f0;
  width: 90%;
  margin: 0 auto;
}
.zhedie span:nth-child(2) {
  width: 80%;
  margin: 0 auto;
}
.case .reason {
  font-size: 12px;
  /* color: #333; */
}
.defective-pictures img {
  width: 20%;
  height: auto;
  margin-right: 2%;
  margin-bottom: 2%;
}
.userSelect {
  padding: 10px 0;
}
.userSelect span {
  display: inline-block;
  font-size: 12px;
  padding: 5px 15px;
  border: 1px solid #ffc700;
  border-radius: 3px;
  color: #ffc700;
  margin-right: 10px;
}
.agree-refuse {
  color: #ffc700;
  font-size: 12px;
}
.userwaitshop {
  padding: 15px;
}
.userwaitshop .title {
  font-size: 13px;
  color: #333;
  position: relative;
  padding-left: 25px;
  font-weight: bold;
}
.userwaitshop .title:before {
  content: "";
  width: 10px;
  height: 10px;
  background: #333;
  position: absolute;
  left: 5px;
  top: 3px;
  border-radius: 50%;
}
.userwaitshop .hint {
  margin-top: 30px;
  font-size: 12px;
  border: 1px solid #999;
  border-radius: 5px;
  padding: 15px;
  line-height: 20px;
  text-indent: -5px;
}
.userwaitshop .hint span {
  color: #333;
  font-weight: 500;
  margin-top: 24px;
  display: block;
  padding-left: 20px;
  position: relative;
}
.userwaitshop .hint span::before {
  content: "!";
  position: absolute;
  width: 14px;
  height: 14px;
  line-height: 13px;
  border-radius: 50%;
  border: 1px solid #333;
  font-size: 10px;
  text-align: center;
  padding-left: 4px;
  left: -4px;
  top: 3px;
}
.choose {
  padding: 15px;
  border-top: 10px solid #f5f4f9;
  border-bottom: 1px solid #f5f4f9;
}
.quantity {
  font-size: 12px;
  color: #333;
}
.quantity span {
  margin-right: 8px;
  font-weight: bold;
}
.attention {
  margin: 8px 0;
  font-size: 10px;
  color: #ef0000;
}

.logistics-list {
  padding-bottom: 16vw;
}
.logistics-item {
  padding: 2vw;
  border-bottom: 1px solid #f5f5f5;
}
.logistics-item-img {
  width: 13.3333vw;
  height: 13.3333vw;
}
.logistics-item-content {
  width: 74.6667vw;
  /* flex: 1; */
  margin: 0 2vw;
  color: #333;
  font-size: 2.6667vw;
}
.logistics-item-second {
  margin-top: 2.6667vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.logistics-item-third {
  margin-top: 2.6667vw;
}
.logistics-item-size {
  display: inline-block;
  margin: 0 4vw;
}
.logistics-item-check {
  width: 5.3333vw;
  height: 5.3333vw;
}
.checkbox {
  position: relative;
  display: inline-block;
  border: 3px double #ccc;
  border-radius: 50%;
}

.prod-item {
  padding: 15px;
  height: 90px;
  border-bottom: 1px solid #f5f4f9;
}
.prodimg {
  float: left;
  width: 15%;
  height: 59px;
  position: relative;
}
.prodinfo {
  float: left;
  width: 79%;
  font-size: 10px;
  color: #333;
}
.prodinfo p {
  width: 100%;
  height: 22px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.prodinfo span {
  margin-left: 10px;
}
.choose-icon {
  float: right;
  width: 6%;
  height: 59px;
  position: relative;
}
.vetically {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}

/* 查看图片遮罩层 */
.mask-enter-active,
.mask-leave-active {
  transition: all 0.5s;
}
.mask-enter,
.mask-leave-to {
  opacity: 0;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
}
.mask-content{
  width: 100%;
  height: auto;
  /* background-color: #fff; */
}
.mask-content img{
  width: 100%;
}
.overflow-exp{
  color: #D0021B;
  font-size: 3.2vw;
  line-height: 5.8667vw;
  margin-left: 10.6667vw;
}
</style>


