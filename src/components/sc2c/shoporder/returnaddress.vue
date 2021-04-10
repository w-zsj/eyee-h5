<template>
    <div>
        <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>商品回寄地址</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="addressinfo flex-around" >
            <div class=" flex-col ">
                <div class="userinfo flex-between">
                    <span class="name ellipsis">{{sneaddress.receiver||sneaddress.consignee}} </span>
                    <span class="mobile">{{sneaddress.mobile}}</span>
                </div>
                <div class="address ellipsis">{{sneaddress.address}}</div>
            </div>
            <div class="edit " @click.stop="edit" v-if="editStatus"> </div>
        </div>
        <p class="tishi">商品不符合平台的查验和鉴定标准时，将顺丰到付寄还给您。 鉴定结果产生后无法修改。</p>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      addressUnit: {},
      status: ""
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      shopType: "shopType",
      userInfo: "userInfo",
      backaddress: "backaddress"
    }),
    sneaddress() {
      if (this.backaddress) {
        this.addressUnit = this.backaddress;
        this.addressUnit.receiver =
          this.backaddress.receiver || this.backaddress.consignee;
      }
      return this.addressUnit;
    },
    editStatus() {
      // console.log("addressUnits", this.backaddress);
      this.status = this.$route.query.status;
      if (
        this.status == 0 ||
        this.status == 2 ||
        this.status == 3 ||
        this.status == 4
      ) {
        return true;
      }
    }
  },
  mounted() {},
  methods: {
    edit() {
      this.$router.push("/editbackaddress");
    }
  }
};
</script>
<style scoped>
.addressinfo {
  margin: 10px;
  margin-top: 60px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
  padding: 20px 15px;
}
.userinfo {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  font-family: "PingFang";
}
.userinfo .name{
  width: 45%;
  display: inline-block;
}
.flex-col {
  width: 80%;
}
.address {
  font-size: 12px;
  color: #666;
  padding-top: 15px;
  width: 100%;
}
.edit {
  width: 20px;
  height: 20px;
  background: url("/static/img/returnaddress.png") 0 0 no-repeat;
  background-size: 100% 100%;
}
.tishi {
  font-size: 12px;
  color: #ed4f4f;
  margin: 0 25px;
}
</style>



