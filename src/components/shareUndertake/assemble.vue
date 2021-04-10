<template>
  <div>
    <!-- <v-header class="nav">
      <div class="nav-tab2 ellipsis">斗牛，Let's DoNew！</div>
    </v-header>-->
    <div class="product_sw">
      <swiper :options="prodSwiOption" class="product_sw">
        <swiper-slide v-for="(item,index) in swItem" :key="index">
          <img :src="item|https" :alt="item">
        </swiper-slide>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
      </swiper>
    </div>
    <div class="flex-between goods-title-info">
      <div class="flex goods-price-info">
        <span class="font-price">￥</span>
        <span class="font-price goods-now-price">{{otherInfo.specialprice | tofixed}}</span>
        <div class="font-price goods-old-price">¥{{otherInfo.saleprice | tofixed}}</div>
        <div class="goods-buy-price">抢购价</div>
      </div>
      <div>剩余库存{{otherInfo.stock}}件</div>
    </div>
    <div class="goods-name-info goods-border">
      <div class="goods-name">{{productInfo.name}}</div>
      <!-- <div class="goods-rules">邀请{{otherInfo.inviteneed}}名新用户解锁抢购价，查看细则 </div> -->
      <div class="goods-rules">{{otherInfo.message}}</div>
      <div class="flex goods-logistics">
        <div>发货地：{{expressInfo.sendplace}}</div>
        <div>运费：
          <span v-if="expressInfo.destination">至{{expressInfo.destination}}</span>
          ¥{{expressInfo.expressfee | tofixed}}
        </div>
      </div>
    </div>
    <div class="flex goods-ensure goods-border">
      <div class="flex-center" v-show="!productInfo.isaftersale">
        <img src="/static/img/assemble/mark-icon.png" alt>不支持退换
      </div>
      <div class="flex-center" v-show="productInfo.isaftersale">
        <img src="/static/img/assemble/mark-icon.png" alt>无忧售后
      </div>
      <div class="flex-center" v-show="productInfo.isglobalpurchase">
        <img src="/static/img/assemble/mark-icon.png" alt>全球购商品
      </div>
    </div>
    <!-- 背景介绍 -->
    <!-- <div class="product_logo border-20">
      <div class="logo_img">
        <img :src="productInfo.brandlogo|https" alt="">
      </div>
      <p>{{productInfo.brandname}}</p>
      <p>{{productInfo.brandmemo}}</p>
    </div>-->
    <!-- 进店逛逛 -->
    <div class="BusinessIsGlobalPurchase flex-between border-20">
      <div class="flex-center">
        <div class="shopTLD">
          <img :src="productInfo.businessheadportraiturl" alt>
        </div>
        <div class="businesstype">
          {{productInfo.businessname}}
          <div>
            <i class="ico-sp-glb tilt" v-show="productInfo.businessisglobalpurchase"></i>
            <i class="ico-sp-official tilt" v-show="productInfo.businesstype==1"></i>
            <i class="ico-sp-buy tilt" v-show="productInfo.businesstype==2"></i>
            <i class="ico-sp-store tilt" v-show="productInfo.businesstype==3"></i>
          </div>
        </div>
      </div>
      <div class="go-stroll" @click.stop="rushBuy()">进店逛逛</div>
    </div>
    <!-- 商品规格border-20 -->
    <div class="goods-detail">
      <div class="goods-detail-info">
        <div class="goods-detail-item">
          <span>商品编号：</span>
          {{productInfo.prokey}}
        </div>
        <div class="goods-detail-item">
          <span>材质：</span>
          {{productInfo.texture}}
        </div>
        <div class="goods-detail-item">
          <span>颜色：</span>
          {{productInfo.colorattribute}}
        </div>
      </div>
      <div class="goods-detail-table">
        <table border="0">
          <tr>
            <th>规格</th>
            <th v-for="item in sizeList.head" :key="item">{{item}}(cm)</th>
          </tr>
          <tr v-for="(item,index) in sizeList.body" :key="index">
            <td>{{item.key}}</td>
            <td v-for="(i,index) in item.val" :key="index">{{i}}</td>
          </tr>
        </table>
      </div>
      <div class="flex-wrap goods-detail-label">
        <div class="goods-detail-label-item" v-for="item in labelList">{{item}}</div>
      </div>
    </div>

    <!-- 热门推荐 -->
    <!-- <div class="goods-recommend">
      <div class="goods-recommend-name">热门推荐</div>
      <div class="goods-list">
        <div class="goods-item" v-for="item in relativePods">
          <img :src="item.mainpic" alt="">
        </div>
      </div>
    </div>-->
    <!-- 底部 -->
    <div class="goods-footer" id="toapp-footer">
      <div
        class="goods-footer-info"
        @click="rushBuy()"
      >{{(otherInfo.stock != 0 && otherInfo.activitystatus != 4)?'立即抢购':'货品即将更新，抢先下载'}}</div>
    </div>
  </div>
