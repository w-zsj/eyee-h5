<template>
  <div>
    <div
      class="exchange_item"
      v-for="(item, index) in ballMarketList"
      :key="index"
      @click.stop="goProductDetail(item.id, item.newballs)"
    >
      <div class="item_img">
        <img v-lazy="https(item.mainpic)" :key="item.id" />
      </div>
      <div class="item_name" style="-webkit-box-orient: vertical;">{{ item.name }}</div>
      <div class="item_init_price">
        <span>¥</span>
        {{
        Number.isInteger(item.initprice)
        ? item.initprice
        : item.initprice.toFixed(2)
        }}
      </div>
      <div class="item_present_price">
        <span>¥</span>
        {{
        Number.isInteger(item.price) ? item.price : item.price.toFixed(2)
        }}+
        <img
          src="/static/imgs/ball/oxball_b.png?c=1"
        />
        {{ item.newballs }}
      </div>
      <div class="item_btn">立即兑换</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "bullproduct",
  props: {
    ballMarketList: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapGetters({
      oxballNowOwn: "oxballNowOwn"
    })
  },
  methods: {
    goProductDetail(id, newballs) {
      let _ = this;
      if (newballs > this.oxballNowOwn) {
        this.confirm({
          title: "牛丸数量不足",
          msg:
            "<div class='confirm_cash_yue'>继续邀请好友，领取海量牛丸!(每邀1位最高送1088牛丸)</div>",
          okText: "立即邀请",
          cancelBtn: 1,
          confirmButtonClass: "fz16",
          closeOnClickModal: true,
          ok: () => {
            _.$router.push("/ball/summmon");
          }
        });
        return;
      }
      $log({ e: "click_ball_market_product", p: { pid: id } });
      _.javascriptBridge({
        name: "gotoAppProductDetailPage",
        params: { productid: id }
      });
    }
  }
};
</script>
<style scoped>
.exchange_item {
  float: left;
  width: 44.533vw;
  height: 86.666vw;
  background: #fafafa;
  margin-bottom: 2.666vw;
  margin-right: 2.933vw;
  border-radius: 6px;
  overflow: hidden;
}
.exchange_item:nth-child(even) {
  margin-right: 0;
}
.exchange_item .item_img {
  width: 44.533vw;
  height: 44.533vw;
}
.exchange_item .item_name {
  width: 44.533vw;
  padding: 2.666vw 2.666vw 0 2.666vw;
  height: 12.266vw;
  line-height: 4.8vw;
  font-size: 3.4667vw; /*13 */
  color: #232323;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.exchange_item .item_init_price {
  padding-left: 3.2vw;
  padding-top: 1.6vw;
  color: #969696;
  font-weight: bold;
  font-size: 3.2vw; /*12 */
  line-height: 4.8vw;
  font-family: "OswaldBold";
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf");
  text-decoration: line-through;
}
.exchange_item .item_init_price span {
  font-size: 2.6667vw; /* 10*/
}
.exchange_item .item_present_price {
  padding-left: 2.666vw;
  padding-top: 0.26667vw;
  color: #232323;
  font-weight: bold;
  font-size: 4.8vw; /*18 */
  line-height: 4.8vw;
  font-family: "OswaldBold";
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf");
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.exchange_item .item_present_price span {
  font-size: 3.7333vw; /*14 */
}
.exchange_item .item_present_price img {
  width: 4.8vw;
  height: 4.8vw;
  display: inline-block;
  vertical-align: top;
}
.exchange_item .item_btn {
  margin: 3.2vw auto 0;
  width: 39.2vw;
  height: 9.066vw;
  text-align: center;
  line-height: 9.066vw;
  font-size: 14px;
  color: #fa2337;
  font-weight: 600;
  border-radius: 2px;
  border: 1px solid #fa2337;
  background: #fff;
}

.confirm_cash {
  font-size: 17px;
  color: #232323;
  font-weight: 600;
  margin-bottom: 4vw;
}
.confirm_cash_yue {
  font-size: 16px;
  color: #646464;
  font-weight: 400;
}
</style>
