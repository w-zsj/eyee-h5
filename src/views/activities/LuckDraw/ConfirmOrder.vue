<template>
  <div class="wrapper">
    <!-- 头部 -->
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3 style="color: #232323; font-weight: 600">确认订单</h3>
      </div>
    </v-header>
    <!-- 收货地址 -->
    <div class="addressWrapper flex"
         @click="toRoute('/user/address')">
      <div class="locationWarpper flex"
           v-if="userDefaultAddress && Object.keys(userDefaultAddress).length">
        <span class="location"></span>
        <div class="address">
          <p class="contacts">
            <span class="contacts-name">{{ userDefaultAddress.receiver }}</span><span>{{ userDefaultAddress.mobile }}</span>
          </p>
          <p class="address-desc">{{ userDefaultAddress.address }}</p>
        </div>
      </div>
      <div class="add-address"
           v-else>请添加收货地址</div>
      <span class="icon-right"></span>
    </div>
    <!-- 商品列表 -->
    <div class="productList">
      <div class="product-item flex"
           v-for="(item, index) in rewardList"
           :key="'rewardList' + index">
        <div class="left">
          <img class="left-img"
               :src="item.image" />
        </div>
        <div class="right flex flex-col">
          <p class="right-title ellipsis-2">{{ item.goodsname }}</p>
          <div class="flex flex-end right-desc">
            <!-- <div>
              <span>{{item.goodstype|filtertitle(goodstypes)}}</span>
              <span>*{{item.extraquantity}}</span>
            </div> -->
            <div class="flex flex-end">
              <!-- <span class="right-desc">{{item.goodstype|filtertitle(goodstypes)}}</span> -->
              <div class="actbtn flex flex-between">
                <span class="icon sub"
                      @click="sub(item, index)">-</span>
                <span class="show">{{ item.extraquantity }}</span>
                <span class="icon plus"
                      @click="plus(item)">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-between productlist-fee">
        <span>配送费用</span>
        <span>¥{{ deliveryInfo.expressfee }}</span>
      </div>
    </div>
    <!-- 提醒须知 -->
    <div class="tipNotice">
      <p class="tipNotice-words">*特别提醒：建议您提前与快递员沟通</p>
      <p class="tipNotice-words">
        *提交订单即表示同意 &nbsp;<span class="notice"
              @click="toRoute('/buyerSellKnow?type=2')">交易须知</span>
      </p>
    </div>

    <!-- 底部 -->
    <div class="footer fix-btm">
      <div class="flex flex-between footer-content">
        <div>
          合计件数：<span class="blod">{{ num }}</span>
        </div>
        <div class="btn"
             @click="submitOrder">提交订单</div>
      </div>
    </div>

    <!-- 支付 -->
    <Pay v-if="payOrderno && !$root.ISAPP"
         :payorderno="payOrderno"
         :model="true"
         :close="true"
         :type="2"
         @close="payModelClose"></Pay>
  </div>
</template>

<script>
import { AddressDefault } from '@/common/api/user'
import { mapGetters, mapMutations } from 'vuex'
import Pay from '@/components/sneaker/Pay'
import { DrawDeliveryFee, DrawConfirmOrder } from '@/common/api/active'
const ISDEV = process.env.NODE_ENV !== 'production'

