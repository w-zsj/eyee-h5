<template>
    <div>
      <div>
        <section class="cart_head" >
          <div class="ellipsis flex-aic">
            <i class='tilt' :class="item.order.businesstype==3?'ico-sp-store':(item.order.businesstype==2?'ico-sp-buy':'ico-sp-official')"></i>
            <span class="busName" @click.stop="goShopDetail(item.order.businessid)">{{item.order.businessname}}</span>
            <p class="padding flex-center">
              <span class="rights_icon"></span>
            </p>
            <span class="icon_server service_black" @click.stop="QiyuProd"></span>
          </div>
          <div class="status_order" :class="{ 'gray': gray }">
            <span>{{orderStatus.currentStatus}}</span>
          </div>
        </section>
      </div>
      <div class="cart_content flex-aic" @click.stop='groupDetail(1, item)'>
        <div class="img_box">
          <img v-lazy="https(item.order.imageurl)" alt="">
        </div>
        <div class="cart_info">
          <p class="ellipsis">{{item.order.pname}}</p>
          <p>
            单价：¥{{item.teamprice}}
            <em class="spec_sale">¥{{item.marketprice | tofixed}}</em>
          </p>
          <p >{{item.order.color}} , {{item.order.size}} , x{{item.order.productcount}}</p>
        </div>
      </div>
      <section class="flex check_footer">
        <p>共1件商品</p>
        <div >
          <p class="flex-between" >
            <span>商品总额:</span>
            <em class="">¥{{parseFloat(item.order.productamount) | tofixed}}</em>
          </p>
          <p class="flex-between">
            <span>运费:</span>
            <span>¥{{parseFloat(item.order.expressamount) | tofixed}}</span>
          </p>
          <p class="flex-between">
            <span>总计:</span>
            <span class="pcolor">¥{{parseFloat(item.order.totalamount) | tofixed}}</span>
          </p>
        </div>
      </section>
      <p class="order_tip" v-if="btnNum == 3">
        <!-- (开团倒计时) -->
        <i>剩余时间</i>:
        <span v-if="timeData.H>=0">{{timeData.H>=10?timeData.H:'0'+timeData.H}} : </span>
        <span v-if="timeData.m>=0">{{timeData.m>=10?timeData.m:'0'+timeData.m}} : </span>
        <span v-if="timeData.s>=0">{{timeData.s>=10?timeData.s:'0'+timeData.s}}</span>
      </p>
      <p class="order_pay" v-if="btnNum == 2">
        <i>请在</i>
          <span v-if="timeData.m>=0">{{timeData.m>=10?timeData.m:'0'+timeData.m}}</span>:
          <span v-if="timeData.s>=0">{{timeData.s>=10?timeData.s:'0'+timeData.s}}</span> 
        <i>分内完成支付</i>  
      </p>
      <section class=" footer_orderBtn" >
        <div class="special_tips" :class="bgClass">
           <span >{{orderStatus.orderText}}</span>
        </div>
        <div class="order_btn_box">
          <div class="btn_div" @click.stop='groupDetail(1, item)'>拼团详情</div>
          <div class="btn_div btn_detail" v-if="orderStatus.groupBtn!=''" 
           @click.stop='groupDetail(btnNum, item)' :class="bgClass">{{orderStatus.groupBtn}}</div>
        </div>
      </section>
    </div>
