<template>
  <div>
    <v-header v-if="!$root.ISAPP&&!insq&&type!=6&&!$root.ISMP">
      <div class="nav-tab2">
        <h3>{{buyerOrSell}}</h3>
      </div>
    </v-header>
    <div v-html="richtext" class="richtext"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { agreement } from "../../../common/api/snekc2c.js";
export default {
  data() {
    return {
      richtext: "",
      buyerOrSell: "",
      type: null
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    let type = this.$route.query.type;
    this.type = type;
    // this.buyerOrSell =
    //   type == 1 ? "卖家须知" : type == 2 ? "交易须知" :  type == 3 ? "商家协议" : "保证金协议";
    switch (Number(type)) {
      case 1:
        this.buyerOrSell = "卖家须知";
        break;
      case 2:
        this.buyerOrSell = "交易须知";
        break;
      case 3:
        this.buyerOrSell = "商家协议";
        break;
      case 4:
        this.buyerOrSell = "保证金协议";
        break;
      case 5:
        this.buyerOrSell = "新手必看";
        break;
      case 6:
        this.buyerOrSell = "活动规则"; //活动规则
        break;
      case 20:
        this.buyerOrSell = "拍卖规则"; //拍卖规则
        break;
      case 21:
        this.buyerOrSell = "红包规则"; // 拍卖红包规则
        break;
      case 22:
        this.buyerOrSell = "服务"; // 服务
        break;
      case 23:
      case 24:
        this.buyerOrSell = "斗牛潮牌合伙人会员服务协议"; // 斗牛潮牌合伙人会员服务协议
        break;
    }

    // window.document.title = this.buyerOrSell;
    this.setToolBar({ title: this.buyerOrSell });
    if (type == 6) {
      this.richtext =
        JSON.parse(decodeURIComponent(this.$route.query.content)) || "";
    } else {
      agreement({ type })
        .then(res => {
          if (res && res.agreement) {
            this.richtext = res.agreement.replace(/568/g, "");
            console.log("富文本数据", this.richtext);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style lang="scss">
body {
  background-color: #191919;
  color: #fff;
}
.richtext img {
  display: block;
  overflow: hidden;
}
.richtext br {
  display: none;
}
</style>
<style scoped>
p,
table,
tbody,
tr {
  width: 100% !important;
}
.richtext {
  padding: 10px;
  font-size: 14px;
}
</style>


