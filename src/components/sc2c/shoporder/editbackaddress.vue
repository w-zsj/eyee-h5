<template>
    <div class="edit_address">
        <v-header v-if="!insq">
        <div class="nav-tab2">
            <h3>修改回寄地址</h3>
        </div>
        </v-header>
        <section>
            <div class="flex input_box">
                <label for="">收货人</label>
                <input type="text" v-model="newBackAddress.receiver" placeholder="请输入收货人的姓名">
            </div>
            <div class="flex input_box">
                <label for="">手机号码</label>
                <input type="number" v-model="newBackAddress.mobile" placeholder="请输入收货人的手机号码">
            </div>
            <div class="flex input_box" @click="showModal()">
                <label for="">城市</label>
                <input type="text" :value="relData.citys||newBackAddress.citys" placeholder="请选择城市" readonly>
                <p>
                <span class="rights_icon"></span>
                </p>
            </div>
            <div class="flex input_box">
                <label for="">详情地址</label>
                <input type="text" v-model="newBackAddress.detailadd" placeholder="请输入详情地址">
            </div>

            <div v-show="showBaseModal" class="addressBg" @click="cancel">
                <transition name="addresstrans">
                <baseProvinceId class="addresstrans" v-show="showBaseModal"></baseProvinceId>
                </transition>
            </div>
            <div class="add_footer" @click="cofirmEdit">确定修改</div>
            </section>
    </div>
</template>
<script>
import { returnAddress } from "../../../common/api/snekc2c.js";
import baseProvinceId from "../../templates/baseProvinceId";
import { mapGetters } from "vuex";
//         address: backaddress.backaddress,
//         receiver: backaddress.backname,
//         mobile: backaddress.backmobile,
export default {
  data() {
    return {
      newBackAddress: {},
      relData: {}
    };
  },
  components: { baseProvinceId },
  computed: {
    ...mapGetters({
      insq: "insq",
      showBaseModal: "showBaseModal",
      userInfo: "userInfo",
      backaddress: "backaddress",
      editAddressData: "editAddressData"
    })
  },
  mounted() {
    this.relData = this.editAddressData;
    this.newBackAddress = this.backaddress;
    let n = this.newBackAddress;
    console.log("回寄地址~~~", this.backaddress);
    n.mobile = n.mobile.split("-")[1] ? n.mobile.split("-")[1] : n.mobile;
    var ci = n.address ? n.address.split(" ") : "";
    if (ci) {
      ci[1] = ci[1] ? ci[1] : "";
      ci[2] = ci[2] ? ci[2] : "";
      n.citys = ci[0] + " " + ci[1] + " " + ci[2] || "";
      // n.detailadd = ci[3] || "";
    }
    let d = "";
    for (let i = 0; i < ci.length; i++) {
      if (i > 2) {
        d += " " + ci[i];
      }
    }
    n.detailadd = d;
    // console.log(d, "-------------->");
    //  console.log("回寄地址~~~", this.newBackAddress);
    // n.address =
    //   this.relData.citys + n.address;
  },
  methods: {
    showModal(data) {
      this.$store.dispatch("selectCity", { type: 1, data: data, open: true });
    },
    cancel() {
      this.$store.dispatch("selectCity", { open: false });
    },
    cofirmEdit() {
      let _ = this,
        n = _.newBackAddress,
        address = `${_.relData.citys || n.citys} ${n.detailadd}`;
      const rgxMobile = /^1[0-9][0-9]\d{8}$/;
      if (!rgxMobile.test(Number(n.mobile))) {
        _.toast("请输入正确的手机号码!");
        return;
      }
      if (address.length > 55) {
        _.toast("地址最多55个汉字哦");
        return;
      }
      let op = {
        saleid: n.saleid,
        consignee: n.receiver,
        mobile: n.mobile,
        address
      };
      returnAddress(op)
        .then(res => {
          _.$store.dispatch("backaddress", op);
          _.$router.go(-1);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style scoped>
.edit_address {
  padding-bottom: 90px;
}
.edit_address .input_box {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.edit_address label {
  width: 30%;
}

.edit_address input {
  width: 65%;
  color: #666;
  font-size: 14px;
}
.addresstrans-enter-active,
.addresstrans-leave-active {
  transition: all 0.5s;
  /* bottom:0; */
}
.addresstrans-enter,
.addresstrans-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
.addressBg {
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  font-size: 14px;
}
.addresstrans {
  position: fixed;
  height: 350px;
  background: #fff;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 100;
}
</style>