</template>
<script>
import { DateDiff } from '../../common/util'
import { QiyuProd } from '../../common/api/WyQiyu'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      timeData: {},
      payTimeDate: {},
      btnNum: 1,
      bgClass: '',
      gray: false
    }
  },
  props: {
    item: Object
  },
  computed: {
    ...mapGetters({
      insq: 'insq'
    }),
    orderStatus() {
      // btnNum 1 拼团详情 2 继续支付 3邀请参团
      let i = this.item
      let ispaid = i.order.hasOwnProperty('payedat')
      let groupInfo = {}
      switch (i.status) {
        case 0:
          if (i.order.orderstatus === 0 && !ispaid) {
            groupInfo.currentStatus = '拼团中'
            groupInfo.orderText = ''
            groupInfo.groupBtn = '继续支付'
            this.btnNum = 2
            this.bgClass = 'bgPay'
            this.setentime(i.orderpayexpiretime, 'm')
          }
          break
        case 1:
          if (i.order.orderstatus === 0 && !ispaid) {
            groupInfo.currentStatus = '拼团中'
            groupInfo.orderText = ''
            groupInfo.groupBtn = '继续支付'
            this.btnNum = 2
            this.bgClass = 'bgPay'
            this.setentime(i.orderpayexpiretime, 'm')
          } else if (i.order.orderstatus === 4 && !ispaid) {
            groupInfo.currentStatus = '拼团失败'
            groupInfo.orderText = '未完成支付, 拼团失败'
            groupInfo.groupBtn = ''
            this.gray = true
          } else if (ispaid) {
            groupInfo.currentStatus = '拼团中'
            groupInfo.orderText = '还差' + i.remainingcount + '人成团'
            groupInfo.groupBtn = '邀请拼团'
            this.bgClass = 'coloryellow'
            this.btnNum = 3
            this.setentime(i.endtime, 'H')
          }
          break
        case 2:
          if (i.order.orderstatus === 0 && !ispaid) {
            groupInfo.currentStatus = '拼团中'
            groupInfo.orderText = ''
            groupInfo.groupBtn = '继续支付'
            this.btnNum = 2
            this.bgClass = 'bgPay'
            this.setentime(i.orderpayexpiretime, 'm')
          } else if (i.order.orderstatus === 4 && !ispaid) {
            groupInfo.currentStatus = '拼团失败'
            groupInfo.orderText = '未完成支付, 拼团失败'
            groupInfo.groupBtn = ''
            this.gray = true
          } else if (ispaid) {
            groupInfo.currentStatus = '拼团成功'
            groupInfo.orderText = ''
            groupInfo.groupBtn = ''
          }
          break
        case 3:
          if (!ispaid && i.order.orderstatus === 4) {
            groupInfo.currentStatus = '拼团失败'
            groupInfo.orderText = '未完成支付, 拼团失败'
            groupInfo.groupBtn = ''
            this.gray = true
          } else {
            groupInfo.currentStatus = '拼团失败'
            groupInfo.orderText = '超过有效时间, 拼团失败'
            groupInfo.groupBtn = ''
            this.gray = true
          }
          break
      }

      return groupInfo
    }
  },
  methods: {
    entime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type })
    },
    setentime(time, type) {
      let _ = this
      setInterval(function () {
        _.entime(time, type)
      }, 1000)
    },
    goShopDetail(businessid) {
      this.$router.push('/shop/shopdetail/' + businessid)
    },
    // 拼团详情 chuan 团id
    // btnNum 1 拼团详情 2 继续支付 3邀请参团
    groupDetail(num, team) {
      if (num === 1) {
        this.$router.push({
          path:'/groupbuy/detail/' + team.teamid,
          query:{orderno:team.order.orderno}
        })
      } else if (num === 2) {
        let url = '/pay/' + team.order.orderno
        if (this.insq) url = `/frame/${encodeURIComponent(url)}`
        this.$router.push(url)
      } else if (num === 3) {
        // 邀请好友参团
        this.loadApp()
      }
    },
    QiyuProd() {
      QiyuProd.call(this)
    }
  }
}
</script>
<style scoped>
.busName {
  font-size: 14px;
}
.pcolor {
  color: #ffc700;
}

.cart_head {
  position: relative;
  border-bottom: 1px solid #fafafa;
  padding: 15px 0px;
}
.cart_head .flex- {
  align-items: center;
}
.cart_head .status_order {
  position: absolute;
  right: 0;
  top: 15px;
  color: #ffc700;
}
.cart_head .status_order.gray{
  color: #999;
}
.order_head {
  padding: 15px 0px;
}

.check_footer {
  justify-content: space-between;
  padding: 15px 0;
}

.check_footer p > span:nth-of-type(1) {
  margin-right: 30px;
  display: inline-block;
  width: 71px;
  text-align: right;
}