</template>
<script>
import { weixinApp } from "../../common/api/oauthAPI";
import { WXRegisterAuth } from "../../common/api/user";
import {
  NewDetail,
  DetailExpress,
  ProdRelated
} from "../../common/api/product";
import {
  RefreshPanicBuy,
  RelationWxUse
} from "../../common/api/shareUndertake";
import { LoadScene } from "@/utils/enum";

export default {
  data() {
    return {
      prodSwiOption: {
        autoplayDisableOnInteraction: false,
        pagination: ".swiper-pagination",
        roundLengths: true,
        preloadImages: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false
      },
      swItem: [],
      productInfo: {},
      expressInfo: {},
      sizeList: [],
      labelList: [],
      curuserid: "",
      curactivityid: "",
      userinfo: {},
      otherInfo: {}
      // relativePods:[]
    };
  },
  mounted() {
    let _ = this;
    console.log("地址栏携带参数", _.$route.query);
    _.curuserid = _.$route.query.userid;
    _.curactivityid = _.$route.query.activityid;
    // _.getRelateds(_.curid)
    if (window.location.href.indexOf("code") > 0) {
      var weixincode = window.location.href
        .split("code=")[1]
        .split("&state")[0];
      // var weixincode = '021TMk362UOO4R0Znb462T2l362TMk3S'
      // alert(weixincode)
      WXRegisterAuth({
        WXCode: weixincode
      })
        .then(res => {
          console.log("WXRegisterAuth微信授权之后获取到的res====>", res);
          _.userinfo = res;
          if (res && res.unionid) {
            _.getWxAuth(res);
          }
        })
        .catch(err => {
          console.log("WXRegisterAuth微信授权解析失败err====>", err);
        });
    } else {
      console.log(window);
      // var doPath = window.location.origin + window.location.pathname + window.location.search;
      var doPath = window.location.href;
      // var doPath = 'https://qzone.eyee.com' + window.location.pathname;
      var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      // if (window.confirm("跳转的链接：" + link))
      window.location = link;
      return;
    }
  },
  methods: {
    rushBuy() {
      let _ = this;
      // if (!_.otherInfo.productid) return;
      // let tipmsg = '此商品仅支持APP下单购买 （请使用微信登录）'.replace(/\s+/g,' <br> ')
      // console.log(tipmsg)
      _.toast("此商品仅支持APP下单购买 （请使用微信登录）");
      setTimeout(() => {
        // if(_.$root.ISIOS){
        //   console.log('-------IOS系统--------')
        //   setTimeout(function () {
        //     window.location = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
        //   }, 10)
        // }else{
        //   console.log('------安卓系统--------')
        //   window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee', '_blank')
        // }
        _.sceneLoad(LoadScene.newUserHelp);
      }, 1300);
    },
    // 获取抢购详情
    getPanicBuy() {
      let _ = this;
      RefreshPanicBuy({ activityid: _.curactivityid })
        .then(res => {
          console.log("获取抢购详情 ===>", res);
          _.otherInfo = res;
          _.getProductDetail(res.productid);
        })
        .catch(err => {
          console.error("抢购详情获取失败===>", err);
        });
    },
    //微信授权
    getWxAuth(userinfo) {
      let _ = this;
      // 关联微信用户
      let opts = {
        userid: _.curuserid,
        unionid: userinfo.unionid,
        wxname: userinfo.nickname,
        wxheadimg: userinfo.headimgurl,
        activityid: _.curactivityid
      };
      console.log("关联微信用户入参===>", opts);
      RelationWxUse(opts)
        .then(resource => {
          console.log("**********微信关联用户成功**********");
          $log({e:'clickToBuyLowPrice',p:{userid:_.curuserid}})
          _.getPanicBuy();
        })
        .catch(error => {
          console.error("关联微信用户失败 ===>", error);
        });
    },
    // 获取商品详情
    getProductDetail(id) {
      let _ = this;
      NewDetail(id)
        .then(res => {
          if (res && res.info) {
            _.productInfo = res.info;
            if (res.info.sizedesc) {
              _.sizeList = JSON.parse(res.info.sizedesc);
              console.log(" _.sizeList", _.sizeList);
            }
            _.labelList = [res.info.brandname, res.info.categoryname];
            if (res.info.mainpic) {
              _.swItem = res.info.mainpic.split("|");
            }
            // 获取物流
            if (res.info.expresstemplateid) {
              _.getExpress(res.info.expresstemplateid);
            }
          }
          console.log("商品详情获取成功===>", _.productInfo, _.labelList);
        })
        .catch(err => {
          _.toast("加载失败");
          console.error("商品详情异常===>", err);
        });
    },
    // 获取商品推荐
    // getRelateds(id) {
    //   this.relativePods = [];
    //   ProdRelated({ ProductId: id })
    //     .then(res => {
    //       if (res) {
    //         this.relativePods = res;
    //       }
    //     })
    //     .catch(e => {
    //       console.error("商品详情相关推荐异常", e);
    //     });
    // },
    // 获取物流信息
    getExpress(expressTemplateId) {
      let _ = this;
      DetailExpress(expressTemplateId)
        .then(res => {
          console.log("商品详情物流信息", res);
          _.expressInfo = res;
        })
        .catch(e => {
          console.error("物流信息加载失败", e);
        });
    }
  }
};
</script>
<style scoped>
.product_sw {
  max-width: 600px;
  max-height: 600px;
  height: 100vw;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
}
.goods-title-info {
  width: 100%;
  height: 14.4vw;
  background: url("/static/img/assemble/goods-title-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 0 4vw;
  font-size: 3.4667vw;
  color: #fff;
}
.goods-title-info .goods-now-price {
  font-size: 9.8667vw;
  /* font-weight: bolder; */
}
.goods-title-info span {
  font-size: 4.5333vw;
}
.goods-price-info {
  align-items: baseline;
}
.goods-old-price {
  font-size: 4.5333vw;
  margin-left: 1.3333vw;
  text-decoration: line-through;
}
.goods-buy-price {
  width: 10.6667vw;
  height: 4.2667vw;
  background: url("/static/img/assemble/goods-price-bg.png") no-repeat;
  background-size: 100% 100%;
  font-size: 2.6667vw;
  text-align: center;
  line-height: 4.2667vw;
  margin-left: 2.6667vw;
  transform: translate(0, -1vw);
}
.goods-name-info {
  padding: 4vw 4vw 2.6667vw;
}
.goods-border {
  border-bottom: 1.3333vw solid #f2f2f2;
}
.goods-name-info .goods-name {
  font-size: 4vw;
  color: #333;
  line-height: 5.3333vw;
  font-weight: 600;
}
.goods-name-info .goods-rules {
  font-size: 3.2vw;
  color: #ff6828;
  margin-top: 1.8667vw;
}
.goods-name-info .goods-logistics {
  color: #666;
  font-size: 3.2vw;
  margin-top: 2.3333vw;
}
.goods-name-info .goods-logistics div:first-child {
  margin-right: 5.3333vw;
}
.goods-ensure {
  font-size: 2.6667vw;
  color: #999;
  height: 10.6667vw;
  width: 100%;
  overflow: hidden;
  padding: 0 0.5%;
}
.goods-ensure img {
  width: 3vw;
  height: 3vw;
  margin-right: 1.3333vw;
}
.goods-ensure > div {
  width: 33%;
}

.product_logo {
  text-align: center;
  padding-top: 5.3333vw;
}

.product_logo .logo_img {
  height: 18vw;
  width: 18vw;
  border-radius: 50%;
  border: 1px solid #eee;
  overflow: hidden;
  margin: 0 auto 2.6667vw;
}

.logo_img img {
  width: 100%;
  min-height: 100%;
}

.product_logo p:nth-of-type(1) {
  padding-bottom: 5.3333vw;
  font-weight: bold;
  font-size: 3.7333vw;
}
.product_logo p:nth-of-type(2) {
  padding: 0 16% 5.3333vw 16%;
  font-size: 3.2vw;
}
.border-20 {
  border-bottom: 2.6667vw solid #f2f2f2;
}
.goods-detail {
  padding: 5.3333vw 0 11vw;
}
.goods-detail .goods-detail-info {
  text-align: center;
  font-size: 3.7333vw;
  color: #666;
  padding: 0 2vw;
}
.goods-detail .goods-detail-info span {
  color: #000;
}
.goods-detail .goods-detail-info .goods-detail-item {
  margin-bottom: 3vw;
}
.goods-detail-table {
  padding: 2vw 1.6vw 5.3333vw;
  border-bottom: 1px solid #f2f2f2;
}
.goods-detail-table table {
  width: 100%;
  font-size: 3.2vw;
  color: #666;
  border-width: 1px;
  border-color: #999999;
  border-collapse: collapse;
}
.goods-detail-table table tr {
  height: 6.6667vw;
}
.goods-detail-table table tr th {
  background-color: #f2f2f2;
  border: 1px solid #f2f2f2;
}
.goods-detail-table table tr td {
  text-align: center;
  border: 1px solid #f2f2f2;
}
.goods-detail-label {
  padding: 5.3333vw 5.3333vw 0 2.6667vw;
}
.goods-detail-label .goods-detail-label-item {
  background-color: #333;
  color: #ffffff;
  font-size: 3.7333vw;
  padding: 0 4vw;
  height: 8vw;
  border-radius: 1.3333vw;
  line-height: 8vw;
  margin-left: 2.6667vw;
  margin-bottom: 2.6667vw;
}
.BusinessIsGlobalPurchase {
  overflow: hidden;
  font-size: 3.2vw;
  padding: 4vw 5.3333vw;
}

.BusinessIsGlobalPurchase div.shopTLD {
  border-radius: 1.3333vw;
  overflow: hidden;
  width: 10.6667vw;
  height: 10.6667vw;
}
.BusinessIsGlobalPurchase div.businesstype {
  font-family: PingFangSC-Medium;
  font-size: 4.2667vw;
  color: #333333;
  margin-left: 2.6667vw;
}
.BusinessIsGlobalPurchase div.go-stroll {
  float: right;
  border: 1px solid #ffc700;
  border-radius: 100px;
  font-size: 12px;
  color: #ffc700;
  width: 17.0667vw;
  height: 6.4vw;
  line-height: 6.4vw;
  text-align: center;
}
.goods-recommend {
  padding: 5.3333vw 0 16vw;
}
.goods-recommend .goods-recommend-name {
  color: #333;
  font-size: 3.7333vw;
  padding: 0 5.3333vw;
}
.goods-list {
  width: 100%;
  margin-top: 5.3333vw;
  padding-left: 5.3333vw;
  overflow-x: scroll;
  white-space: nowrap;
}
.goods-list .goods-item {
  width: 33.3333vw;
  height: 33.3333vw;
  display: inline-block;
  margin-right: 3.3333vw;
}
.goods-list .goods-item img {
  width: 100%;
  height: 100%;
}
.goods-footer {
  padding: 1.3333vw 3.2vw;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fff;
}
.goods-footer .goods-footer-info {
  width: 100%;
  height: 10.6667vw;
  background-color: #707afc;
  border-radius: 6.6667vw;
  text-align: center;
  line-height: 10.6667vw;
  font-size: 4.2667vw;
  color: #fff;
  letter-spacing: 0.6667vw;
}
</style>

