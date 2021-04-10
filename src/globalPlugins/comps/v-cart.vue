<template>
    <div>
        <div class="nav-cart" @click.stop.prevent='gotoCart()'>
            <div :class="{cartimg_box:cartList.length>0}">
              <!-- <img :src="cartImg" alt=""> -->
              <img src="../../assets/img/icon_buy@3x.png">
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    isshow: { type: Boolean, default: false },
    isdark: { type: Boolean, default: true }
  },
  computed: {
    cartImg() {
      return this.isdark
        ? "//files.eyee.com/mcdn/img/prddetail/icon_cart.png"
        : "//files.eyee.com/mcdn/static/img/cart_light.png";
    },
    ...mapGetters({ cartList: "cartList" })
  },
  methods: {
    gotoCart() {
      if (
        localStorage.getItem("currentUser") &&
        JSON.parse(localStorage.getItem("currentUser")).token !== ""
      ) {
        this.$router.push("/cart");
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>