.check_footer p {
  margin-bottom: 10px;
}
.check_footer .spec_sale {
  text-decoration: line-through;
  color: #666;
}

.footer_orderBtn,
.order_tip {
  border-top: 1px solid #fafafa;
  width: 100%;
  padding: 15px 0;
  overflow: hidden;
}

.order_tip {
  text-align: right;
}
.order_tip i {
  position: relative;
  font-style: normal;
  padding-left: 20px;
}
.order_tip i::before,
.order_tip i::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 5px;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  left: 5px;
  top: 4px;
}
.order_tip i::after {
  width: 14px;
  height: 14px;
  border: 1px solid #333;
  border-radius: 50%;
  left: 0;
  top: 0;
}
.order_tip span {
  color: #000;
  font-size: 13px;
  display: inline-block;
  text-align: left;
  font-weight: bold;
}
.order_pay {
  text-align: right;
  line-height: 24px;
}
.order_pay i {
  font-style: normal;
}
.order_pay span {
  color: #000;
  font-size: 13px;
  display: inline-block;
  width: 16px;
  font-weight: bold;
  /* text-align: left; */
}
.order_btn_box {
  /* width: 100%; */
  text-align: right;
  float: right;
}
.order_btn_box .btn_div {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 5px 7px;
  font-size: 12px;
  border-radius: 2px;
  color: #999;
  /* margin-left: 10px; */
}
.order_btn_box .btn_div.btn_detail {
  color: #333;
}
.order_btn_box .duo_btn_div {
  color: #ffc700;
  border: 1px solid #ffc700;
}
.order_btn_box .or_now {
  border: 1px solid #ffc700;
  color: #ffc700;
}

.order_unit .icon_server {
  width: 15px;
  height: 15px;
  /* display: inline-block; */
  margin-left: 5px;
  /* vertical-align: middle; */
}

.order_cost {
  width: 100%;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
}

.order_cost p {
  border-bottom: 1px solid #fafafa;
  padding: 10px 0;
  margin-bottom: 0;
}

.order_cost p:nth-last-of-type(1) {
  border: none;
}

.order_unitbox {
  box-shadow: none;
  padding: 0;
}

.order_h,
.order_cost,
.or_status {
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  padding: 0 10px;
  border-radius: 4px;
}

.or_status .pay_style {
  margin-bottom: 20px;
}

.or_status {
  padding: 20px 10px;
}

.order_dbtn {
  border: none;
}

.copyBtn {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 3px 12px;
  font-size: 12px;
}

.or_no input {
  display: inline-block;
  width: 65%;
  color: #666;
}

.or_no {
  width: 80%;
}

.uncloseOrder {
  color: #ffc700;
}

.closeOrder {
  color: #999;
}
.special_tips {
  /* white-space: nowrap; */
  /* width: 20%; */
  float: left;
  margin-top: 8px;
  color: #999;
}
.special_tips.coloryellow {
  color: #ffc700;
}
.pay-end-time {
  text-align: right;
  /* margin-bottom: 10px; */
}
.end-content {
  /* display: flex; */
  /* width: 25%; */
  /* justify-content: flex-end; */
  float: left;
}
.end-content span {
  min-width: 20px;
  line-height: 24px;
}
.order_btn_box .btn_div.btn_detail.bgPay {
  color: #fff;
  border: 1px solid #000;
  background: #000;
  margin-left: 3px;
}
.order_btn_box .btn_div.coloryellow {
  border-color: #ffc700;
  background: #ffc700;
  color: #000;
  margin-left: 3px;
}
.cart_content {
  width: 100%;
  position: relative;
  height: 110px;
  border-bottom: 1px solid #fafafa;
  padding: 0 10px;
}

.cart_content .cart_info {
  width: 60%;
  font-size: 12px;
}

.cart_content .img_box {
  position: relative;
  width: 23%;
  margin-right: 6px;
}
.cart_content .img_box .unUser_pro {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 0 5px;
  color: #fff;
  text-align: center;
}
.cart_info p {
  margin: 5px 0;
}
.cart_info .spec_sale {
  text-decoration: line-through;
  color: #666;
}
.edit_box {
  width: 70%;
}
</style>


