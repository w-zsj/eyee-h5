<template>
  <div class="mainPlace">
    <div class="banner">
      <img :src="'//files.eyee.com/mcdn/img/card/banner.png' + '?c=' + timestamp" alt="">
    </div>
    <!-- 抢券 -->
    <div class="couponBox">
      <img :src="'//files.eyee.com/mcdn/img/card/getCouponBg.png' + '?c=' + timestamp" alt="">
      <div class="getBtn" @click="getCoupom"></div>
    </div>
    <div class="goodsBox">
      <!-- 以鞋会友 鼠你最潮 top1 top2 top3-->
      <img :src="'//files.eyee.com/mcdn/img/card/subject_one.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'vgdlRXIL')" :src="'//files.eyee.com/mcdn/img/card/subject_one_top1.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'DojC90wT')" :src="'//files.eyee.com/mcdn/img/card/subject_one_top2.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'F4bprDFP')" :src="'//files.eyee.com/mcdn/img/card/subject_one_top3.png' + '?c=' + timestamp" alt="">
      <!-- 对应商品 c2c-->
      <div class="goodsList" v-if="subjectOneList && subjectOneList.length > 0">
        <div class="goodsItem" @click="goGoodsDeatail('c2c', item.productid)" v-for="(item,index) in subjectOneList" :key="index">
          <div class="picBox"><img :src="item.pic + '?c=' + timestamp" alt=""></div>
          <div class="name ellipsis-2">{{item.productname}}</div>
          <div class="price flex flex-aic"><i></i><span>{{item.price}}</span></div>
        </div>
      </div>
      <!-- 必BUY种草单品 top1 top2 top3-->
      <img :src="'//files.eyee.com/mcdn/img/card/subject_two.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'o5DcPTR9')" :src="'//files.eyee.com/mcdn/img/card/subject_two_top1.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'kyX6e702')" :src="'//files.eyee.com/mcdn/img/card/subject_two_top2.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'R3auaP3w')" :src="'//files.eyee.com/mcdn/img/card/subject_two_top3.png' + '?c=' + timestamp" alt="">
      <!-- 对应商品 b2c-->
      <div class="goodsList" v-if="subjectTwoBList && subjectTwoBList.length > 0">
        <div class="goodsItem" @click="goGoodsDeatail('b2c', item.productid)" v-for="(item,index) in subjectTwoBList" :key="index">
          <div class="picBox"><img :src="item.pic + '?c=' + timestamp" alt=""></div>
          <div class="name ellipsis-2">{{item.productname}}</div>
          <div class="price flex flex-aic"><i></i><span>{{item.price}}</span></div>
        </div>
      </div>
      <!-- 对应商品 c2c-->
      <div class="goodsList" v-if="subjectTwoCList && subjectTwoCList.length > 0">
        <div class="goodsItem" @click="goGoodsDeatail('c2c', item.productid)" v-for="(item,index) in subjectTwoCList" :key="index">
          <div class="picBox"><img :src="item.pic + '?c=' + timestamp" alt=""></div>
          <div class="name ellipsis-2">{{item.productname}}</div>
          <div class="price flex flex-aic"><i></i><span>{{item.price}}</span></div>
        </div>
      </div>
      <!-- 春节把潮带回家 top1 top2-->
      <img :src="'//files.eyee.com/mcdn/img/card/subject_three.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'wa0P8tBp')" :src="'//files.eyee.com/mcdn/img/card/subject_three_top1.png' + '?c=' + timestamp" alt="">
      <img @click="goGoodsDeatail('c2c', 'ZbPfXgmK')" :src="'//files.eyee.com/mcdn/img/card/subject_three_top2.png' + '?c=' + timestamp" alt="">
      <!-- 对应商品 c2c-->
      <div class="goodsList" v-if="subjectThreeCList && subjectThreeCList.length > 0">
        <div class="goodsItem" @click="goGoodsDeatail('c2c', item.productid)" v-for="(item,index) in subjectThreeCList" :key="index">
          <div class="picBox"><img :src="item.pic + '?c=' + timestamp" alt=""></div>
          <div class="name ellipsis-2">{{item.productname}}</div>
          <div class="price flex flex-aic"><i></i><span>{{item.price}}</span></div>
        </div>
      </div>
      <!-- 对应商品 b2c-->
      <div class="goodsList" v-if="subjectThreeBList && subjectThreeBList.length > 0">
        <div class="goodsItem" @click="goGoodsDeatail('b2c', item.productid)" v-for="(item,index) in subjectThreeBList" :key="index">
          <div class="picBox"><img :src="item.pic + '?c=' + timestamp" alt=""></div>
          <div class="name ellipsis-2">{{item.productname}}</div>
          <div class="price flex flex-aic"><i></i><span>{{item.price}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const productIds = {
  subjectOne: [
    "sbRlwG0f",
    "CNcyWqow",
    "vdHFigco",
    "oSRisPLN",
    "NJMh1SRt",
    "R9TjpqBJ",
    "H6oetbhw",
    "vXvK1FeI",
    "ibKImDrG",
    "I2bfulea",
    "4g07y6QL",
    "wK2vQ9U9",
    "hX62kfQo",
    "cg44rrIe",
    "UEQuSGh7",
    "7VJmauwj",
    "2RmUVrSo",
    "KDaYAZ9l",
    "qpoP8OAt",
    "l1x1GcgG"
  ],
  subjectTwoB: [
    "bdb2bbeac18f446aba3e2edf386f597b",
    "998f6f874eb246d3b1c2760494e50547",
    "51a284c6ecd249dbb7043dea6c63d4d4",
    "1b6180c1270145228c742b8a2191d404",
    "de4f2b8fb9fc4f719ce364998d099a8e",
    "c068aba497b44be79500601aa21fd6c6",
  ],
  subjectTwoC : [
    "jrRqI0Do",
    "4Z9kAkeO",
    "AZci4Gjf",
    "urmmxqT6",
    "pYaNvsZ7",
    "nWhCYoKL",
    "Pt9Qpxkb",
    "8ezCf4UT",
    "IF6AcNq4",
    "yklW0m9u",
    "K8szZhFu",
    "qvnp9Eff",
    "hXYinsNN",
    "so9tNIJ3",
    "k1V7mrgH",
    "1ibZZzxs",
    "POCoAcJZ",
    "W0WsxhdN",
    "n4NWMiJm",
    "u1d2DlNK",
  ],
  subjectThreeC: [
    "QKycP6BR",
    "HRvwMEKQ",
    "Xgxdrf8G",
    "6iew1gev",
    "BZ2gXsFD",
    "UKwatirB",
    "1irbdBJ5",
    "y1OEd7uS",
    "ZMTXV7Px",
    "BUA6EcXN",
    "zhqWf8ww",
    "VuCZVqRv",
    "OTJmGy6c",
    "Ss1v8LOS",
  ],
  subjectThreeB: [
    "b439d5531b01493a84e1d4af531bac3a",
    "ef7c5a01fa2d453696aae0d3cb318d35",
    "c04c41442eca429681e62769d336140f",
    "cac5bb59bd6e40d9962492116cb08db6",
    "3d18a22d0ead4b95b42023eb0ee9c636",
    "f719f1677ca748498261be089e982aef",
  ]
};
import { CargoList, GetByCdkey } from "@/common/api/active.js";
export default {
  data() {
    return {
      subjectOneList: [],
      subjectTwoCList: [],
      subjectTwoBList: [],
      subjectThreeCList: [],
      subjectThreeBList: [],
      timestamp: '', //当前时间戳
      cdkey: '', // 礼包兑换码
    };
  },
  beforeCreate: function() {
    document.body.classList.add("add_bg");
  },
  beforeDestroy: function() {
    document.body.classList.remove("add_bg");
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    }
  },
  components: { 
    
  },
  mounted() {
    let _ = this
    // 获取当前时间戳 放到图片后面 防止图片缓存
    _.timestamp = new Date().getTime()
    console.log('获取当前时间戳', _.timestamp)
    // 获取路由上参数 礼包兑换码
    _.cdkey = _.$route.query.cdkey || ''
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json).then( res => {
          _.getAjcardIndex();
        })
      } else _.toast("获取登录信息失败~");
    }
    //判断用户是否在APP或者小程序登录  _.$root.loging
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
        })
        .catch(e => {
          
        });
    } else {

    }
    if (!_.$root.ISAPP && !_.$root.ISMP) {
      _.confirm({
          msg: "请在【斗牛DoNew】APP内操作?",
          okText: "立即前往",
          cancelBtn: 1,
          ok: () => {
            _.openAppClient();
            setTimeout(() => {
              _.$router.replace("/loadapp");
            }, 800);
          }
      });
    }
    return _.getList("subjectOne", productIds.subjectOne.join(","))
    .then(skirts => {
      return _.getList("subjectTwoB", productIds.subjectTwoB.join(","));
    })
    .then(skirts => {
      return _.getList("subjectTwoC", productIds.subjectTwoC.join(","));
    })
    .then(trous => {
      return _.getList("subjectThreeC", productIds.subjectThreeC.join(","));
    })
    .then(trous => {
      return _.getList("subjectThreeB", productIds.subjectThreeB.join(","));
    })
    .catch(() => {
      console.log("获取列表失败");
    });

    
  },
  methods: {
    getList(type, ids) {
      return new Promise((resolve, reject) => {
        CargoList({ ids: ids })
          .then(res => {
            console.log(type + "--->>", res);
            resolve(res);
            if(res && res.length > 0) {
              res.forEach( val => {
                if(val.mainpic) {
                  val.pic = val.mainpic.split('|')[0]
                }
              })
            }
            if (type == "subjectOne") {
              this.subjectOneList = res;
            } else if (type == "subjectTwoC") {
              this.subjectTwoCList = res;
            } else if (type == "subjectTwoB") {
              this.subjectTwoBList = res;
            } else if (type == "subjectThreeC") {
              this.subjectThreeCList = res;
            } else if (type == "subjectThreeB") {
              this.subjectThreeBList = res;
            }
          })
          .catch(err => {
            reject(err);
            console.log(err);
          });
      });
    },
    goGoodsDeatail(type, productid) {
      let _ = this
      // App内
      // H5跳转到APP的C2C商品详情页  gotoAppSneakerDetailPage  productid
      // H5跳转到APP的B2C商品详情页  gotoAppProductDetailPage  productid
      console.log(type, productid)
      if (_.$root.ISAPP) { //app
        if(type == 'c2c') {
          _.javascriptBridge({
            name: "gotoAppSneakerDetailPage",
            params: { productid }
          });
        } else if(type == 'b2c') {
          _.javascriptBridge({
            name: "gotoAppProductDetailPage",
            params: { productid }
          });
        }
        
      } else if(_.$root.ISMP) { //小程序
        if(type == 'b2c') {
          wx.miniProgram.navigateTo({
            url: "/pages/product/detail?id=" + productid
          });
        } else if(type == 'c2c') {
          _.confirm({
            title: "温馨提示",
            msg: "该商品仅支持在【斗牛APP】内查看",
            okText: "确认",
            cancelBtn: 1,
            ok: () => {
              
            }
          })
        }
        
      }

    },
    getCoupom() {
      let _ = this
      if(_.notloged) { // 未登录
        _.loginConfirm()
      } else {
        if(!_.cdkey) {
          _.toast('优惠券已抢完！')
        } else {
          GetByCdkey({cdkey: _.cdkey}).then( res => {
            _.toast('领取成功！')
          }).catch( e => {
            _.toast((e && e.msg) || "")
          })
        }
        
      }
    },
    // 提醒登录函数
    loginConfirm() {
      let _ = this
      _.confirm({
        title: "登录提示",
        msg: "请登录后重试~",
        okText: "前往登录",
        cancelText: "容我想想",
        ok: () => {
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "callbacklogin" }
            });
          } else if (_.$root.ISMP) {
            wx.miniProgram.navigateTo({
              url: "/pages/other/bind"
            });
          }
        }
      })
    }
    
  }
};
</script>
<style lang="scss" scoped>
.mainPlace{
  background: #0F2132;
  min-height: 100vh;
  img{
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
  }
}
.goodsList{
  padding: 2.4vw 7.0667vw 0.2667vw;
  display: flex;
  flex-wrap: wrap;
  .goodsItem{
    width: 41.7333vw;
    height: 58.6667vw;
    background: url('//files.eyee.com/mcdn/img/card/goods_bg.png') 0 0 no-repeat;
    background-size: 100% 100%;
    padding: 5.2vw 4.6667vw 5.3333vw 3.7333vw;
    margin-bottom: 2.4vw;
    margin-right: 2.4vw;
    &:nth-child(2n) {
      margin-right: 0;
    }
    .picBox{
      width: 100%;
      height: 29.3333vw;
      position: relative;
      overflow: hidden;
      margin-bottom: 0.93335vw;
      img{
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .name{
      color: #fff;
      height: 7vw;
      line-height: 3.6vw;
      font-size: 12px;
      padding: 0 1.3333vw 0 1.0667vw;
      margin-bottom: 0.93335vw;
    }
    .price{
      padding-left: 1.3333vw;
      height: 9.6vw;
      i{
        display: block;
        width: 2.9333vw;
        height: 5.3333vw;
        background: url('//files.eyee.com/mcdn/img/card/rmb.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      span{
        color: #000;
        font-family: "OswaldBold";
        font-size: 6.9333vw;
      }
    }
  }
}
.couponBox{
  width: 100%;
  height: auto;
  position: relative;
  img{
    display: block;
    width: 100%;
    height: auto;
  }
  .getBtn{
    width: 54.6667vw;
    height: 14.4vw;
    background: url('//files.eyee.com/mcdn/img/card/getBtn.png') 0 0 no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 70.1333vw;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>