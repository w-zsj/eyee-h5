<template>
    <div>
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>助力砍价</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
          <div v-if="hasdata==1">
           <div style="margin:0 auto;display:none;">
             <img v-if='info&&info.share&&info.share.icon' :src="info.share.icon" />
           </div>
            <broadcast :bannertype='false'></broadcast>
          <div class="group_product_list">
                <div class="headerImgUrl">
                    <div class="img">
                      <img :src="info.imageurl" alt="">
                    </div>
                    <div class="useinfo">
                      <span class="username ellipsis">{{info.username}}</span>
                      <span class="ellipsis">我在斗牛发现一个非常赞的商品，快来帮我助力吧，感谢感谢~</span>
                    </div>
                    <div class="rule" @click.stop="regulation">
                      活动规则
                    </div>
                </div>
                <div class="productItem">
                  <div  class="ImgWrap" @click.stop="productDetail(info.productid)">
                    <img  :src="info.productimageurl" alt="">
                    </div>
                    <div  class="textWrap" @click.stop="productDetail(info.productid)">
                      <div  class="product_names">
                        <!-- <p  class="ellipsis brand_name">{{info.brandname}}</p> -->
                        <p class="ellipsis product_name">{{info.productname}}</p>
                          <p  class="ellipsis business_name">
                            <i :class="typeClass"></i>{{info.businessname}}</p> 
                          <p class="pin"><span  class="pnu">{{info.cutsuccesscount}}人成功助力</span> </p>
                          <p  class="ellipsis product_price font-price" style="text-align: left; padding: 0px;">
                            <i class="miaoshu">可砍至</i> <span> ¥{{info.minprice|tofixed}}</span> 
                            <span class="gui">¥{{info.salemoney|tofixed}}</span>
                          </p>
                          </div>
                        </div>
                      <!-- <div  class="gototuan" @click.stop="getProductOptions(groupItem.pid)"><div class="goContent"><span>邀请助力</span></div></div> -->
                </div>
            </div>
            <!-- <button @click="friendCut(1)">测试</button> -->
          <!-- 立即购买 y邀请助理 -->
          <div class="userself">
            <div class="cutDetail" v-if="!cutsuccessfail">
                <div class="cutDetail_price">已砍
                  <i>{{info.cutcountmoney|tofixed}}</i>元,&nbsp;&nbsp;还可助力<i>
                    {{poormoney}}
                  </i> 元
                </div>
                <div class="progress_bar">
                  <span :style="{'width':progress}"></span>
                </div>
                <div class="cutDetail_buy" v-if="userself">
                  <span @click.stop="buyNow" class="now_buy">立即购买 &nbsp;
                    {{(info.salemoney -info.cutcountmoney)|tofixed}} 元
                  </span>
                  <span @click.stop="shareUrl()" class="invite">邀请好友助力</span>
                </div>
                <!-- // 分享好友显示 -->
                <div  v-if="!userself">
                    <div class="cutDetail_buy share_cutDetail_buy" @click.stop="friendCut(1)" v-if="friendcuttype==1">
                      <span>使出独门绝技,助TA一臂之力!</span>
                    </div>
                    <div class="cutDetail_buy share_cutDetail_buy" @click.stop="friendCut(2)" v-if="friendcuttype==2">
                      <span>我也想要</span>
                    </div>
                </div>
                <div class="count_down" v-if="userself&&timeData.m>=0">
                  还剩 <i>{{timeData.H<10&&timeData.H>=0?'0'+timeData.H:timeData.H}}:{{timeData.m<10&&timeData.m>=0?'0'+timeData.m:timeData.m}}:{{timeData.s<10&&timeData.s>=0?'0'+timeData.s:timeData.s}}</i> 结束，考验你友情的时候到了...
                </div>
            </div>
            
            <div class="shareCutBg" v-if="cutsuccessfail">
                <div v-if='!cutfail' class="cutsuccessBg">
                  <img src="/static/img/cutbg.png" alt="">
                </div>
                <div v-if='cutfail'  class="cutsuccessBg">
                  <img src="/static/img/cutbgfail.png" alt="">
                </div>
                <!-- 自己看成 砍价成功的状态 -->
                <div class="" v-if="userself">
                    <!-- 助力失败 -->
                  <span v-if="cutfail&&!cutsucess">伤心,助力失败了~</span>
                  <div  v-if="cutfail&&!cutsucess" class="shareMyBuy" @click.stop="getProductOptions(1)">重新助力</div>  
                  <!-- 助力成功代付款 -->
                  <span v-if="!cutfail&&!cutsucess">哇,你们太给力了!已经助力成功啦~</span>
                  <div  v-if="!cutfail&&!cutsucess" class="shareMyBuy" @click.stop="getProductOptions(2)">立即付款</div>
                  <div class="count_down" v-if="!cutfail&&!cutsucess">
                  剩余购买时间:  <i>{{timeData.H<10&&timeData.H>=0?'0'+timeData.H:timeData.H}}:{{timeData.m<10&&timeData.m>=0?'0'+timeData.m:timeData.m}}:{{timeData.s<10&&timeData.s>=0?'0'+timeData.s:timeData.s}}</i> 
                  </div>
                  <!-- 支付成功了 助力成功 -->
                  <span v-if="cutsucess">哇,你们太给力了!已经助力成功啦~</span>
                  <div  v-if="cutsucess" class="shareMyBuy" @click.stop="getProductOptions(1)">重新助力</div>  
                </div>

                <!-- 好友看到的 -->
                <div v-if="!userself">
                  <!-- 好友助力失败 -->
                  <span v-if="cutfail">伤心,助力失败了~</span>
                  <!-- 好友助力成功 -->
                  <span v-if="!cutfail">哇,你们太给力了!已经助力成功啦~</span>
                  <div class="shareMyBuy" @click.stop="friendBuy">
                    我也想要
                  </div>
                </div>
              
            </div>
          </div>
      
            <!-- 弹框 -->
            <!-- <button @click.stop="getProductOptions(1)">重新助力</button> -->
            <!-- 我也想要的选择规格 -->
            <product-items :show="css.showItems" :helpType="true" :product-info="realInfo" @close='itemsClose'></product-items>
            <div class="bg" v-if="confirmAdress || confirmAdress" @click.stop="close"></div>
            <div class="confirmAdress" v-if="confirmAdress">
              <p class="title">请确认收货地址</p>
              <div class="addressName">
                  <span>{{userDefaultAddress.receiver}},</span> <span>{{userDefaultAddress.mobile}}</span>
              </div>
              <p class="dizhi">{{userDefaultAddress.address}}</p>
              <div class="cut_btn">
                    <span @click.stop="close">取消</span>
                    <span @click.stop="cutBegain()">确认</span>
                </div>
            </div>
            <!-- 弹框 -->
            <model v-if="cutGoingFail" :showBtn='showBtn' :cutText='cutText' :modelBgClassBG='modelBgClassBG' @close='close'></model>
            <!-- 好友助力列表 -->
          <div class="friendDetail">
            <div class="title"><span>好友助力详情</span></div>
            <div v-if="!nocut">
                <ul>
                  <li v-for="(item,index) in cutproductInfo" :key="index" v-if="index<friendCutListIndex">
                      <div class="friendDetail_img">
                        <img :src="item.imageurl" alt="">
                      </div>
                      <div class="friendDetail_name">{{item.username}}</div>
                      <div class="friendDetail_price">{{item.cutmoney | tofixed}}元</div>
                  </li>
                </ul>
                <div class="more" @click.stop="friendCutListMore(1)" v-if="cutproductInfo.length>4&&friednsmore">
                  查看更多
                </div>
                <div class="more" :class="{'pullmore':!friednsmore}" @click.stop="friendCutListMore(2)" v-if="cutproductInfo.length>4&&!friednsmore">
                  点击收起
                </div>
            </div>
            <div class="noCut" v-if="nocut">
              很遗憾,还没有好友为你助力砍价哟~
            </div>
          </div>
          <v-list  :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' class="prodAlls">
              <div class="wrap-content">
                <div class="title"><span>为你推荐</span></div>
                  <div class="recommend">
                    <!-- {{productinfo}} -->
                      <div class="recommend-content" v-for="(item,ind) in productinfo" :key="ind" @click.stop="productDetail(item.productid)">
                        <img :src="item.productimageurl" alt="">
                        <div class="introduce">
                            <p>￥{{item.minprice | tofixed}}&nbsp;&nbsp; <span>￥{{item.saleprice | tofixed}}</span></p>
                            <p class="ellipsis ">{{item.productname}}</p>
                            <!-- <i :class="item.businesstype===1?'ico-sp-official':item.businesstype===2?'ico-sp-buy':'ico-sp-store'"></i> -->
                            <!-- <i :class="groupItem.businesstype===1?'ico-sp-official':groupItem.businesstype===2?'ico-sp-buy':'ico-sp-store'"></i>{{groupItem.businessname}}</p>  -->
                            <!-- <p>{{item.businessname}}</p></p> -->
                        </div>
                      </div>
                      
                  </div>
                  <!-- <ProductUnit v-for="(item,index) in productLists" :key='index' :productItem='item' class="productList" ></ProductUnit> -->
              </div>
          </v-list>
          <!-- <div v-else class="wait-list-tpl"></div> -->
        
          <!-- //分享提示框 -->
          <div class="share" v-if="isShare" @click.stop="cancel()">
            <div class="shareIcon">
              <img src="/static/img/h5shareIcon.png" alt="">
              <img src="/static/img/h5shareiconknow.png" alt="">
            </div>
          </div>
        </div>
          <div class="no_cut" v-if='hasdata==0'>
            <span>暂无数据~</span>
          </div>
        <!-- <div v-if="hasdata==0">暂无数据</div> -->
    </div>
