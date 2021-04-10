
<template>
  <div class="wrapper">
    <!-- 头部 -->
    <v-headerscopy v-if="!$root.ISAPP"
                   bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">购买抽取次数</h3>
      </div>
    </v-headerscopy>
    <!-- 购买类型 -->
    <div class="buy-type-bg">
      <div class="buy-type-wrapper flex flex-between"
           :class="choosetype === index? 'act': ''"
           v-for="(item, index) in buyList"
           :key="'buyList' + index"
           @click="changeChoose(index)">
        <div class="content-left">
          <span v-if="type == 4 && item.count == 10">全(all buy)收</span>
          <div v-else><span class="num">{{item.count}} </span>次</div>
        </div>
        <div class="content-right">
          <span class="yen">¥</span>{{item.price}}
        </div>
      </div>
    </div>

    <!-- 说明框 -->
    <div class="cotnent"
         v-if="buyList.length">
      <p class="content-title">充值说明细则</p>
      <p class="content-words"
         v-if="type != 4">
        1. 砖仓线上抽抽乐：花费{{buyList[0].price}}元可在线抽取1次，花费{{buyList[1].price}}元可在线抽取5次，有机会获得稀有人仔，后期可获得更多增值权益；
      </p>
      <p class="content-words"
         v-else>
        1. 斗牛线上抽抽乐：花费{{buyList[0].price}}元可在线抽取1次，花费{{buyList[1].price}}元可在线抽取5次，有机会获得稀有人仔，后期可获得更多增值权益。特别提示：一番赏系列中独特的“全收”将会动态根据所在系列的进度一次性收取，“全收”每次的金额不固定请您知悉。
      </p>
      <p class="content-words"
         v-if="type != 4">
        2. 商品稀有度划分：商品根据稀有程度将分为四个等级（SSR、SR、R、N），获取概率依据稀有程度各不相同；
      </p>
      <p class="content-words"
         v-else>
        2.商品稀有度划分：非一番赏系列根据稀有程度将分为四个等级（SSR SR R N）、获取概率依据稀有程度各不相同。一番赏系列从高到低依次为A赏、B赏、C赏、D赏、EFGHI.....不同的主题，不同的篇章，通常包含的奖项数目是会有不同的。其中Last大赏为第80抽买主必得奖品。
      </p>
      <p class="content-words">
        3. 幸运值：每抽取一次，均会增加一定数量的幸运值，幸运值越高，获得稀有物品的机会就越大，当幸运值达到100时，必能获得一个SSR或SR商品；
      </p>
      <p class="content-words">
        4. 发货：在线抽取的商品将保存在您的乐高积存柜中，可在【积存柜】中查看，您可选择合并发货，以节省运费。
      </p>
    </div>
    <!-- footer -->
    <div class="footer-wrapper fix-btm">
      <div class="footer-words"
           @click="changeReadState"
           :class="{'act-circle': isRead}">我已阅读《充值说明细则》</div>
      <div class="footer-btn flex flex-center"
           :class="{'disable': !isRead}"
           @click="pay">立即支付</div>
    </div>
    <!-- 支付 -->
    <Pay v-if="payOrderno"
         :payorderno="payOrderno"
         :dataid="buyList[choosetype].price.toString()"
         :model="true"
         :close="true"
         :type="2"
         @close="payModelClose"></Pay>
  </div>
</template>

<script>
import { DrawPurchase } from '@/common/api/active'
import Pay from '@/components/sneaker/Pay'
import { mapMutations } from 'vuex'

const ISDEV = process.env.NODE_ENV !== 'production'

