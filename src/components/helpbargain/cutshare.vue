<template>
    <div>
        <v-header>
            <div class="nav-tab2">
                <h3>助力砍价</h3>
            </div>
            <v-cart :isshow="true" :isdark="true"></v-cart>
        </v-header>
        <broadcast :bannertype='false'></broadcast>
        
        <div class="group_product_list">
              <div class="headerImgUrl">
                  <div class="img">
                    <img src="/static/img/girl.png" alt="">
                  </div>
                  <div class="useinfo">
                    <span class="username">{{CutUserProductDetailInfo.username}}</span>
                    <span class="ellipsis">{{CutUserProductDetailInfo.content}}</span>
                  </div>
                  <div class="rule">
                    活动规则
                  </div>
              </div>
              <div class="productItem">
                 <div  class="ImgWrap" @click.stop="productDetail()">
                   <img  :src="CutUserProductDetailInfo.imageurl" alt="">
                  </div>
                  <div  class="textWrap" @click.stop="productDetail()">
                    <div  class="product_names">
                      <p  class="ellipsis brand_name">{{CutUserProductDetailInfo.businessname}}</p>
                       <p class="ellipsis product_name">{{CutUserProductDetailInfo.productname}}</p>
                        <p  class="ellipsis business_name">
                          <i :class="typeClass"></i>{{CutUserProductDetailInfo.businessname}}</p> 
                        <p class="pin"><span  class="pnu">{{CutUserProductDetailInfo.cutsuccesscount}}人成功助力</span> </p>
                        <p  class="ellipsis product_price font-price" style="text-align: left; padding: 0px;">
                          <i class="miaoshu">可砍至</i> <span> ¥{{CutUserProductDetailInfo.minprice|tofixed}}</span> 
                          <span class="gui">¥{{CutUserProductDetailInfo.salemoney|tofixed}}</span>
                        </p>
                        </div>
                      </div>
                    <!-- <div  class="gototuan" @click.stop="getProductOptions(groupItem.pid)"><div class="goContent"><span>邀请助力</span></div></div> -->
              </div>
          </div>
        <!-- 立即购买 y邀请助理 -->
          <div class="cutDetail" v-if="!cutsuccessfail">
              <div class="cutDetail_price">已砍<i>{{CutUserProductDetailInfo.cutcountmoney|tofixed}}</i>元 还差<i>{{(CutUserProductDetailInfo.salemoney -CutUserProductDetailInfo.cutcountmoney - CutUserProductDetailInfo.minprice)|tofixed}}</i> 元 </div>
              <div class="progress_bar">
                 <span :style="{'width':progress}"></span>
              </div>
              <!-- // 分享好友显示 -->
              <div class="cutDetail_buy share_cutDetail_buy" @click.stop="friendCut(1)" v-if="friendcuttype==1">
                <span>使出独门绝技,助TA一臂之力!</span>
              </div>
              <div class="cutDetail_buy share_cutDetail_buy" @click.stop="friendCut(2)" v-if="friendcuttype==2">
                <span>我也想要</span>
              </div>
              <div class="count_down">
                还剩 <i>{{countDown}}</i> 结束，考验你友情的时候到了...
              </div>
              <button @click="friendCut(2)">我也想要</button>
          </div>

          <!-- 分享显示 -->
          <div class="shareCutBg" v-if="cutsuccessfail">
              <div>
                <img src="/static/img/cutbg.png" alt="">
              </div>
              <!-- 好友助力失败 -->
              <span v-if="cutfail">伤心,助力失败了~</span>
              <!-- 好友助力成功 -->
              <span v-if="!cutfail">哇,你们太给力了!已经助力成功啦~</span>
              <div class="shareMyBuy" @click.stop="getProductOptions">
                我也想要
              </div>
          </div>
          <!-- 弹框 -->
          <model v-if="cutGoingFail" :showBtn='showBtn' :cutText='cutText' :modelBgClassBG='modelBgClassBG' @close='close'></model>
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
          <!-- 我也想要的选择规格 -->
          <product-items :show="css.showItems" :helpType="true" :product-info="realInfo" @close='itemsClose'></product-items>
         
          <!-- 好友助力列表 -->
        <div class="friendDetail">
           <div class="title"><span>好友助力详情</span></div>
           <div>
              <ul>
               <li v-for="(item,index) in friendCutList" :key="index" v-if="index<friendCutListIndex">
                    <div class="friendDetail_img">
                      <img :src="item.imageurl" alt="">
                    </div>
                    <div class="friendDetail_name">{{item.username}}</div>
                    <div class="friendDetail_price">￥{{item.cutmoney | tofixed}}元</div>
                </li>
              </ul>
              <div class="more">
                查看更多
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
                    <div class="recommend-content" v-for="(item,ind) in productinfo" :key="ind">
                      <img :src="item.productimageurl" alt="">
                      <div class="introduce">
                          <p>￥{{item.saleprice | tofixed}}</p>
                          <p class="ellipsis ">{{item.productname}}</p>
                          <!-- <i :class="groupItem.businesstype===1?'ico-sp-official':groupItem.businesstype===2?'ico-sp-buy':'ico-sp-store'"></i>{{groupItem.businessname}}</p>  -->
                          <p><i :class="item.businesstype===1?'ico-sp-official':item.businesstype===2?'ico-sp-buy':'ico-sp-store'"></i>{{item.businessname}}</p></p>
                      </div>
                    </div>
                    
                </div>
            </div>
        </v-list>
        <!-- <div v-else class="wait-list-tpl"></div> -->
        <div class="no_product" v-if='hasdata==0'>
        </div>
        <!-- //分享提示框 -->
        <div class="share" v-if="isShare" @click.stop="cancel()">
          <div class="shareIcon">
            <img src="/static/img/h5shareIcon.png" alt="">
            <img src="/static/img/h5shareiconknow.png" alt="">
          </div>
        </div>
    </div>