export default {
  name: 'ConfirmOrder',
  data() {
    return {
      payOrderno: '',
      deliveryInfo: {},
      goodstypes: [
        {
          title: '全新',
          id: 1
        },
        {
          title: '拆袋',
          id: 2
        },
        {
          title: '预售',
          id: 3
        }
      ]
    }
  },
  components: { Pay },
  filters: {
    filtertitle(value, type) {
      const index = type.findIndex((ele) => ele.id == value)
      if (index > -1) {
        return type[index].title
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'userInfo',
      userDefaultAddress: 'userDefaultAddress',
      rewardList: 'rewardList'
    }),
    num() {
      let number = 0
      if (this.rewardList && this.rewardList.length) {
        this.rewardList.forEach((item) => {
          number += parseInt(item.extraquantity)
        })
      }
      return number
    }
  },
  mounted() {
    const _ = this
    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault()
      else {
        setTimeout(() => {
          _.GetAddressDefault()
        }, 800)
      }
    } else {
      _.getDeliveryFee()
    }
  },
  methods: {
    ...mapMutations({ upreward: 'UPDATE_REWARDLIST' }),
    payModelClose() {
      this.payOrderno = ''
    },
    submitOrder() {
      let params = {}
      if (!this.rewardList.length) {
        this.toast('提货商品不能为空!')
        return
      }
      if (!Object.keys(this.userDefaultAddress).length) {
        this.toast('请先添加收货地址!')
        return
      }
      params.addressid = this.userDefaultAddress.addressid
      params.templateid = this.deliveryInfo.expresstemplateitemid
      params.list = this.rewardList.map((ele) => {
        let obj = {}
        obj.id = ele.id
        obj.count = ele.extraquantity
        return obj
      })
      // console.log('submitOrder params ----', params)
      DrawConfirmOrder(params)
        .then((res) => {
          console.log("确认提交订单结果 ===> ", res);
          if (res && Object.keys(res).length) {
            this.payOrderno = res.orderno
            if (this.$root.ISAPP) {
              window._appPayCallback = (ret) => {
                // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
                if (!ISDEV) {
                  window.gdt('track', 'PURCHASE', { click: 'pay' })
                  window.meteor.track('shopping', {
                    convert_id: '1679400539140103'
                  })
                }
                if (ret == 1 || ret == 2) {
                  // 支付成功条转抽抽乐抽奖页面
                  console.log('ret--', ret)
                  delete window._appPayCallback
                  this.javascriptBridge({
                    name: 'callAppOrderDetail',
                    params: {
                      type: 4,
                      orderno: this.payOrderno
                    }
                  })
                }
              }
              // app支付
              this.javascriptBridge({
                name: 'callAppPayment',
                params: {
                  callbackname: '_appPayCallback',
                  paymoney: this.deliveryInfo.expressfee,
                  listreq: {
                    paytype: 2, // 2: 抽抽乐,
                    orderno: res.orderno
                  },
                  prepayreq: {
                    paysource: 3, // 27:抽抽乐
                    orderno: res.orderno
                  }
                }
              })
            }
          }
        })
        .catch((err) => {
          this.toast(err.msg)
          console.error('确认提交订单报错 ===>', err)
        })
    },
    getDeliveryFee() {
      let params = {}
      params.addressid = this.userDefaultAddress.addressid
      // params.productid = ''
      // this.rewardList.forEach((ele) => {
      //   params.productid += ele.id
      // })
      // params.count = this.num
      DrawDeliveryFee(params)
        .then((res) => {
          console.log('配置运费结果 ===> ', res)
          if (res && Object.keys(res).length) {
            this.deliveryInfo = Object.assign({}, res)
          }
        })
        .catch((err) => {
          this.deliveryInfo = {
            name: '上海市,江苏省,浙江省,安徽省',
            expressfee: 14.0,
            expresstemplateitemid: 'SOQlE0Bg'
          }
          console.log('配置运费报错 ===>', err)
        })
    },
    plus(item) {
      if (item.extraquantity >= item.count) return
      if (item.extraquantity < item.count) {
        item.extraquantity = parseInt(item.extraquantity) + 1
        this.upreward(this.rewardList)
      }
    },
    sub(item, index) {
      if (item.extraquantity <= 1) {
        this.rewardList.splice(index, 1)
        this.upreward(this.rewardList)
      } else {
        item.extraquantity = parseInt(item.extraquantity) - 1
        this.upreward(this.rewardList)
      }
    },
    GetAddressDefault() {
      // 获取默认地址
      AddressDefault({ token: this.user.token })
        .then((res) => {
          if (res && Object.keys(res).length) {
            console.log('获取默认地址结果 ===> ', res)
            res.mobile = res.mobile.split('-')[1]
            // this.userDefaultAddress = res
            this.$store.dispatch('setDefaultAddress', res)
            this.getDeliveryFee()
          }
        })
        .catch((err) => {
          console.error('获取默认地址结果报错 ===> ', err)
        })
    },
    toRoute(path) {
      if (path.includes('address')) {
        sessionStorage.setItem('address', '1')
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 27vw;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 0 4vw;
}

.btn {
  width: 32.533vw;
  height: 12.267vw;
  line-height: 12.267vw;
  text-align: center;
  border-radius: 6.67vw;
  background-color: #c8af6e;
  white-space: nowrap;
  color: #fff;
  font-size: 4.8vw;
  font-weight: 600;
  color: #ffffff;
}

.ipx:after {
  content: '';
  display: block;
  width: 100%;
  height: 9.067vw;
  background-color: #fff;
}
.footer-content {
  height: 18.67vw;
  line-height: 18.67vw;
  font-size: 3.73vw;
  font-weight: 600;
  color: #232323;
}

.footer-content .blod {
  font-size: 5.867vw;
  font-weight: 700;
  text-align: left;
  color: #232323;
  font-family: 'OswaldBold';
}

.tipNotice {
  padding: 4vw;
}

.tipNotice-words {
  font-size: 3.467vw;
  font-weight: 400;
  color: #969696;
}

.notice {
  font-size: 3.467vw;
  font-weight: 600;
  color: #232323;
}

.productList {
  padding: 0 4vw;
  background-color: #fff;
  overflow: hidden;
}
.productlist-fee {
  font-size: 3.733vw;
  font-weight: 400;
  text-align: right;
  color: #232323;
  height: 9.067vw;
  line-height: 9.067vw;
  margin-bottom: 2.67vw;
}

.product-item {
  background-color: #f0f0f0;
  border-radius: 3.2vw;
  padding: 2.67vw;
  margin-bottom: 2.67vw;
}
.left {
  background: #fff;
  border-radius: 12px;
}

.right {
  flex: 1;
  padding: 0 1.33vw 0 3.2vw;
  justify-content: space-between;
}

.right-desc {
  font-size: 3.2vw;
  font-weight: 400;
  color: #232323;
}

.right-title {
  font-size: 4.267vw;
  font-weight: 600;
  color: #232323;
}

.left-img {
  width: 24vw;
  height: 24vw;
  border-radius: 3.2vw;
  vertical-align: bottom;
}

.contacts-name {
  margin-right: 4vw;
}

.contacts {
  font-size: 3.733vw;
  font-weight: 600;
  color: #232323;
}

.address {
  flex: 1;
}

.address-desc {
  font-size: 3.733vw;
  font-weight: 400;
  color: #646464;
}

.addressWrapper {
  padding: 3.733vw 4vw;
  background-color: #fff;
  align-items: center;
}

.location {
  display: block;
  width: 6.2vw;
  height: 7.467vw;
  background: url('../../../../static/imgs/mall/location.png') no-repeat;
  background-size: cover;
  margin-right: 3.2vw;
}
.icon-right {
  display: block;
  width: 3.2vw;
  height: 3.2vw;
  background: url('../../../../static/imgs/mall/icon_more_righ.png') no-repeat;
  background-size: contain;
}
.add-address {
  flex: 1;
}
.locationWarpper {
  flex: 1;
  align-items: center;
}
.actbtn .icon {
  color: #c8af6e;
  font-weight: 800;
  font-size: 4.8vw;
  width: 30%;
}
.actbtn {
  width: 26.133vw;
  height: 9.067vw;
  line-height: 9.067vw;
  border-radius: 5.33vw;
  background-color: #fff;
  padding: 0 3.2vw;
}
.show {
  flex: 1;
  text-align: center;
}
.plus {
  text-align: right;
}
</style>