export default {
  name: 'PurchaseTimes',
  components: { Pay },
  data() {
    return {
      payOrderno: '',
      isRead: false,
      choosetype: 0,
      buyList: [],
      type: ''
    }
  },
  created() {
    const { tabid, type } = this.$route.query
    this.type = type || ''
    this.getDetail({ tabid })
    if (tabid) {
      this.UPDATE_ACTIVEID(tabid)
    }
    this.setToolBar({
      title: '购买抽取次数',
      bgcolor: '#f5f5f5',
      textcolor: '#323232'
    })
  },
  mounted() {
    const _ = this
    window._appPayCallback = function (ret) {
      // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
      if (!ISDEV) {
        window.gdt('track', 'PURCHASE', { click: 'pay' })
        window.meteor.track('shopping', { convert_id: '1679400539140103' })
      }
      if (ret == 1) {
        // 支付成功条转抽抽乐抽奖页面
        _.$router.replace('/activity/luckDraw')
      }
    }
  },
  methods: {
    ...mapMutations(['UPDATE_ACTIVEID']),
    payModelClose() {
      this.payOrderno = ''
    },
    changeChoose(index) {
      this.choosetype = index
    },
    getDetail(param) {
      DrawPurchase(param)
        .then((res) => {
          console.log('购买详情结果 ===> ', res)
          if (res && res.length) {
            this.buyList = res
          }
        })
        .catch((err) => {
          console.log('购买详情报错 ===> ', err)
        })
    },
    changeReadState() {
      this.isRead = !this.isRead
    },
    // 立即支付
    pay() {
      if (!this.isRead) {
        this.toast('请选阅读充值说明细则')
        return
      }
      if (this.$root.ISAPP) {
        // app支付
        this.javascriptBridge({
          name: 'callAppPayment',
          params: {
            callbackname: '_appPayCallback',
            paymoney: this.buyList[this.choosetype].price,
            listreq: {
              paytype: 2 // 2: 抽抽乐
            },
            prepayreq: {
              dataid: this.buyList[this.choosetype].price,
              paysource: 27 // 27:抽抽乐
            }
          }
        })
      } else {
        this.payOrderno = 'rechargeNB'
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 30vw;
}
.buy-type-bg {
  background-color: #fff;
  padding: 5.33vw;
}
.buy-type-wrapper {
  width: 100%;
  height: 20.27vw;
  border-radius: 9px;
  padding: 0 5.33vw 0 8vw;
  border: 2px solid #969696;
  color: #646464;
  font-size: 5.33vw;
}
.buy-type-wrapper.act {
  color: #fa2337;
  border: 2px solid #fa2337;
}

.buy-type-wrapper:not(:last-child) {
  margin-bottom: 3.73vw;
}
.buy-type-content {
  width: 86.67vw;
  height: 21.067vw;
  border-radius: 9px;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.buy-type-content.act {
  border-radius: 9px;
}

.buy-type-content-item {
  width: 85.6vw;
  height: 20vw;
  /* width: 321px;
  height: 75px; */
  border-radius: 9px;
  background: linear-gradient(180deg, #3a3b3c, #262628);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 9.33vw 0 6.67vw;
}

.content-left {
  font-size: 5.333vw;
  font-weight: 600;
}

.num {
  font-size: 8vw;
  font-family: 'OswaldBold';
  font-weight: bold;
}
.content-right {
  font-size: 5.33vw;
  text-align: left;
  font-weight: 600;
}
.yen {
  font-size: 4.27vw;
}

.btn-wrapper {
  width: 100%;
  height: 18.67vw;
  line-height: 18.67vw;
  background: linear-gradient(180deg, #292828, #292828);
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5) inset;
}

.btn {
  width: 73.33vw;
  height: 13.33vw;
  line-height: 13.33vw;
  text-align: center;
  background: linear-gradient(
    180deg,
    #eecda8 2%,
    #fdcb73 6%,
    #f29c3c 99%,
    #2a0f05
  );
  border-radius: 8px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.91);
  font-size: 4.267vw;
  font-weight: 600;
  color: #000000;
}

.content-words {
  font-size: 3.73vw;
  text-align: left;
  line-height: 6.93vw;
}
.content-words:not(:last-child) {
  margin-bottom: 4.8vw;
}
.content-title {
  width: 100%;
  text-align: center;
  margin-bottom: 4vw;
  font-size: 4.27vw;
  color: #646464;
}
.cotnent {
  width: 100%;
  color: #646464;
  padding: 5.33vw 8vw;
}
.footer-wrapper {
  min-height: 26.67vw;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 3.2vw 4vw;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-words {
  font-size: 3.733vw;
  margin-bottom: 2.67vw;
  color: #646464;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-words:before {
  content: '';
  display: block;
  width: 4.27vw;
  height: 4.27vw;
  border-radius: 50%;
  border: 2px solid #b4b4b4;
  margin-right: 2.13vw;
}

.act-circle:before {
  background: url('//files.eyee.com/eyeeh5/img/draw/draw07.png') no-repeat;
  background-size: contain;
  border: none;
}

.footer-btn {
  width: 100%;
  height: 12.27vw;
  background-color: #fa2337;
  font-size: 4.27vw;
  color: #fff;
  border-radius: 45px;
}

.disable {
  opacity: 0.5;
}
</style>