</template>
<script>
import { ProdCategorySearch, NewDetail } from "../../common/api/product";
import ProductItems from "@/comps/ProductItems";
import { DateDiff, _getDate } from "../../common/util";
import { mapGetters } from "vuex";
import ProductUnit from "../templates/ProductUnit";
import {
  CutUserProductDetail,
  CutUserProductDetailOpen,
  StartCut,
  FriendCut,
  FriendCutList,
  GetCutProductListOpen
} from "../../common/api/bargain";
import broadcast from "./broadcast.vue";
import cutaddress from "../user/Address.vue";
import model from "./helppopmodel.vue";
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
      confirmAdress: false,
      cutsuccessfail: false,
      cutfail: false,
      countDown: "0",
      timeRun: null,
      progress: "0",
      CutUserProductDetailInfo: {},
      friendCutList: {}, //好友助力列表
      friendCutListIndex: 5,
      friendcuttype: 1, // 1 好友助力 2 好友够买
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1, categoryid: "" },
      productInfoGroupItems: {},
      itemsCloseItem: {}, // 颜色规格我
      pagination: {
        sumcount: 0,
        pagesize: 5,
        pageindex: 1,
        hasLoad: true
      }
    };
  },
  computed: {
    ...mapGetters({
      productLists: "productLists",
      userDefaultAddress: "userDefaultAddress",
      userInfo: "userInfo"
    }),
    realInfo() {
      let info =
        (this.productInfoGroupItems && this.productInfoGroupItems.info) || {};
      info.productid = info.id;
      return info;
    }
  },
  components: { ProductUnit, broadcast, ProductItems, cutaddress, model },
  mounted() {
    this.req();
    this.HelpUserProductDetail();
    this.friendList(); //好友助力列表
    //发起助力参数
    if (this.$store.state.user.cutType) {
      this.confirmAdress = true;
    }
    if (this.$store.state.user.cutToastShare) {
      if (this.$root.ISAPP) {
        this.toast("调app分享");
        // this.getAppActivityShareContent(info);
        return;
        // javascriptBridge(name,team.order.orderno)
      }
      this.isShare = true;
      this.$store.state.user.cutToastShare = false;
    }
  },
  methods: {
    countdownTime(type) {
      var _ = this;
      var ts = DateDiff({
        destination: this.CutUserProductDetailInfo.endtime,
        type: type
      });
      if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) {
        _.countDown = "00:00:00";
        return;
      }
      let H = ts.H < 9 ? "0" + ts.H : ts.H;
      let M = ts.m < 9 ? "0" + ts.m : ts.m;
      let S = ts.s < 9 ? "0" + ts.s : ts.s;
      _.countDown = H + ":" + M + ":" + S;
      // console.log(ts)
      if (ts.H === 0 && ts.m === 0 && ts.s === 1) {
        _.countDown = null;
        clearTimeout(_.timeRun);
      } else {
        _.timeRun = setTimeout(() => {
          _.countdownTime();
        }, 1000);
      }
    },
    HelpUserProductDetail() {
      let cutid = this.$route.params.id;
      let CutUserProductDetailApi = this.userInfo.token
        ? CutUserProductDetail
        : CutUserProductDetailOpen;
      CutUserProductDetailApi({ cutid: cutid }).then(res => {
        if (res) {
          this.CutUserProductDetailInfo = res;
          let time = res.endtime;
          this.countdownTime("H"); //倒计时
          this.progress = res.cutcountmoney / res.salemoney * 100 + "%";
          switch (res.status) {
            case 0:
              this.cutsuccessfail = true;
              this.cutfail = true;
              break;
            case 1:
              this.cutsuccessfail = false;
              this.cutfail = false;
              break;
            case 2:
              this.cutsuccessfail = true;
              this.cutfail = false;
              break;
            case 3:
              this.cutsuccessfail = true;
              this.cutsucess = false;
              break;
          }
          console.log("助力详情数据", this.CutUserProductDetailInfo);
        }
        // console.log(res, "助力详情")
      });
    },
    productDetail() {
     
      let id = this.CutUserProductDetailInfo.productid;
      //  alert(id)
      this.$router.push("/productDetail/" + id);
    },
    friendCut(type) {
      if (!this.userInfo.token) {
        this.$router.push("/login");
      }
      if (type === 1) {
        // 好友助力
        FriendCut({ cutid: this.$route.params.id })
          .then(res => {
            if (res.flag) {
              this.CutUserProductDetailInfo.cutcountmoney = res.cutcountmoney;
              this.cutText = "棒棒哒,你已经成功砍掉" + res.cutmoney;
              this.modelBgClassBG = "cutbg";
              this.showBtn = 4;
              this.cutGoingFail = true;
              this.friendcuttype = 2;
            } else {
              this.cutText = " <p>助力失败<br>重新邀请好友助力吧~!";
              this.modelBgClassBG = "cutFail";
              this.showBtn = 5;
              this.cutGoingFail = true;
            }
          })
          .catch(err => {
            this.cutText = " <p>助力失败<br>重新邀请好友助力吧~!";
            this.modelBgClassBG = "cutFail";
            this.showBtn = 5;
            this.cutGoingFail = true;
            console.error(err);
          });
      } else if (type === 2) {
        this.getProductOptions();
        // 1. 正在助力中  2. 超过够买次数 提示 好人缘爆棚 3. 正常够买 4. 活动结束 来晚啦 活动结束
      }
    },
    shareUrl() {
      this.isShare = true;
    },
    cancel() {
      this.isShare = false;
    },
    buyNow() {
      var item = JSON.parse(localStorage.getItem("helphand"));
      // price 有活動 specialprice 沒有活動 saleprice
      console.log("dd", item);
      item.salemoney = item.salemoney + 1;
      item.saleprice = item.salemoney + 3;
      item.specialprice = item.salemoney - item.cutcountmoney + 2; // 原價 - 已砍甲哥
      item.isok = true;
      item.checked = true;
      item.cutid = item.id;
      item.count = 1;
      item.colorimg = item.imageurl;
      let tempTotalPrice = item.specialprice + 10;

      let pay = {
        ...item,
        id: item.productid,
        allPay: tempTotalPrice,
        item: [item]
      };

      let _ = this;
      _.$store.dispatch("setOrderCoupon", {
        canUseCoupon: [],
        unCanUseCoupon: []
      });
      _.$store.state.order.selectedCoupon = {};
      _.$store.dispatch("setOrderOut", { ...pay });
      _.$store.dispatch("setFromeType", 1);
      _.$router.push("/order/checkout");
    },
    close(type) {
      // this.$router.push("/helpbargain/helpdetail/"+ this.groupBuyList.id);
      if (type == 3) {
        this.$router.push("/helpbargain");
      } else if (type == 5) {
        this.friendCut(1);
      }
      this.cutGoingFail = false;
      this.confirmAdress = false;
      this.$store.state.user.cutType = false;
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
          businesscutid: this.CutUserProductDetailInfo.businesscutid,
          productitemid: this.itemsCloseItem.productitemid,
          productname: this.itemsCloseItem.productname
        };
        //弹框  确认收货地址

        StartCut(option).then(res => {
          if (res.flag) {
            localStorage.removeItem("helphand");
            this.$store.state.user.cutType = false;
            // this.goBarGainDetail();
          }
        });
      }
    },
    //  好友 购买
    // 颜色规格回传
    itemsClose(item) {
      console.log("item", item);
      this.css.showItems = false;
      if (item) {
        localStorage.setItem("helphand", JSON.stringify(item));
        this.$router.push({
          path: "/user/address",
          query: { cutType: 1 }
        });
      }
    },
    getProductOptions() {
      // 我也想要
      let id = this.CutUserProductDetailInfo.productid;
      // 先判断是否登录
      if (!this.userInfo.token) {
        this.$router.push("/login");
      } else {
        let item = this.CutUserProductDetailInfo;
        if (!item.isjoin) {
          // this.cutGoing = true;
          switch (item.usercutstatus) {
            case 0:
              this.cutText = " <p>来晚啦,助力活动已结束<br>去看看其他商品吧!";
              this.modelBgClassBG = "cutgoing";
              this.showBtn = 2;
              break;
            case 1:
              this.cutText =
                " <p>当前商品正在助力中,<br>快去邀请更多好友来助力吧!";
              this.modelBgClassBG = "cutgoing";
              this.showBtn = 2;
              break;
            case 2:
              this.cutText =
                "好人缘爆棚,<br>您已经达到该商品助力的巅峰值,<br>快去看看其他商品吧!";
              this.modelBgClassBG = "cutSuccess";
              this.showBtn = 1;
          }

          this.cutGoingFail = true;
        } else {
          NewDetail(id)
            .then(res => {
              // console.log("颜色规格：zs", res);
              this.css.showItems = true;
              this.productInfoGroupItems = res;
            })
            .catch(e => {
              console.error(e);
            });
        }
      }
    },
    friendList() {
      let cutid = this.$route.params.id;
      FriendCutList({ cutid: 1234 }).then(res => {
        if (res) {
          this.friendCutList = res;
        }
        console.log("好友助力列表", res);
      });
    },
    friendCutListMore() {
      this.friendCutListIndex = this.friendCutList.length;
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
      this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.pageindex === 1) {
        this.isEnd = false;
        window.scrollTo(0, 0);
      }
      GetCutProductListOpen(postParams)
        .then(res => {
          if (res) {
            console.log("mall home CategorySearch", res);

            this.productinfo.push(...res.list);
            if (res.sumcount == 0) {
              this.isEnd = false;
              this.hasdata = 0;
            } else {
              this.hasdata = 1;
              if (res.pageindex > 0) page.pageindex = res.pageindex;
              if (res.sumcount > -1) page.sumcount = res.sumcount;
              if (res.pagesize > -1) page.pagesize = res.pagesize;
              if (page.pageindex * page.pagesize >= page.sumcount)
                this.isEnd = true;
            }
            // this.$store.dispatch("getProductList", res);
          } // else this.toast('加载完成')
          this.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.hasdata = 2;
          this.isLoading = false;
          // this.toast(e && e.msg ? e.msg : ('error:' + e));
        });
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
}
.headerImgUrl {
  display: flex;
  margin-bottom: 20px;
}
.headerImgUrl .img {
  width: 52px;
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
  width: 65%;
}
.headerImgUrl .useinfo span {
  display: block;
  font-size: 12px;
  color: #4b4b4b;
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
  font-size: 16px;
  font-weight: bold;
  padding: 0 3px;
}
.progress_bar {
  background: #ddd;
  height: 5px;
  box-shadow: 0px 2px 5px #ccc;
  position: relative;
  border-radius: 2px;
  margin: 15px 0;
}
.progress_bar span {
  /* display: inline-block; */
  background: url("/static/img/bar.png") 0 0 no-repeat;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.progress_bar span::before {
  content: "";
  position: absolute;
  right: -4px;
  top: -4px;
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
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #333;
  font-size: 14px;
  color: #fff;
  border-radius: 5px;
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
  font-size: 13px;
  line-height: 30px;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
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
  font-size: 16px;
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
  width: 15px;
  height: 2px;
  background: #4e4e4e;
  left: -25px;
  top: 8px;
}
.title span::after {
  left: auto;
  right: -25px;
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
}
.friendDetail ul li .friendDetail_name,
.friendDetail ul li .friendDetail_price {
  font-size: 13px;
  color: #4e4e4e;
  line-height: 20px;
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
  width: 20px;
  height: 20px;
  background: url(/static/img/pullmore.png) 0 0 no-repeat;
  background-size: 60% 60%;
  top: 3px;
  right: 37%;
}
.noCut {
  color: #999;
  font-size: 15px;
}
.productItem {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;

  background: #fff;

  margin-bottom: 15px;
  border-radius: 5px;
  width: 97%;
}
.productItem .ImgWrap {
  position: relative;
  width: 40%;
  /* padding-bottom: 26%; */
  padding-top: 35%;
  overflow: hidden;
}
.ImgWrap img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.productItem .textWrap {
  padding: 10px 0px 10px 20px;
  width: 50%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.productItem .textWrap .product_names > p {
  /* margin: 3px 0px; */
  text-align: left;
  /* line-height: 1rem; */
  /* height: 1rem; */
  font-size: 13px;
  color: #333;
}
.product_name {
  counter-reset: #666;
}
.productItem .textWrap p.business_name,
.productItem .textWrap p.pin {
  color: #666;
}
.productItem .textWrap p.product_price {
  font-size: 22px;
  line-height: 24px;
  margin: 5px 0;
}
.productItem .textWrap p.product_price .miaoshu {
  font-size: 14px;
  font-style: normal;
  padding-right: 5px;
}
.productItem .textWrap p.pin {
  margin-top: 5px;
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
  top: 40px;
  right: 20px;
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
.recommend{
  /* padding: 0 1%; */
  display: flex;
}
.recommend-content{
  width: 48%;
  margin: 0 1%;
  margin-bottom: 10px;
}
.introduce{
  text-align: left;
  font-size: 12px;
  color: #333;
   font-family: BASE_PRICE;
  
}
.introduce p:nth-child(1){
  font-weight: bold
}
.introduce p:nth-child(2){
  font-weight: bold;
  font-size: 10px;
}
.introduce p.store{
  color: #a5a5a5;
}
</style>


