<template>
  <div class="" id="tab">
    <v-header>
        <div class="nav-tab2">
            <h3 style="color:#000;">拼团详情</h3>
        </div>
        <v-cart :isshow="true" :isdark="true"></v-cart>
    </v-header>
    <!-- 详情介绍v-if="countdata&&countdata.id" -->
    <div class="puzzle" style="padding-top: 2px;">
      <div v-if="countdata&&countdata.id">
          <ProductUnit  :productItem="countdata" :productType="13" :grouptype="1"></ProductUnit>
      </div>
      <!-- 拼团状态 -->
      <div class="groupStatus" >
        <div :class="{'error':checkDetail.groupData==3||checkDetail.groupData==4}">
          <p v-if="checkDetail.groupData==2"> 拼团成功</p>
          <p v-if="checkDetail.groupData==1"> 还差<span class="pnum">{{countdata.remainingcount}}</span>人,
            <span class="cd">
                <i v-if="timeData&&timeData.H>=0 && timeData.m>=0 &&timeData.s>=0">
                <em>{{timeData.H>=10?timeData.H:'0'+timeData.H}}</em>&nbsp;:
                <em>{{timeData.m>=10?timeData.m:'0'+timeData.m}}</em>&nbsp;:
                <em>{{timeData.s>=10?timeData.s:'0'+timeData.s}}</em>
              </i>
            </span> 后结束
          </p>
          <p v-if="checkDetail.groupData==0">
            <span class="errorText errorIcon">请在
              <span class="">
                <i v-if="timeData&& timeData.m>=0 &&timeData.s>=0" class="wid">
                  <em>{{timeData.m>=10?timeData.m:'0'+timeData.m}}:</em>
                  <em>{{timeData.s>=10?timeData.s:'0'+timeData.s}}</em>
                </i>
              </span>&nbsp;完成支付
            </span>
          </p>
          <p v-if="checkDetail.groupData==3"><span class="errorIcon errorText">拼团失败,未在有效时间内完成付款</span></p>
          <p v-if="checkDetail.groupData==4"><span class="errorIcon">超过有限时间,</span><span class="errorText ">拼团失败</span></p>
          </div>
          <CommentGroup v-if="countdata" :teamlimitcount='countdata.teamlimitcount' :head-img-url="countdata.headimgurl" :order-status="countdata.orderstatus" :joins="countdata.joins" :remaining-count="countdata.remainingcount" > </CommentGroup>
      </div>

      <!-- 拼团须知 -->
      <div class="purchase-notes">
          <span >拼团须知</span>
          <span><i>好友参团</i><i>人满发货</i><i>人不满退款</i></span>
      </div>
      <!-- 查看详情 -->
      <!-- loadCheck(id) id= pagestatus checkDetail.groupData-->
      <div class="checkDetail" @click="loadCheck(checkDetail.groupData)">
        {{checkDetail.groupBtn}}
      </div>

       <!-- 一键参团 -->
      <!-- <product-items :show="showItems"  :product-info="realInfo" @close='itemsClose'></product-items> -->
    <!-- v-if="checkDetail.groupData==4||checkDetail.groupData==3" -->
     <!-- <div v-if="checkDetail.groupData==4||checkDetail.groupData==3">
       <p class="returnMoney">开团后邀请好友参团，人数不足自动退款</p>
        <div class="checkAll">
            <span>{{countdata.teamtotalcount}}位潮人正在开团，可直接参与</span>
            <span @click="showGroupMoreList">查看全部></span>
        </div>
        <mt-popup  v-model="css.isShow"  position="top">
          <pop-up v-on:close="showGroupMoreList()" :productList="openGroup" ></pop-up>
        </mt-popup>
         <div class="sharePage" >
            <ul class="list">
              <li v-for="(it,ind) in openGroup" :key='ind' v-if="ind<3">
                  <div class="headName">
                  <img :src="it.headimgurl" alt="">
                  <p>{{it.nickname}}</p>
                  </div>
                  <div class="countDown">
                      <span>还剩{{it.remainingcount}}人成团</span>
                      <span>
                        <countDown :time="it.endtime"></countDown>
                      </span>
                  </div>
                  <div class="offered" @click="toGroup()">
                      去参团
                  </div>
              </li>
            </ul>
        </div>
      </div> -->
    </div>
    <!-- 查看全部 -->
    <div class="checkAll puzzle" v-show="true">
        <span>其他潮人还在拼这些潮品</span>
        <span @click="checkAll()">查看全部></span>
    </div>
    <!-- 查看全部列表 -->
    <div>
      <ProductUnit  v-for="(item,ind) in groupBuyList" :key="ind" v-if="ind<3"  :productItem='item' :productType="13" :grouptype="2"></ProductUnit>
    </div>
    <!-- 热门推荐 -->
    <div class="hot-recommend">
      <p class="puzzle">热门推荐</p>
      <div class="hot-recommend-pro">
          <RecomdProds :recodsList='relativePods' v-if="relativePods&&relativePods.length>0"></RecomdProds>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import ProductUnit from "../templates/ProductUnit";
