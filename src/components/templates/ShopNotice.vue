<template>
  <div class="buy-read">
    <h1 class="buy-title" v-if="!issale && !title">购物须知</h1>
    <div v-if="issale==1" class="head">
      <h2 class="even">售后无忧</h2>
      <p>消费者在满足7天无忧售后条件的前提下，可以提出“7天无理由退换货”的申请</p>
    </div>
    <div v-else class="head">
      <h2 class="even">不支持退换货</h2>
      <p>该商品除质量问题外不予以退还，购买该商品则默认您同意此条款</p>
    </div>
    <h2 class="odd">常见问题&售后说明</h2>
    <p>Q：为什么商品价格和付款的价格不一样呢？</p>
    <p class="odd">A：付款的金额包含了商品价格以及物流费用，商品价格只是商品本身的售价。</p>
    <p>Q：下单之后，需要多久完成付款？</p>
    <p class="odd">A：一般提交订单后需要30分钟内完成付款，过时系统会自动关闭订单，有些限量发售的商品由于抢购人数过多，可能会出现超卖现象，潮牛买手会按照先到先得的原则安排发货，对于超卖的订单会进行退款处理，敬请谅解和配合。</p>
    <p>Q：什么时候发货？</p>
    <p class="odd">A：通常情况下是订单生成后的48小时内发出，如遇重大促销节日，不可抗力等特殊情况可能会存在到货时间略有延误，另行约定发货时间的，请以商品详情标注为准。</p>
    <p>Q：为什么收到的商品与照片存在色差？</p>
    <p class="odd"> A：由于拍摄角度，设备等不同因素可能会导致实物与图片存在一定的色差，最终颜色以实物为准。</p>
    <p>Q：长时间没收到订购的商品怎么办？</p>
    <p class="odd"> A：如果您的订单长时间没有送达，您可以拨打我们的客服热线021-60663633与我们取得联系，有任何问题，我们会第一时间为您解决，您还可以联系官方物流公司进行查询。</p>
    <h3>一、配送方式</h3>
    <p class="odd">发货：商品由品牌方或者商家直接发出，通过快递派送到您手上。因每个商家合作快递不同，商家发货时效均会存在差异。 快递：平台商家提供的快递选项是指除顺丰意外的其他普通快递。</p>
    <h3>二、售后服务</h3>
    <p>1.退货条件：</p>
    <p>(1) 因不同的商家和品牌方，退换货条件不同所有会有差异，具体以店铺描述页面详情为准或者直接联系在线客服。</p>
    <p class="even">(2) 退回商品必须保证不影响商品的二次销售，有出现影响二次销售的，应当跟商家协商退款处理 </p>
    <p>2.鞋类退货说明：</p>
    <p class="even">鞋类商品因为品牌方的限制，所以在收到货后有质量问题的及时联系反馈在线客服，我们会及时为您办理退换货，如因为穿着后发生的质量问题，商家或者品牌方是不支持退换，敬请谅解（除特殊活动商品，有特殊备注商品以商品详情说明处理)。</p>
    <p>3.申请退货流程</p>
    <p class="even">进入订单中心—订单详情—选择退换的商品—点击“申请售后”—选择售后服务—填写相关售后内容。也可以联系在线客服咨询相关服务。</p>
    <p>4.退款说明</p>
    <p>(1) 邮费退还</p>
    <p>客户主观原因退货，客户承担退回运费，非用户责任，商家承担运费。</p>
    <p>(2) 优惠券退还</p>
    <p>商品进行售后退款时，平台优惠券、牛丸、商家优惠券等不会自动退回。</p>
    <p>(3) 因客户原因拒收的包裹造成发货和退货的物流费，将有用户自行承担相关费用。</p>
    <p>(4) 客服在线时间：9：00-22：00。</p>
    <!-- <img alt v-for="(item,index) in imgs" :key="index" :src="https(item)+'?c='+timer" /> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // imgs: [
      //   "https://files.eyee.com/mcdn/img/prddetail/aftersale03.png",
      //   "https://files.eyee.com/mcdn/img/prddetail/aftersale04.png",
      //   "https://files.eyee.com/mcdn/img/prddetail/aftersale05.png"
      // ],
      issale: 0,
      timer: new Date().getTime()
    };
  },
  props: {
    title: { type: Boolean, default: false },
    isaftersale: { type: Number, default: 0 }
  },
  mounted() {
    let _ = this,
      url = "";
    if (!!_.isaftersale) _.issale = _.isaftersale;
    else _.issale = _.$route.query.aftersale;
    // if (_.issale == 1) {
    //   url = "https://files.eyee.com/mcdn/img/prddetail/aftersale01.png";
    // } else if (_.issale == 2)
    //   url = "https://files.eyee.com/mcdn/img/prddetail/aftersale02.png";
    // if (url) _.imgs.unshift(url);
  }
};
</script>
<style scoped>
.buy-read {
  padding: 20px 8% 40px;
  color: #969696;
  font-size: 14px;
  line-height: 20px;
}
.buy-title {
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.head {
  margin-bottom: 30px;
}
.buy-read h2 {
  font-size: 16px;
  color: #fff;
}
.buy-read h3 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
.odd {
  margin-bottom: 10px;
}
.even {
  margin-bottom: 5px;
}
</style>
<style>
body {
  background-color: #282828;
}
</style>