</template>
<script>
import { NewDetail } from "../../common/api/product";
import { DateDiff, _getDate } from "../../common/util";
import { AntiBrush } from "../../common/anti-brush";
import { mapGetters } from "vuex";
import ProductUnit from "../templates/ProductUnit";
import ProductItems from "@/comps/ProductItems";
import {
  CutUserProductDetail,
  CutUserProductDetailOpen,
  StartCut,
  // FriendCut,
  ValidFriendCut,
  FriendCutList,
  GetCutProductListOpen
} from "../../common/api/bargain";
import broadcast from "./broadcast.vue";
import cutaddress from "../user/Address.vue";
import model from "./helppopmodel.vue";
import { getUrlParam } from "../../common/util.js";
// var vConsole = new VConsole();
export default {
  data() {
    return {
      css: {
        showItems: false
      },
      typeClass: "ico-sp-official",
      isEnd: false,
      hasdata: 1,
      isLoading: false,
      cutGoingFail: false,
      showBtn: 1,
      cutText: "",
      modelBgClassBG: "", // cutgoing进行中  cutOver来晚了活动结束 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
      productList: [],
      isShare: false,
      productinfo: [],
      nocut: false,
      cutsuccessfail: false,
      cutfail: false,
      cutsucess: false,
      confirmAdress: false,
      countDown: "0",
      timeRun: null,
      progress: "0",
      pagination: {
        sumcount: 0,
        pagesize: 5,
        pageindex: 1,
        hasLoad: true
      },
      shareinfo: {},
      appShare: {},
      info: {},
      productInfoGroupItems: {},
      itemsCloseItem: {}, // 颜色规格我
      friendCutList: [], //好友助力列表
      friendCutListIndex: 4,
      friednsmore: true,
      friendcuttype: 1,
      userself: false,
      timeData: {},
      clearTime: null
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      productLists: "productLists",
      userDefaultAddress: "userDefaultAddress",
      userInfo: "userInfo"
    }),
    realInfo() {
      let info =
        (this.productInfoGroupItems && this.productInfoGroupItems.info) || {};
      info.productid = info.id;
      return info;
    },
    cutproductInfo() {
      return this.friendCutList;
    },
    poormoney() {
      let poormoney = this.info;
      return (
        parseFloat((poormoney.salemoney - poormoney.cutcountmoney).toFixed(2)) -
        poormoney.minprice
      ).toFixed(2);
    }
  },
  components: { ProductUnit, broadcast, cutaddress, model, ProductItems },
  created() {
    if (this.$root.ISAPP) {
      let param = getUrlParam("param");
      param = JSON.parse(decodeURIComponent(param));
      // alert(JSON.stringify(param))
      if (param.token) {
        localStorage.setItem("currentUser", JSON.stringify(param));
      }
    }
  },
  mounted() {
    this.req();

    // this.cutText = " 当前商品正在助力中,<br>快去邀请更多好友来助力吧!";
    // this.modelBgClassBG = "cutgoing";
    // this.showBtn = 5;
    // this.cutGoingFail = true;
    // console.log(this.productinfo, "llll");
    this.HelpUserProductDetail(); // 详情接口

    //发起助力参数
    if (this.$store.state.user.cutType) {
      this.confirmAdress = true;
    }
  },
  methods: {
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      // console.log("time", this.timeData, time, type);
      // console.log(this.timeData.H, this.timeData.m, this.timeData.s);
      if (
        this.timeData.H === 0 &&
        this.timeData.m === 0 &&
        this.timeData.s === 0
      ) {
        // window.location.reload();
        // this.HelpUserProductDetail()
        clearInterval(this.clearTime);
      }

      if (this.timeData.m < 0) {
        this.timeData.H = 0;
        this.timeData.m = 0;
        this.timeData.s = 0;
        return;
      }
    },
    _preventDefault(e) {
      e.preventDefault();
    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(function() {
        _.countdownTime(time, type);
      }, 1000);
    },
    productDetail(id) {
      if (this.$root.ISAPP) {
        // 跳app商品详情
        let appinteractionproductDetail = {
          name: "gotoAppProductDetailPage",
          params: { productid: id }
        };
        this.javascriptBridge(appinteractionproductDetail);
      } else {
        this.$router.push("/productDetail/" + id);
      }
      // this.$router.push("/productDetail/" + id);
    },
    HelpUserProductDetail() {
      let cutid = this.$route.params.id;
      let CutUserProductDetailApi = this.userInfo.token
        ? CutUserProductDetail
        : CutUserProductDetailOpen;
      CutUserProductDetailApi({ cutid: cutid })
        .then(res => {
          if (res) {
            this.hasdata = 1;
            this.friendList(); //好友助力列表
            this.info = res;
            // 判断是否是当前用户
            if (this.userInfo.uid == res.userid || this.$root.ISAPP) {
              // alert(this.userInfo.uid)
              this.userself = true;
            } else {
              this.userself = false;
              // 0 未砍过 1 已砍过
              if (res.helpstatus == 1) this.friendcuttype = 2;
              else this.friendcuttype = 1;
            }

            this.progress =
              res.cutcountmoney / (res.salemoney - res.minprice) * 100 + "%";
            // "status","int 活动状态",# 0 失败 1 助力中 2 代付款 3 助力成功
            // cutsuccessfail:false,
            // cutfail:false,

            switch (res.status) {
              case 0:
                this.cutsuccessfail = true;
                this.cutfail = true;
                this.cutsucess = false;
                break;
              case 1:
                this.cutsuccessfail = false;
                this.cutfail = false;
                this.cutsucess = false;
                break;
              case 2:
                this.cutsuccessfail = true;
                this.cutfail = false;
                this.cutsucess = false;
                break;
              case 3:
                this.cutsuccessfail = true;
                // this.cutfail = false;
                this.cutsucess = true;
                break;
            }
            let share = res.share;
            this.shareinfo.title = share.title;
            // this.shareinfo.url = share.url;

            this.shareinfo.desc = share.content;
            this.shareinfo.img = share.icon;
            // app 分享信息
            this.appShare.sharecontent = share.content;
            this.appShare.sharetitle = share.title;
            this.appShare.sharepicurl = share.icon;
            this.appShare.shareurl = share.url;
            this.appShare.xcxurl = share.xcxurl || "";

            this.appShare.callbackname = "";
            // alert(share.icon+'!c30')
            this.initShare({
              info: {
                title: share.title,
                img: share.icon + "!c30",
                desc: share.content,
                url: share.url
              }
            });
            // if (this.shareinfo.url) {
            //   this.initShare({ type: 1,info: this.shareinfo });
            // }

            if (this.$store.state.user.cutToastShare && this.$root.ISWX) {
              this.shareUrl();
            }
            if (this.$root.ISAPP) {
              this.javascriptBridge({
                name: "getAppActivityShareContent",
                params: this.appShare
              });
            }
            console.log("助力详情数据", this.info);
            if (
              (res.status === 1 && res.endtime) ||
              (res.payexpiretime && res.status === 2)
            ) {
              let time = res.status == 2 ? res.payexpiretime : res.endtime;
              // time = time.replace("-", "/");
              this.setentime(time, "H"); //倒计时
            }
          } else {
            this.hasdata = 0;
          }
          // console.log(res, "助力详情")
        })
        .catch(err => {
          if (err.code != 1511200) {
            this.hasdata = 0;
            console.error(err);
          }
        });
    },
    shareUrl() {
      // alert(JSON.stringify(this.shareinfo))

      if (this.$root.ISAPP) {
        // let appShare = {};
        // alert(JSON.stringify(this.appShareParams));

        this.javascriptBridge({
          name: "callAppShareDialog",
          params: this.appShare
        });
      } else {
        this.initShare({ info: this.shareinfo });
        this.isShare = true;
      }

      this.$store.state.user.cutToastShare = false;
    },
    cancel() {
      this.isShare = false;
    },
    getProductOptions(type) {
      // 重新助力和 助力成功 立即购买的情况
      if (type === 1) {
        // 重新助力
        let id = this.info.productid;
        this.friendBuy();
        // NewDetail(id)
        //   .then(res => {
        //     // console.log("颜色规格：zs", res);
        //     this.css.showItems = true;
        //     this.productInfoGroupItems = res;
        //   })
        //   .catch(e => {
        //     console.error(e);
        //   });
      } else {
        // 立即购买
        let orderno = this.info.orderno;

        if (orderno) {
          if (this.$root.ISAPP) {
            // this.toast("跳app支付");
            this.javascriptBridge({
              name: "callAppPaymentPage",
              params: { orderid: orderno }
            });
            return;
          }
          let url = "/pay/" + orderno;
          if (this.insq) url = `/frame/${encodeURIComponent(url)}`;
          this.$router.push(url);
        } else {
          this.toast("订单号不存在");
        }
      }
    },
    cutBegain() {
      //发起助力参数
      this.itemsCloseItem = JSON.parse(localStorage.getItem("helphand"));
      //  alert(this.itemsCloseItem.businessid)
      if (
        this.itemsCloseItem &&
        this.userDefaultAddress &&
        this.$store.state.user.cutType
      ) {
        console.log(this.$store.state.user.cutType, "kkk");
        let option = {};
        option = {
          useraddressid: this.userDefaultAddress.addressid,
          businesscutid: this.info.businesscutid,
          productitemid: this.itemsCloseItem.productitemid,
          productname: this.itemsCloseItem.productname
        };
        //弹框  确认收货地址

        const failModal = () => {
          this.cutText = "助力失败,<br>去看看其他商品吧~";
          this.modelBgClassBG = "cutFail";
          this.showBtn = 1;
          this.cutGoingFail = true;
          this.$store.state.user.cutType = false;
          this.confirmAdress = false;
        };

        StartCut(option)
          .then(res => {
            if (res.flag) {
              localStorage.removeItem("helphand");
              this.$store.state.user.cutType = false;
              this.cutGoingFail = false;
              this.confirmAdress = false;
              this.$router.replace("/helpbargain/helpdetail/" + res.cutuserid);
              setTimeout(function() {
                window.location.reload();
              }, 500);
            } else failModal();
          })
          .catch(err => {
            console.error("StartCut error：", err);
            failModal();
          });
      }
    },
    itemsClose(item) {
      // 颜色规格回传
      sessionStorage.removeItem("cuttype");
      // console.log("item", item);
      this.css.showItems = false;
      let that = this;
      document.body.style.overflow = "auto";
      window.removeEventListener("touchmove", that._preventDefault);
      if (item) {
        localStorage.setItem("helphand", JSON.stringify(item));
        this.$router.push({
          path: "/user/address",
          query: { cutType: 1 }
        });
      }
    },
    buyNow() {
      var item = this.info;
      // 收货地址
      let address = {
        address: item.address,
        addressid: item.useraddressid,
        country: item.country,
        idcard: "",
        isdefault: true,
        mobile: item.mobile,
        receiver: item.receiver
      };
      this.$store.dispatch("setDefaultAddress", address);
      if (this.insq) {
        // price 有活動 specialprice 沒有活動 saleprice
        // console.log("dd", item);

        item.saleprice = parseFloat(
          (item.salemoney - item.cutcountmoney).toFixed(2)
        );
        item.specialprice = parseFloat(
          (item.salemoney - item.cutcountmoney).toFixed(2)
        ); // 原價 - 已砍甲哥
        item.isok = true;
        item.cutparamsType = true;
        item.cuttingid = item.id;
        item.checked = true;
        item.cutid = item.id;
        item.count = 1;
        item.contentid = "";
        item.isexpressfree = false;
        item.tariffmoney = 0;
        item.colorimg = item.productimageurl;
        item.salemoneytotal = item.salemoney;
        item.cutSurplusPrice = item.minprice;
        item.productitemid = item.productitemid;
        let tempTotalPrice = item.specialprice;
        let pay = {
          ...item,
          id: item.productid,
          allPay: tempTotalPrice,
          item: [item]
        };
        console.log("助力详情", pay.item, this.info.salemoney);
        let _ = this;
        _.$store.dispatch("setOrderCoupon", {
          canUseCoupon: [],
          unCanUseCoupon: []
        });
        _.$store.state.order.selectedCoupon = {};
        _.$store.dispatch("setOrderOut", { ...pay });
        _.$store.dispatch("setFromeType", 1);
        _.$router.push("/order/checkout");
      } else {
        this.buyparams();
      }
    },
    buyparams() {
      console.log("--buyNow-------------------: ", this.info);
      let _ = this;
      let orderitem = _.info;
      let extendid = null;
      extendid = orderitem.cutingid;
      let productitems = [
        {
          productitemid: orderitem.productitemid, // "商品子项id",
          count: orderitem.count || 1, // "int 数量",
          producttype: orderitem.producttype // "int 商品类型"
          // distributionid: "",
          // parentid: "",
          // prostatus: 1
        }
      ];
      _.$router.push({
        path: "/order/NewCheckout",
        query: {
          productitems: encodeURIComponent(JSON.stringify(productitems)),
          ordertype: 3, //  "int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",
          extendid: extendid //      "扩展id （根据ordertype和producttype决定具体类型的id：例：productid、activityid、teamid、cuttingid)"
        }
      });
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        this.req();
      }
    },
    req() {
      if (this.isLoading) return;
      this.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.isEnd = false;
        window.scrollTo(0, 0);
      }
      // if (this.postData.pageindex == 10) this.isEnd = true;
      GetCutProductListOpen(postParams)
        .then(res => {
          if (res && res.list) {
            this.productinfo.push(...res.list);
            console.log("mall home CategorySearch", this.productinfo);
            if (res.page * res.size >= res.total) this.isEnd = true;
            // this.$store.dispatch("getProductList", res);
          } else {
            if (this.productinfo.length < 1) {
              this.nocut = true;
            }
          }
          this.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.isLoading = false;
          // this.toast(e && e.msg ? e.msg : ('error:' + e));
        });
    },
    close(type) {
      this.cutGoingFail = false;
      if (type == 6) {
        let url = "/pay/" + this.info.orderno;
        if (this.insq) url = `/frame/${encodeURIComponent(url)}`;
        this.$router.push(url);
      } else if (type == 3 || type == 8) {
        this.$router.push("/helpbargain");
      } else if (type == 4) {
        this.friendBuy();
      } else if (type == 5) {
        this.friendCut(1);
      } else if (type == 2) {
        this.$router.replace("/helpbargain/helpdetail/" + this.info.cutingid);
        setTimeout(function() {
          window.location.reload();
        }, 100);
      }

      this.confirmAdress = false;
      this.$store.state.user.cutType = false;
    },
    friendList() {
      let cutid = this.$route.params.id;
      FriendCutList({ cutid: cutid }).then(res => {
        if (res && res.length > 0) {
          // alert(res)
          this.nocut = false;
          this.friendCutList = res;
        } else {
          this.nocut = true;
        }
        console.log("好友助力列表", res);
      });
    },
    friendCutListMore(type) {
      if (type === 1) {
        this.friendCutListIndex = this.friendCutList.length;
        this.friednsmore = false;
      } else {
        this.friendCutListIndex = 4;
        this.friednsmore = true;
      }
    },
    friendCut(type) {
      let _ = this;
      if (!_.userInfo.token && !_.insq) {
        _.$router.push("/login");
        return;
      }
      let c = _.info;
      if (type === 1) {
        if (c.helpstatus == 1) {
          _.cutText =
            "您已达到该商品好友助力的巅峰值了,<br>不可以再为好友助力了呦~";
          _.modelBgClassBG = "cutSuccess";
          _.showBtn = 1;
          _.cutGoingFail = true;
        } else if (c.helpstatus == 2) {
          _.cutText = "您已达到当前活动的助力次数限制<br>去看看其他商品吧~";
          _.modelBgClassBG = "cutSuccess";
          _.showBtn = 1;
          _.cutGoingFail = true;
        } else if (c.helpstatus == 3) {
          // 新人砍
          _.cutText = "这个潮品只可以新注册用户<br>帮忙助力哦~";
          _.modelBgClassBG = "cutNewpeople";
          _.showBtn = 8;
          _.cutGoingFail = true;
        } else {
          // 防刷助力
          AntiBrush({ cutid: _.$route.params.id }, res => {
            if (res) {
              ValidFriendCut(res)
                .then(res => {
                  let cutprice = _.info;
                  if (res.flag) {
                    cutprice.cutcountmoney = res.cutcountmoney;
                    _.cutText = "棒棒哒,你已经成功砍掉¥" + res.cutmoney + "元";
                    _.modelBgClassBG = "cutbg";
                    _.showBtn = 4;
                    _.cutGoingFail = true;
                    _.HelpUserProductDetail();
                    // if (res.cutcountmoney == cutprice.salemoney - cutprice.minprice) {
                    //   _.cutsuccessfail = true;
                    //   _.cutfail = false;
                    // } else {
                    //   cutprice.cutcountmoney = res.cutcountmoney;
                    //   _.friendcuttype = 2;
                    // }
                    // let cutCurrentparams = {
                    //   cutmoney: res.cutmoney,
                    //   imageurl: _.userInfo.imageurl,
                    //   username: cutprice.username
                    // };

                    // _.friendCutList.push(cutCurrentparams);
                    // console.log("cutCurrentparams", _.friendCutList);
                    // console.log(_.friendCutList,cutCurrentparams)
                    // _.HelpUserProductDetail();
                  } else {
                    _.cutText = "助力失败<br>重新邀请好友助力吧~!";
                    _.modelBgClassBG = "cutFail";
                    _.showBtn = 5;
                    _.cutGoingFail = true;
                  }
                })
                .catch(err => {
                  _.cutText = "助力失败<br>重新邀请好友助力吧~!";
                  _.modelBgClassBG = "cutFail";
                  _.showBtn = 5;
                  _.cutGoingFail = true;
                  console.error(err);
                });
            } else _.toast("验证失败了~");
          });
        }
      } else if (type === 2) {
        _.friendBuy();
        // 1. 正在助力中  2. 超过够买次数 提示 好人缘爆棚 3. 正常够买 4. 活动结束 来晚啦 活动结束
      }
    },
    friendBuy() {
      // 我也想要
      let id = this.info.productid;
      // 先判断是否登录
      if (!this.userInfo.token) {
        this.$router.push("/login");
      } else {
        let item = this.info;
        if (!item.isjoin && item.usercutstatus != 0) {
          // this.cutGoing = true;
          switch (item.usercutstatus) {
            case 1:
              this.cutText =
                " 当前商品正在助力中,<br>快去邀请更多好友来助力吧!";
              this.modelBgClassBG = "cutgoing";
              this.showBtn = 2;
              break;
            case 2:
              if (item.quantity < 1) {
                this.toast("来晚了，商品已售罄~");
                return;
              }
              this.cutText = "当前商品您有待付款订单,<br>请先完成支付!";
              this.modelBgClassBG = "gotopay";
              this.showBtn = 6;
              break;
            case 3:
              this.cutText =
                "好人缘爆棚,<br>您已经达到该商品助力的巅峰值,<br>快去看看其他商品吧!";
              this.modelBgClassBG = "cutSuccess";
              this.showBtn = 1;
              break;
            case 5:
              this.cutText = "来晚啦,助力活动已结束,<br>快去看看其他商品吧!";
              this.modelBgClassBG = "cutOver";
              this.showBtn = 1;
              break;
          }

          setTimeout(() => {
            this.cutGoingFail = true;
          }, 0);
        } else {
          sessionStorage.setItem("cuttype", 1);
          NewDetail(id)
            .then(res => {
              // console.log("颜色规格：zs", res);
              this.css.showItems = true;
              // document.documentElement.style.overflow = "hidden";
              let that = this;
              document.body.style.overflow = "hidden";
              window.addEventListener("touchmove", that._preventDefault);
              this.productInfoGroupItems = res;
            })
            .catch(e => {
              console.error(e);
            });
        }
      }
    },
    regulation() {
      // 查看规则
      // alert(this.info.limitcutcount)

      let limt =
        this.info.limitcutcount > 0
          ? ",该商品您每天最多能帮助" + this.info.limitcutcount + "个好友"
          : "";
      this.cutText =
        "<p>1. 选择您喜欢的单品,邀请好友来助力,只要在24小时内砍到最底价就可以用这价格把它带走.</p>" +
        "<p>2. 助力过程中,您也可以随时按照当前被砍掉的金额优惠购买.</p>" +
        "<p>3. 砍到低价后,您需要在24小时内完成支付,助力中途提交的订单需在30分钟内完成支付,否则订单将会自动关闭.</p>" +
        "<p>4. 每次助力金额随机,参与好友越多越容易成功.</p>" +
        "<p>5. 同一个助力,每个好友只能帮忙助力1次" +
        limt +
        ".</p>" +
        "<p>6. 若发现有使用非正常手段参与活动的订单，平台有权利拒绝发货并取消订单，如情况严重会对使用不正常手段参加活动的账号进行封禁处理.</p>" +
        "<p>7. 所有参加助力砍价的商品，若出现一个尺码多人发起助力，在库存不足的情况下，先助力成功的人先得.</p>" +
        "<p>8. 本活动所有解释权归斗牛所有.</p>";
      this.modelBgClassBG = "guize";
      this.showBtn = 7;
      this.cutGoingFail = true;
    }
  }
};
</script>
<style scoped>
.cutAddress-enter-active,
.cutAddress-leave-active {
  transition: opacity 0.3s;
}
.cutAddress-enter,
.cutAddress-leave-to {
  opacity: 0;
}
.cutAddress {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  background: #fff;
  z-index: 103;
}
.cutAddress .title,
.confirmAdress .title {
  text-align: center;
  margin-bottom: -20px;
  margin-top: 20px;
}
.confirmAdress {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  /* height: 216px; */
  padding-bottom: 20px;
  background: #fff;
  border-radius: 5px;
  z-index: 105;
}
.confirmAdress .title {
  margin: 20px;
  font-size: 17px;
}
.addressName,
.dizhi {
  color: #666;
  font-size: 14px;
  padding-left: 20px;
  line-height: 24px;
}

