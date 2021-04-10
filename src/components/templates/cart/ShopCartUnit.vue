<template>
  <div class="cart_box">
    <div class="flex-aic flex_box cart_head">
      <section class="flex-aic send_shop">
        <span class="cart_chang" :class="{icon_cartSeled:reInfo.checked,icon_cartSel:!reInfo.checked}" @click="CheckAll(true)"></span>
        <!-- <span class="mall_brandShop" :class="{'mall_buyers':reInfo.businesstype == 2}">{{reInfo.businesstype == 1? '品牌店':'买手店'}}</span> -->
        <i class='ico-sp-glb tilt' v-if="reInfo.isglobalpurchase"></i>
        <i class="tilt" :class="reInfo.businesstype===3?'ico-sp-store':(reInfo.businesstype===2?'ico-sp-buy':'ico-sp-official')"></i>
        <p class="ellipsis">
          <router-link :to="'/shop/shopdetail/'+reInfo.businessid">{{reInfo.businessname}}</router-link>
        </p>&nbsp;&gt;
      </section>
      <section class="flex-aic sendpl">
        <p v-show="!!reInfo.sendplace">{{reInfo.sendplace}}发货</p>
        <em>|</em>
        <span style="color:#af3c03" @click="editCart(reInfo)">{{cartEdit?'修改':'完成'}}</span>
      </section>
    </div>
    <div class="flex-aic" v-for="unit in reInfo.items" :key="unit.id">
      <CartInfoUnit @cartCheck="updateCheck" :info="unit" :cartEdit="cartEdit" :isCart="1"></CartInfoUnit>
    </div>
    <div class="cart_head cart_footer">
      <section>
        <span>已选商品{{reInfo.count}}件</span>
        <span>商品总额：&nbsp;&nbsp;¥{{reInfo.allPay | tofixed}}</span>
      </section>
      <section>
        <span class="pay_color" v-if="!reInfo.isover">总计：¥{{reInfo.allPay | tofixed}} (不含运费)</span>
        <span class="pay_red" v-else>您选择的商品数量大于库存数量，请修改数量后再结算。</span>
        <mt-button type="primary" class="btn_total" :disabled="reInfo.disable" @click="checkout(reInfo)">开始结算</mt-button>
      </section>
    </div>
  </div>
