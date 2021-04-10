<template>
  <div class="">
    <v-header>
        <div class="nav-tab2">
            <h3 style="color:#000;">拼团</h3>
        </div>
    </v-header>
    <!-- 详情介绍 -->
    <div class="puzzle">
      <div style="margin-top:50px;">
          <ProductUnit :productItem="groupProductDetail" :productType="13" :grouptype="1"></ProductUnit>
      </div>
      <!-- 拼团状态 -->
      <div class="groupStatus">
        <p v-if="btnObj.status===1">仅剩<span class="pnum">&nbsp;&nbsp;{{groupDetail.remainingcount}}&nbsp;&nbsp;</span>人&nbsp;,&nbsp;&nbsp;<span class="cd">{{groupDetail.countdownTime}}</span>&nbsp;&nbsp;结束</p>

          <p v-if="btnObj.status===5"><span class="errorIcon"></span><span class="errorText">请在 {{ordertime}} 完成支付</span></p>

          <p v-if="btnObj.status===3"><span class="errorIcon">超过有限时间&nbsp;,&nbsp;&nbsp;</span><span class="errorText">拼团失败</span></p>
          <p v-if="btnObj.status===4"><span class="errorIcon"></span><span class="errorText">拼团失败 , 未在有效时间内完成付款</span></p>

          <p v-if="btnObj.status===2"><span class="pnum complete"><i></i>已成团</span></p>

          <CommentGroup :teamlimitcount='groupDetail.teamlimitcount' :remainingCount="groupDetail.remainingcount" :orderStatus="groupDetail.status" :headImgUrl="groupDetail.headimgurl" :joins="groupDetail.joins"></CommentGroup>
      </div>

      <!-- 拼团须知 -->
      <div class="purchase-notes">
          <span >
            拼团须知
          </span>
          <span>
            <i>好友参团</i>
            <i>人满发货</i>
            <i>人不满退款</i>
          </span>
      </div>

       <!-- 一键参团 -->
      <div class="checkDetail" @click="loadCheck(btnObj.type)"> {{btnObj.text}} </div>
      <product-items :show="css.showItems" :isGroupBuy="true" :product-info="realInfo" @close='itemsClose'></product-items>

    </div>


    <!-- 查看全部 -->
    <div class="checkAll puzzle" v-show="true">
        <span>其他潮人还在拼这些潮品</span>
        <span @click="gotoPageGroupList()">查看全部></span>
    </div>
    <div>
      <ProductUnit  v-for="(item,ind) in groupBuyList" :key="ind" v-if="ind<3"  :productItem='item' :productType="13" :grouptype="2"></ProductUnit>
    </div>

    <!-- 热门推荐 -->
    <div class="hot-recommend" v-if="recommendProductList&&recommendProductList.length>0">
      <p class="puzzle">热门推荐</p>
      <div class="hot-recommend-pro">
          <RecommendProductList :recodsList="recommendProductList"></RecommendProductList>
      </div>
    </div>
  </div>