.bg {
  background: rgba(0, 0, 0, 0.5);
  z-index: 101;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.shareCutBg {
  text-align: center;
}
.cutsuccessBg {
  padding: 0 15%;
}
.shareCutBg span {
  font-size: 14px;
  color: #3b3b3b;
}
.shareCutBg .shareMyBuy {
  width: 160px;
  height: 30px;
  color: #333;
  line-height: 30px;
  font-size: 14px;
  border-radius: 3px;
  background: #ffc700;
  margin: 20px auto;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.group_product_list {
  box-shadow: 0px 0px 5px #ccc;
  padding: 8px;
  margin: 10px;
  border-radius: 5px;
  padding-bottom: 5px;
}
.headerImgUrl {
  display: flex;
  position: relative;
  margin-bottom: 20px;
}
.headerImgUrl .img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #ffc700;
  overflow: hidden;
  /* margin-right: 10px; */
}
.headerImgUrl .useinfo {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  align-content: center;
  width: 84%;
}
.headerImgUrl .useinfo span {
  display: block;
  font-size: 12px;
  color: #4b4b4b;
  line-height: 24px;
}
.headerImgUrl .useinfo span.username {
  color: #333;
}
.headerImgUrl .img img {
  display: block;
  width: 100%;
  height: 100%;
}
.headerImgUrl .rule {
  width: 60px;
  height: 20px;
  border: 1px solid #999;
  color: #999;
  font-size: 12px;
  border-radius: 3px;
  line-height: 20px;
  text-align: center;
  position: absolute;
  right: 0%;
  top: 0;
}
.cutDetail {
  text-align: center;
  font-size: 12px;
  color: #333;
  padding: 0 20px;
  margin-top: 15px;
  /* display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center; */
}
.cutDetail .cutDetail_price {
  color: #000;
  font-size: 14px;
  line-height: 24px;
}
.cutDetail .cutDetail_price i {
  font-style: normal;
  color: #ffc700;
  font-size: 18px;
  font-weight: bold;
  padding: 0 3px;
}
.progress_bar {
  /* background: #ddd; */
  height: 5px;
  /* box-shadow: 0px 2px 5px #ccc; */
  position: relative;
  border-radius: 2px;
  margin: 15px 0;
  border: 1px solid #ddd;
}
.progress_bar span {
  /* display: inline-block; */
  background: url("/static/img/bar.png") 0 0 no-repeat;
  background-size: 100% 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.progress_bar span::before {
  content: "";
  position: absolute;
  right: -12px;
  top: -5px;
  background: url("/static/img/bar_header.png") 0 0 no-repeat;
  background-size: 100% 100%;
  width: 14px;
  height: 14px;
}
.cutDetail_buy {
  display: flex;
  justify-content: space-between;
}
.cutDetail_buy span {
  width: 45%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #333;
  font-size: 14px;
  color: #fff;
  border-radius: 5px;
  font-weight: bold;
}
.cutDetail_buy span:nth-child(2) {
  background: #ffc700;
  color: #333;
}
.share_cutDetail_buy span {
  background: #ffc700;
  width: 100%;
  color: #333;
}
.count_down {
  color: #333;
  font-size: 12px;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
}
.count_down i {
  font-style: normal;
  width: 70px;
  font-size: 14px;
  font-weight: bold;
}
.friendDetail {
  box-shadow: 0px 0px 5px #ccc;
  padding: 8px;
  margin: 10px;
  border-radius: 5px;
  text-align: center;
  padding-top: 15px;
}
.title {
  font-size: 14px;
  position: relative;
  color: #4e4e4e;
}
.title span {
  position: relative;
}
.title span::before,
.title span::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  background: #4e4e4e;
  left: -20px;
  top: 6px;
}
.title span::after {
  left: auto;
  right: -20px;
}
.friendDetail ul {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  align-content: center;
}
.friendDetail ul li {
  width: 25%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 15px;
}
.friendDetail ul li .friendDetail_img {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 50%;
  overflow: hidden;
}
.friendDetail ul li .friendDetail_img img {
  width: 100%;
  height: 100%;
}
.friendDetail ul li .friendDetail_name,
.friendDetail ul li .friendDetail_price {
  font-size: 13px;
  color: #4e4e4e;
  line-height: 14px;
  width: 100%;
}
.friendDetail ul li .friendDetail_price {
  font-size: 12px;
}
.friendDetail .more {
  color: #999;
  font-size: 12px;
  margin-bottom: 15px;
  position: relative;
}
.friendDetail .more::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  background: url(/static/img/pullmore.png) 0 0 no-repeat;
  background-size: 60% 60%;
  top: 5px;
  right: 37%;
}
.friendDetail .more.pullmore::after {
  transform: rotate(-180deg);
  top: -2px;
  right: 39%;
}
.noCut {
  color: #999;
  font-size: 15px;
  line-height: 75px;
}
.productItem {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;
  cursor: pointer;
  /* background: #fff; */

  /* margin-bottom: 15px; */
  border-radius: 5px;
  width: 97%;
}
.productItem .ImgWrap {
  position: relative;
  width: 35%;
  /* padding-bottom: 26%; */
  padding-top: 35%;
  overflow: hidden;
}
.ImgWrap img {
  width: 100%;
  /* height: 100%; */
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.productItem .textWrap {
  padding: 10px 0px 10px 15px;
  width: 60%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.productItem .textWrap .product_names {
  width: 100%;
}
.productItem .textWrap .product_names > p {
  text-align: left;
  font-size: 13px;
  color: #333;
  line-height: 20px;
  width: 100%;
}
.product_name {
  counter-reset: #666;
}
.productItem .textWrap p.business_name {
  margin-top: 10px;
}

.productItem .textWrap p.business_name,
.productItem .textWrap p.pin {
  color: #666;
  font-size: 10px;
}

.productItem .textWrap p.product_price {
  font-size: 22px;
  line-height: 24px;
  margin: 10px 0 5px 0;
}
.productItem .textWrap p.product_price .miaoshu {
  font-size: 14px;
  font-style: normal;
  padding-right: 5px;
}

.gototuan {
  position: relative;
  /* overflow: hidden; */
  width: 20%;
}
.gototuan .goContent {
  position: absolute;
  bottom: 10px;
  top: auto;
}
.gototuan span {
  background: #ffc700;
  font-size: 12px;
  color: #333333;
  padding: 2px 6px;
  border-radius: 3px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.wrap-content {
  padding: 0 1%;
  text-align: center;
  margin-top: 40px;
}
.wrap-content .title {
  margin-bottom: 20px;
}
.productList {
  width: 48%;
  box-sizing: border-box;
  display: inline-block;
  margin: 1%;
  text-align: center;
}
.share {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.share .shareIcon {
  position: absolute;
  top: 0;
  right: 25px;
  text-align: right;
}
.shareIcon img {
  width: 50%;
}
/* .cutinfo {
  width: 275px;
  height: 280px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("/static/img/cutgoing.png") 0 0 no-repeat;
  background-size: 100% 100%;
  text-align: center;
  font-size: 14px;
  color: #333;
  border-radius: 10px;
  z-index: 102;
  line-height: 25px;
}
.cutinfo .cut_name {
  margin-top: 145px;
} */
.cutinfo .cut_btn,
.confirmAdress .cut_btn {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.cutinfo .cut_btn span,
.confirmAdress .cut_btn span {
  width: 46%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #ffc700;
  background: #ffc700;
  border-radius: 5px;
  color: #333;
}
.confirmAdress .cut_btn span {
  text-align: center;
}
.confirmAdress .cut_btn span:nth-child(1) {
  color: #999;
  background: none;
  border: 1px solid #ccc;
}
.recommend {
  /* padding: 0 1%; */
  display: flex;
  flex-wrap: wrap;
}
.recommend-content {
  width: 48%;
  margin: 0 1%;
  margin-bottom: 10px;
}
.introduce {
  text-align: left;
  font-size: 12px;
  color: #333;
  font-family: BASE_PRICE;
}
.introduce p:nth-child(1) {
  font-weight: bold;
}
.introduce p span {
  color: #999;
  text-decoration: line-through;
}
/* .introduce p:nth-child(2) {
  font-weight: bold;
  font-size: 10px;
} */
.introduce p.store {
  color: #a5a5a5;
}
.no_cut {
  position: relative;
  width: 80%;
  height: 0;
  left: 10%;
  text-align: center;
  padding-top: 60%;
  background: url("/static/img/cutdefaultbg.png") 0 0 no-repeat;
  background-size: 100% auto;
  text-align: center;
}
/* .no_cut span {
  position: absolute;
  bottom: -30px;
  left: 10px;
} */
</style>