import RecomdProds from "../templates/RecomdProds";
import CommentGroup from "./CommentGroup";
import popUp from "./GroupPopUp";
import { DateDiff } from "../../common/util";
import ProductItems from "@/comps/ProductItems";
import { groupUI } from "./Ui";
import {
  GetGroupBuyDetail,
  GetGroupProductList,
  GetProductDetailGroup
} from "../../common/api/group";
import { ProdRelated, NewDetail } from "../../common/api/product";
import { mapGetters } from 'vuex'
export default {
  components: {
    ProductUnit,
    CommentGroup,
    RecomdProds,
    popUp,
    ProductItems
    // countDown: {
    //   template: ` <i v-if="cond.H>=0&&cond&&cond.H>=0 && cond.m>=0 &&cond.s>=0">
    //                 <em>剩余:</em>
    //                 <em>{{cond.H>=10?cond.H:'0'+cond.H}}:</em>
    //                 <em>{{cond.m>=10?cond.m:'0'+cond.m}}:</em>
    //                 <em>{{cond.s>=10?cond.s:'0'+cond.s}}</em>
    //               </i>`,
    //   props: {
    //     time: { type: String }
    //   },
    //   data() {
    //     return {
    //       countDownData: {}
    //     };
    //   },
    //   computed: {
    //     cond() {
    //       this.setentime(this.time)
    //       return this.countDownData
    //     }
    //   },
    //   methods: {
    //     entime(time) {
    //       this.countDownData = DateDiff({ destination: time, type: "H" });
    //     },
    //     setentime(time) {
    //       let _ = this;
    //       setInterval(function() {
    //         _.entime(time);
    //       }, 1000);
    //     }
    //   }
    // }
  },
  data() {
    return {
      css: {
        // 分享页面
        isShow: false
      },
      countdata: {},
      checkDetail: {},
      timeData: {},
      groupBuyList: [],
      openGroup: [],
      relativePods: [],
      groupData: null,
      showItems: false,
      scrollY: 0,
      clearTime:null,
      orderpayexpiretime: null, // 待支付时间
      currentOrderno: null // 当前订单编号
    };
  },
  mounted() {
    this.currentOrderno = this.$route.query.orderno
    // 获取详情数据
    this.groupDetail();
    // 拼团列表数据
    this.groupbuyData();
  },
  computed: {
    ...mapGetters({
      insq: 'insq'
    })
  },
  methods: {
    groupDetail() {
      let itemid = this.$route.params.id;
      GetGroupBuyDetail({ teamId: itemid })
        .then(res => {
          if (res) {
            let s = res.order;
            let a = this.countdata;
            let _ = this
            a.brandname = s.brandname;
            a.businessname = s.businessname;
            a.businesstype = s.businesstype;
            a.id = s.pid;
            a.name = s.pname;
            // a.groupid = res.teamid;
            a.mainpic = s.imageurl + "|";
            // a.userid = res.userid;
            a.specialprice = res.teamprice;
            a.saleprice = res.saleprice;
            a.teamlimitcount = res.teamlimitcount;
            a.teamtotalcount = res.teamtotalcount;
            a.joins = res.joins;
            // a.endtime = res.endtime.replace(/-/g, '/')
            // a.orderpayexpiretime = res.orderpayexpiretime.replace(/-/g, '/')
            a.headimgurl = res.headimgurl;
            a.orderstatus = s.orderstatus;
            // a.nickname = res.nickname;
            a.remainingcount = res.remainingcount;
            a.status = res.status;
            a.orderno = s.orderno
            if (_.currentOrderno) {
              if (res.order.orderno == _.currentOrderno) {
                _.orderpayexpiretime = res.orderpayexpiretime;
              } else {
                for (let i = 0; i < res.joins.length; i++) {
                  if (res.joins[i].order.orderno == _.currentOrderno) {
                    _.orderpayexpiretime = res.joins[i].orderpayexpiretime;
                  }
                }
              }
              this.checkDetailText(res, _.currentOrderno)
            }
            // 热们推荐 测试数据
            this.getRelateds(a.id);
            // 该商品 开图列表
            // this.openGroupList(a.id)
            console.log("拼团详情", this.countdata);
          }
        })
        .catch(e => {
          console.error("商品详情相关推荐异常", e);
        });
    },

    entime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      // let _ = this
      // if (this.timeData.H === 0 && this.timeData.m === 0 && this.timeData.s > 1) {
      //   setTimeout(function () {
      //     _.groupDetail()
      //   },1000)
      //   clearInterval(this.clearTime)
      // }
    },
    setentime(time, type) {
      let _ = this
      _.clearTime = setInterval(function () {
        _.entime(time, type)
      }, 1000)
    },
    checkDetailText(res, orno) {
      let g = null
      if (this.currentOrderno) g = groupUI(res, orno)
      console.log("返回状态", g);
      // 0 继续支付 1 邀请参团 2 查看订单详情 3，4，5 重新开团

      let t = {};
      switch (g) {
        case 1:
          t.groupBtn = "继续支付";
          this.setentime(this.orderpayexpiretime.replace(/-/g, "/"), "m");
          t.groupData = 0;
          break;
        case 2:
          t.groupBtn = "重新参团";
          t.groupData = 3;
          break;
        case 3:
          t.groupBtn = "还差" + res.remainingcount + "人,邀请好友参团";
          this.setentime(res.endtime.replace(/-/g, "/"), "H");
          t.groupData = 1;
          break;
        case 4:
          t.groupBtn = "继续支付";
          this.setentime(this.orderpayexpiretime.replace(/-/g, "/"), "m");
          t.groupData = 0;
          break;
        case 5:
          t.groupBtn = "重新参团";
          t.groupData = 3;
          break;
        case 6:
          t.groupBtn = "查看订单详情";
          t.groupData = 2;
          break;
        case 7:
          t.groupBtn = "重新开团";
          t.groupData = 3;
          break;
        case 8:
          t.groupBtn = "查看更多该商品拼团";
          t.groupData = 4;
          break;
        case 9:
          t.groupBtn = "查看更多该商品拼团";
          t.groupData = 4;
          break;
      }
      this.checkDetail = t;
    },

    // 获取拼团列表数据
    groupbuyData() {
      let postParams = {
        page: 1,
        size: 3
      };
      GetGroupProductList(postParams)
        .then(res => {
          // let arrTemp = []
          for (let i = 0; i < res.list.length; i++) {
            let target = {};
            const source = res.list[i];
            target.brandname = source.brand;
            target.businessname = source.businessname;
            target.businesstype = source.businesstype;
            target.id = source.pid;
            target.groupid = source.id;
            target.mainpic = source.imageurl + "|";
            target.name = source.title;
            target.users = source.users;
            target.specialprice = source.teamprice;
            target.saleprice = source.marketprice;
            target.teamlimitcount = source.teamlimitcount;
            target.teamtotalcount = source.teamtotalcount;

            // arrTemp.push(target)
            this.groupBuyList.push(target);
          }
          // this.$store.dispatch('GroupbuyList', arrTemp)
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 热们推荐 测试数据
    getRelateds(id) {
      ProdRelated({ ProductId: id })
        .then(res => {
          if (res) {
            this.relativePods = res;
          }
        })
        .catch(e => {
          console.error("商品详情相关推荐异常", e);
        });
    },
    showGroupMoreList() {
      this.css.isShow = !this.css.isShow;
    },
    //  去参团  测试
    toGroup() {
      // console.log(this.countdata.id)
      this.$router.push("/productDetail/" + this.countdata.id);
    },
    loadCheck(type) {
      // 0 继续支付 1 邀请参团 2 查看订单详情 3，4，5 重新开团
      // console.log(this.countdata)
      switch (type) {
        case 0:
          let url = "/pay/" + this.currentOrderno;
          if (this.insq) url = `/frame/${encodeURIComponent(url)}`;
          this.$router.push(url);
          break;
        case 1:
          // 邀请好友参团 打开app
          this.loadApp();
          break;
        case 2:
          // 订单详情
          this.$router.push("/order/detail/" + this.currentOrderno);
          break;
        case 3:
        case 4:
          // 我要开团  商品详情
          this.$router.push("/productDetail/" + this.countdata.id);
          break;
        case 5:
          // 一键参团
          this.showItems = true;
          break;
      }
    },
    checkAll() {
      // this.toast('查看全部')
      this.$router.push("/groupbuy/list");
    }
    // 该商品 开图列表
    // openGroupList(id) {
    //   GetProductDetailGroup({ pid: id })
    //     .then(res => {
    //       if (res && res.list.length > 0) {
    //         this.openGroup = res.list
    //         this.openGroup.map(i => {
    //           i.groupTimeRemain = DateDiff({
    //             destination: new Date(i.endtime),
    //             type: 'H'
    //           })
    //         })
    //       }
    //       console.log('该商品 开图列表', this.openGroup)
    //     })
    //     .catch(e => {
    //       console.error(e)
    //     })
    // },
  },
  watch: {
    timeData: function (oldval, newval) {
      let _ = this
      if (newval.H === 0 && newval.m === 0 && newval.s === 0) {
        setTimeout(function () {
          _.groupDetail()
        }, 500)
      }
      // console.log(newval.m,newval.s)
    }
  }
};
</script>
<style scoped>
.puzzle {
  padding: 0 10px;
}
.groupStatus {
  box-shadow: 0px 0px 5px #ccc;
  margin-top: 15px;
  /* margin-top: 60px; */
  text-align: center;
  font-size: 14px;
  color: #333333;
  overflow: hidden;
  border-radius: 5px;
  padding: 11px 0;
  min-height: 86px;
}
.groupStatus .error {
  display: flex;
  align-items: center;
  text-align: center;
}
.groupStatus p {
  margin: 8px auto;
}
.groupStatus p .errorIcon {
  position: relative;
}
.groupStatus p .errorIcon::before {
  content: "!";
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #f45050;
  position: absolute;
  left: -20px;
  top: 0;
  color: #fff;
}
.groupStatus p .errorText {
  color: #f45050;
}
.groupStatus p .pnum {
  color: #ffc700;
}
.groupStatus p .cd {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}
.groupStatus p .cd i {
  font-style: normal;
  display: inline-block;
  /* width: 25%; */
}
.groupStatus p i.wid {
  /* width: 17%; */
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
}
.groupStatus p i.wid em {
  display: inline-block;
  width: 17px;
  /* font-size: 12px; */
}
.groupStatus p .cd i em {
  width: 17px;
  display: inline-block;
}
.groupStatus p .complete {
  position: relative;
}
.groupStatus p .complete i {
  position: absolute;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  position: absolute;
  left: -20px;
  top: 0;
  background: #ffc700;
}
.groupStatus p .complete i:before {
  content: "";
  position: absolute;
  left: 3px;
  top: 4px;
  width: 10px;
  height: 6px;
  color: #fff;
  line-height: 15px;
  border-bottom: 2px solid;
  border-left: 2px solid;
  transform-origin: center;
  transform: rotate(-55deg);
  /* border-radius: 2px; */
}
.returnMoney {
  border-bottom: 1px solid #f2f2f2;
  font-size: 12px;
  color: #666666;
  line-height: 40px;
}
.purchase-notes {
  box-shadow: 0px 0px 5px #ccc;
  padding: 0 11px;
  height: 37px;
  line-height: 37px;
  color: #666;
  font-size: 12px;
  margin-top: 15px;
  border-radius: 5px;
}
.purchase-notes span {
  float: left;
}
.purchase-notes span:nth-child(2) {
  float: right;
  position: relative;
  width: 70%;
  text-align: right;
}
.purchase-notes span i {
  font-style: normal;
}
.purchase-notes span:nth-child(2) i {
  margin-left: 14px;
  position: relative;
}
.purchase-notes span:nth-child(2) i:before {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  background: #666;
  border-radius: 50%;
  top: 6px;
  left: -8px;
}
.checkDetail {
  background: #333;
  color: #fff;
  text-align: center;
  line-height: 34px;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 15px;
}
.hot-recommend p {
  font-size: 0.94rem;
  color: #000;
  margin: 20px 0;
}

/* .checkAll {
  overflow: hidden;
  border-bottom: 1px solid #f2f2f2;
}
.checkAll span {
  font-size: 12px;
  color: #666666;
  float: left;
  line-height: 40px;
}
.checkAll span:nth-child(2) {
  float: right;
} */
/* // 分享页面 */
.sharePage {
  font-size: 12px;
  color: #666666;
  line-height: 40px;
  /* border-top: 10px solid #f2f2f2; */
  position: relative;
  border-bottom: 10px solid #f2f2f2;
}
.sharePage:after {
  content: "";
  height: 10px;
  background: #f2f2f2;
  position: absolute;
  left: -10px;
  right: -10px;
  bottom: -10px;
}

.sharePage:after {
  top: auto;
  bottom: -10px;
}
.returnMoney {
  border-bottom: 1px solid #f2f2f2;
}
.sharePage .checkAll {
  border: none;
}
.sharePage .list {
  overflow: hidden;
}
.sharePage .list li {
  background: #f2f2f2;
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 3px;
  /* height: 60px; */
  /* padding: 8px 6px;
    padding-right: 0; */
}
.sharePage .list li .headName,
.sharePage .list li .countDown,
.sharePage .list li .offered {
  float: left;
}
.sharePage .list li .headName {
  width: 40%;
  overflow: hidden;
  margin-top: 8px;
  margin-left: 3%;
}
.sharePage .list li .countDown {
  width: 35%;
  /* margin-top: 8px; */
}

.sharePage .list li .countDown span {
  display: block;
  font-size: 12px;
  line-height: 24px;
  text-align: right;
  margin-left: 25px;
}
.sharePage .list li .countDown span i {
  display: flex;
  width: 100%;
  /* display: inline-block; */
  /* justify-content:flex-end; */
}
.sharePage .list li .countDown span i em {
  /* width: 25%; */
  /* display: inline-block; */
}
.sharePage .list li .countDown span:nth-child(1) {
  color: #ffc700;
  text-align: center;
}
.sharePage .list li .countDown span:nth-child(2) i {
  color: #333333;
  font-size: 12px;
  font-style: normal;
}
.sharePage .list li .offered {
  width: 20%;
  background: #ffc700;
  height: 100%;
  margin-left: 2%;
  text-align: center;
  color: #333;
  line-height: 48px;
  border-radius: 0 3px 3px 0;
  font-size: 14px;
}
.sharePage .list li .headName img {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  vertical-align: bottom;
  float: left;
}
.sharePage .list li .headName p {
  float: left;
  margin-left: 5px;
}
.checkAll {
  overflow: hidden;
  border-bottom: 1px solid #f2f2f2;
}
.checkAll span {
  font-size: 12px;
  color: #666666;
  float: left;
  line-height: 40px;
}
.checkAll span:nth-child(2) {
  float: right;
}
.mint-popup-top {
  top: 100px;
  width: 95%;
  border-radius: 4px;
}
</style>