</template>
<script>
import ProductUnit from '../templates/ProductUnit'
import RecommendProductList from '../templates/RecomdProds'
import CommentGroup from './CommentGroup'
import popUp from './GroupPopUp'
import { DateDiff } from '../../common/util'
import ProductItems from '@/comps/ProductItems'
import { GetGroupBuyDetailOpen, GetGroupProductList } from '../../common/api/group'
import { ProdRelated, NewDetail } from '../../common/api/product'
import { mapGetters } from 'vuex'
const ls = window.localStorage
export default {
  components: {
    ProductUnit,
    CommentGroup,
    RecommendProductList,
    popUp,
    ProductItems
  },
  data() {
    return {
      css: {
        // 分享页面
        showItems: false
      },
      groupDetail: {},
      groupProductDetail: {
        specialprice: 999999,
        saleprice: 999999,
        mainpic: ['']
      },
      groupBuyList: [],
      recommendProductList: [], // 热们推荐
      productInfoGroupItems: {}, // 颜色规格参数
      userInfo: {},
      btnObj: {
        text: '一键参团',
        type: 4,
        groupBuyType: 2 // 1开团 2参团
      },
      currentOrderno: null,
      ordertime: null,
      urlOrderno: null
    }
  },
  mounted() {
    // 获取拼团列表
    this.groupbuyData()
    this.getGroupInfoDetail()
    this.urlOrderno = this.GetQueryString('orderno')
  },

  computed: {
    ...mapGetters({
      insq: 'insq'
    }),
    groupId() {
      return this.$route.params.id
    },

    realInfo() {
      let info = (this.productInfoGroupItems && this.productInfoGroupItems.info) || {}
      info.productid = info.id
      info.groupPrice = this.groupDetail.teamprice
      return info
    },

    // 获取用户信息
    user() {
      return JSON.parse(ls.getItem('currentUser'))
    }
  },

  methods: {
    // 获取拼团信息
    getGroupInfoDetail() {
      GetGroupBuyDetailOpen({ teamId: this.groupId })
        .then(res => {
          if (res) {
            console.log('拼团详情: ', res)

            this.groupDetail = res

            let _ = this
            let countDown
            setInterval(function () {
              countDown = _.groupProductDetailFormatTime(res.endtime.replace(/-/g, '/'))
              _.$set(_.groupDetail, 'countdownTime', countDown)
            }, 1000)

            this.groupProductDetail = res.order
            this.groupProductDetail.brandname = res.order.brandname
            this.groupProductDetail.id = res.order.pid
            this.groupProductDetail.mainpic = [res.order.imageurl]
            this.groupProductDetail.name = res.order.pname
            this.groupProductDetail.specialprice = res.teamprice
            this.groupProductDetail.saleprice = res.saleprice
            this.groupProductDetail.teamlimitcount = res.teamlimitcount
            this.groupProductDetail.teamtotalcount = res.teamtotalcount

            // 冗余计算值，1: 团详情－拼团成功，2：团详情－开团中－开团，3：团详情－失败－开团，4：好友看到拼团中，5：好友看到拼团失败，
            // 6：好友看到已成团， 7：订单详情－拼团成功，8：订单详情－拼团失败，
            // 9：订单详情－拼团中，10：订单详情－待支付，11：订单详情－支付失败

            // 获取推荐商品
            this.getRecommendProduct(this.groupProductDetail.id)
            // 获取颜色选项
            this.getProductOptions(this.groupProductDetail.id)
            // 判断UI状态
            this.getUI()
          }
        })
        .catch(e => {
          console.error('商品详情相关推荐异常', e)
        })
    },

    // 热们推荐
    getRecommendProduct(id) {
      ProdRelated({ ProductId: id })
        .then(res => {
          if (res) {
            this.recommendProductList = res
          }
        })
        .catch(e => {
          console.error('商品详情相关推荐异常', e)
        })
    },

    getProductOptions(id) {
      // productId
      NewDetail(id)
        .then(res => {
          console.log('颜色规格', res)
          this.productInfoGroupItems = res
        })
        .catch(e => {
          console.error(e)
        })
    },

    groupProductDetailFormatTime(time) {
      let tempCountdownTimeObject = DateDiff({
        destination: new Date(time),
        type: 'H'
      })
      if (tempCountdownTimeObject.H <= 0) {
        tempCountdownTimeObject.H = '00'
      }
      if (tempCountdownTimeObject.m <= 0) {
        tempCountdownTimeObject.m = '00'
      } else if (tempCountdownTimeObject.m < 10) {
        tempCountdownTimeObject.m = '0' + tempCountdownTimeObject.m
      }

      if (tempCountdownTimeObject.s <= 0) {
        tempCountdownTimeObject.s = '00'
      } else if (tempCountdownTimeObject.s < 10) {
        tempCountdownTimeObject.s = '0' + tempCountdownTimeObject.s
      }

      return (
        tempCountdownTimeObject.H +
        ':' +
        tempCountdownTimeObject.m +
        ':' +
        tempCountdownTimeObject.s
      )
    },
    // 查看拼团列表
    gotoPageGroupList() {
      this.$router.push('/groupbuy/list')
    },

    loadCheck(type) {
      if (type === 1) {
        // 拼团成功
        // 订单详情
        this.$router.push('/order/detail/' + this.currentOrderno)
      } else if (type === 2) {
        // 开团中
        // 邀请好友参团 打开app
        this.loadApp()
      } else if (type === 3) {
        // 重新开团
        this.$router.push('/groupbuy/list')
      } else if (type === 4) {
        // 一键参团
        if (this.insq || this.user) {
          this.css.showItems = true
        } else {
          this.$router.push('/login')
        }
        this.css.showItems = true
      } else if (type === 5) {
        // 支付
        let url = '/pay/' + this.currentOrderno
        if (this.insq) url = `/frame/${encodeURIComponent(url)}`
        this.$router.push(url)
      }
    },

    // 颜色规格回传
    itemsClose(item) {
      this.css.showItems = false
      if (item) {
        this.buyNow(item)
      }
    },
    buyNow(item) {
      item.checked = true
      item.isok = true
      item.groupBuyType = this.btnObj.groupBuyType
      item.groupBuyTeamId = this.groupId
      item.groupActivityId = this.groupDetail.pintuanId
      item.saleprice = this.groupDetail.teamprice
      item.specialprice = this.groupDetail.teamprice
      item.salemoney = this.groupDetail.teamprice
      item.price = this.groupDetail.teamprice
      item.groupPrice = this.groupDetail.teamprice
      let tempTotalPrice = item.count * this.groupDetail.teamprice
      console.log(item)
      let pay = {
        ...item,
        id: item.productid,
        allPay: tempTotalPrice,
        item: [item]
      }

      let _ = this
      _.$store.dispatch('setOrderCoupon', {
        canUseCoupon: [],
        unCanUseCoupon: []
      })
      _.$store.state.order.selectedCoupon = {}
      _.$store.dispatch('setOrderOut', { ...pay })
      _.$store.dispatch('setFromeType', 1)
      _.$router.push('/order/checkout')
    },
    // 获取拼团列表数据
    groupbuyData() {
      let postParams = {
        page: 1,
        size: 3
      }
      GetGroupProductList(postParams)
        .then(res => {
          for (let i = 0; i < res.list.length; i++) {
            let target = {}
            const source = res.list[i]
            target.brandname = source.brand
            target.businessname = source.businessname
            target.businesstype = source.businesstype
            target.id = source.pid
            target.groupid = source.id
            target.mainpic = source.imageurl + '|'
            target.name = source.title
            target.users = source.users
            target.specialprice = source.teamprice
            target.saleprice = source.marketprice
            target.teamlimitcount = source.teamlimitcount
            target.teamtotalcount = source.teamtotalcount
            this.groupBuyList.push(target)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    getUI() {
      let ispaid = null
      let orderStatus = null
      let _ = this
      if (this.user && this.user.uid === this.groupDetail.userid) {
        ispaid = this.groupDetail.order.hasOwnProperty('payedat')
        orderStatus = this.groupDetail.order.orderstatus
        this.currentOrderno = this.groupDetail.order.orderno
        setInterval(function () {
          _.ordertime = _.groupProductDetailFormatTime(_.groupDetail.orderpayexpiretime.replace(/-/g, '/'))
        }, 1000)
      } else {
        for (let i = 0; i < this.groupDetail.joins.length; i++) {
          if (this.user && this.user.uid === this.groupDetail.joins[i].userid) {
            if (this.urlOrderno === this.groupDetail.joins[i].order.orderno) {
              ispaid = this.groupDetail.joins[i].order.hasOwnProperty('payedat')
              orderStatus = this.groupDetail.joins[i].order.orderstatus
              this.currentOrderno = this.groupDetail.joins[i].order.orderno
              setInterval(function () {
                _.ordertime = _.groupProductDetailFormatTime(this.groupDetail.joins[i].orderpayexpiretime.replace(/-/g, '/'))
              }, 1000)
              break
            } else {
              ispaid = this.groupDetail.joins[i].order.hasOwnProperty('payedat')
              orderStatus = this.groupDetail.joins[i].order.orderstatus
              this.currentOrderno = this.groupDetail.joins[i].order.orderno
              setInterval(function () {
                _.ordertime = _.groupProductDetailFormatTime(_.groupDetail.joins[i].orderpayexpiretime.replace(/-/g, '/'))
              }, 1000)
            }
          }
        }
      }
      if (orderStatus !== null) {
        switch (this.groupDetail.status) {
          case 0:
            this.btnObj.text = '继续支付'
            this.btnObj.type = 5
            this.btnObj.status = 5
            break
          case 1:
            if (ispaid) {
              this.btnObj.text = '还差' + this.groupDetail.remainingcount + '人, 邀请好友参团'
              this.btnObj.type = 2
              this.btnObj.status = 1
            } else if (orderStatus === 4) {
              this.btnObj.text = '重新开团'
              this.btnObj.type = 3
              this.btnObj.groupBuyType = 1
              this.btnObj.status = 4
            } else if (orderStatus === 0) {
              this.btnObj.text = '继续支付'
              this.btnObj.type = 5
              this.btnObj.status = 5
            }
            break
          case 2:
            if (ispaid) {
              this.btnObj.text = '查看订单详情'
              this.btnObj.type = 1
              this.btnObj.status = 2
            } else if (orderStatus === 4) {
              this.btnObj.text = '重新开团'
              this.btnObj.type = 3
              this.btnObj.groupBuyType = 1
              this.btnObj.status = 4
            } else if (orderStatus === 0) {
              this.btnObj.text = '继续支付'
              this.btnObj.type = 5
              this.btnObj.status = 5
            }
            break
          case 3:
            if (ispaid) {
              this.btnObj.text = '重新开团'
              this.btnObj.type = 3
              this.btnObj.groupBuyType = 1
              this.btnObj.status = 3
              break
            } else {
              this.btnObj.text = '重新开团'
              this.btnObj.type = 3
              this.btnObj.groupBuyType = 1
              this.btnObj.status = 4
              break
            }
        }
      } else {
        switch (this.groupDetail.status) {
          case 1:
            this.btnObj.text = '一键参团'
            this.btnObj.type = 4
            this.btnObj.groupBuyType = 2
            this.btnObj.status = 1
            break
          case 2:
            this.btnObj.text = '我要开团'
            this.btnObj.type = 3
            this.btnObj.groupBuyType = 1
            this.btnObj.status = 2
            break
          case 3:
            this.btnObj.text = '我要开团'
            this.btnObj.type = 3
            this.btnObj.groupBuyType = 1
            this.btnObj.status = 3
            break
        }
      }
    },
    GetQueryString: function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  }
}
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
  padding-bottom: 11px;
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
  font-size: 16px;
  font-weight: bold;
  font-family: BASE_PRICE;
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
  margin-top: 12px;
  margin-left: 3%;
}
.sharePage .list li .countDown {
  width: 35%;
  margin-top: 8px;
}
.sharePage .list li .countDown span {
  display: block;
  font-size: 12px;
  line-height: 24px;
  text-align: right;
}
.sharePage .list li .countDown span:nth-child(1) {
  color: #ffc700;
}
.sharePage .list li .countDown span:nth-child(2) i {
  color: #333333;
  font-size: 14px;
  font-style: normal;
}
.sharePage .list li .offered {
  width: 20%;
  background: #ffc700;
  height: 100%;
  margin-left: 2%;
  text-align: center;
  color: #333;
  line-height: 60px;
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