</template>
<script>
import CartInfoUnit from "./CartInfoUnit";
import { mapGetters } from "vuex";
export default {
  props: {
    cartInfo: Object,
    index: Number
  },
  data() {
    return {
      cartEdit: true,
      checkedItem: [],
      checked: false,
      disable: true,
      checkedInfo: {},
      spItem: [] // 鬼市选项
    };
  },
  mounted() {},
  components: { CartInfoUnit },
  computed: {
    reInfo() {
      return this.calc();
    },
    ...mapGetters({ userInfo: "userInfo", insq: "insq" })
  },
  watch: {
    cartInfo(val, oldval) {
      if (val.businessid !== oldval.businessid) {
        this.cartEdit = true;
      }
    }
  },
  methods: {
    calc() {
      let info = this.cartInfo;
      // console.log('单元详情', info)
      let [n, p = n, a = n] = [0];
      for (var i = 0; i < info.items.length; i++) {
        if (info.items[i].checked) {
          n += info.items[i].count;
          p += info.items[i].pay;
          if (
            info.items[i].count > info.items[i].stockcount ||
            (info.items[i].limitcount > 0 &&
              info.items[i].count > info.items[i].limitcount)
          ) {
            info.items[i].overCount = true;
            a += 1;
          } else {
            info.items[i].overCount = false;
          }
        } else {
          if (info.count != 0 && info.allPay != 0) {
            info.count -= info.items[i].count;
            info.allPay -= info.items[i].pay;
            info.overcount -= 1;
          }
        }
      }
      info.count = n;
      info.allPay = p;
      info.overcount = a;
      // if (info.overcount > 0) {
      //   info.isover = true
      // } else {
      //   info.isover = false
      // }
      info.isover = info.overcount > 0;
      info.disable = !(info.count > 0 && !info.isover);
      // if (info.count > 0 && !info.isover) {
      //   info.checked = true
      //   info.disable = false
      // } else {
      //   info.checked = false
      //   info.disable = true
      // }
      if (info.items && info.items[0] && info.items[0].sendplace) {
        let spArr = info.items[0].sendplace.split(",");
        if (spArr.length > 2) info.sendplace = spArr[2];
        else info.sendplace = info.items[0].sendplace;
      }
      return info;
    },
    editCart(info) {
      this.cartEdit = !this.cartEdit;
    },
    CheckAll(isSelect) {
      if (isSelect) {
        this.reInfo.disable = !this.reInfo.disable;
        this.reInfo.checked = !this.reInfo.checked;
        this.reInfo.items = this.reInfo.items.map(n => {
          n.checked = this.reInfo.checked && n.isok;
          return n;
        });
      } else {
        let select = this.reInfo.items.every(n => {
          return n.checked === true;
        });
        if (select) {
          this.reInfo.checked = true;
        } else {
          this.reInfo.checked = false;
        }
      }
    },
    updateCheck(info) {
      console.log("info----zsj", info);
      this.CheckAll(false);
    },
    checkout(info) {

      this.checkedInfo = info;
      let f = info.items;
      let orderitem = info.items[0];
      let spId = "";
      let spItem = [];
      for (var i = 0; i < f.length; i++) {
        if (f[i].type == 2 && f[i].checked) {
          if (f[i].contentid) {
            spId = f[i].contentid;
            spItem.push(f[i]);
          }
        }
      }
      this.cartInfo.hasSpecial = false;
      this.calc();
      this.$store.dispatch("setOrderOut", info);

      this.$store.dispatch("setFromeType", 0);
      console.log("开始结算", info);
      //  this.$router.push("/order/checkout");
      if (this.insq) {
      } else {
        let productitems = [];
        for (let i = 0; i < info.items.length; i++) {
          if (info.items[i].checked) {
            let p = {};
            p.productitemid = info.items[i].productitemid; // "商品子项id",
            p.count = info.items[i].count || 1; // "int 数量",
            p.producttype = info.items[i].producttype; // "int 商品类型"
            productitems.push(p);
          }
        }
        // console.log("productitems", productitems);
        this.$router.push({
          path: "/order/NewCheckout",
          query: {
            expresstemplateitemid: orderitem.expresstemplateid || "", // "物流模板子项id"
            productitems: encodeURIComponent(JSON.stringify(productitems)),
            ordertype: 0, //  "int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",
            extendid: '' //      "扩展id （根据ordertype和producttype决定具体类型的id：例：productid、activityid、teamid、cuttingid)"
          }
        });
      }
    }
    // SpecialIsSigned(specialid) {
    //   let option = {
    //     token: this.userInfo.token,
    //     specialid: specialid
    //   }
    //   SpecialIsSigned(option).then((res) => {
    //     if (res && res.issigned) {
    //       console.log('有鬼市')
    //       this.cartInfo.hasSpecial = false
    //     } else {
    //       let it = this.cartInfo.items
    //       it = it.map((data) => {
    //         if (data.type == 2 && data.contentid.length > 0) {
    //           data.pay = data.count * data.saleprice
    //         }
    //         return data
    //       })
    //       this.calc()
    //       this.cartInfo.hasSpecial = true
    //       this.$store.dispatch('setOrderOut', this.cartInfo);
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // },
  }
};
</script>
<style scoped>
em {
  font-style: normal;
  color: #ccc;
  margin: 0 5px;
}

.flex_box {
  justify-content: space-between;
}

.cart_box {
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  border-radius: 4px;
  font-size: 14px;
  margin: 15px 10px;
}

.cart_chang {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.cart_shop {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.cart_box .sendpl {
  font-size: 12px;
}

.cart_head {
  border-bottom: 1px solid #fafafa;
  padding: 15px 10px;
}

.send_shop {
  width: 65%;
}

.send_shop p {
  max-width: 45%;
}

.cart_footer {
  border: none;
}

.cart_footer section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.cart_footer section:nth-of-type(2) {
  margin-top: 15px;
  font-size: 14px;
}
.cart_footer section:nth-of-type(2) > span {
  max-width: 55%;
}

.btn_total {
  background: #333;
  color: #fff;
  border-radius: 4px;
  padding: 8px 15px;
  border: none;
}

.pay_red {
  width: 65%;
  color: #af3c03;
}
.pay_color {
  color: #ffc700;
}
</style>
