<template>
  <div class="address_unit">
    <div class="flex-aic address_flex_box" :class="{'order':addressType==1}" @click.stop="goUrl">
      <span class="icon_address" v-if="addressType==1 && addressUnit&&addressUnit.mobile"></span>
      <span v-if="addressType==0 && isShowIcon" class="icon_cartSel" :class="{icon_cartSeled:addressUnit.isdefault&&!isSelectId||isselected}" @click="goBack"></span>
      <section class="address_box" :class="{order_address:addressType==3,order_check:addressType==1}" v-if="addressUnit&&addressUnit.mobile" @click="goBack">
        <p :class="{'flex-aic addInfo':addressType==1||addressType==3}">
          <label :class="{'ellipsis':addressType==1||addressType==3}" style="font-weight: bold;">{{addressUnit.receiver}}</label>
          <label>{{addressUnit.mobile}}</label>
        </p>
        <div class="address-info">
          <div class="defaultTex" v-if="addressUnit.isdefault&&addressType!=1">默认</div>
          <div :class="{'order_adrs ellipsis':addressType==1}">{{addressUnit.address}}</div>
        </div>
      </section>
      <section v-else>请添加收货地址</section>
      <p @click.stop="goEdit" v-if="addressType!=3">
        <span :class="{'icon-edit':addressType==0,'right_icon':addressType==1}"></span>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ENUM } from "../../../common/util";
import { SetDefaultAddress, AddressList } from "../../../common/api/user";
import { AddAddr } from "../../../utils/api/activities";
import { AjcardUploadinfo } from "../../../common/api/collectionCard";  // 集卡页面上传兑奖信息的接口
// import { mapGetters } from 'vuex'
export default {
  props: {
    isShowIcon: { type: Number, default: 0 },
    addressUnit: Object,
    addressType: { type: Number, default: 0 }, // 默认的 地址列表, 1是订单结算模板
    cutType: { type: Number, default: 0 } // 助力列表传值
  },
  // computed: {
  // ...mapGetters({userInfo:'userInfo'}),
  // },
  mounted() {
    // alert(this.addressUnit.isSelect);
  },
  computed: {
    ...mapGetters({
      isSelectId: "isSelectId"
    }),
    isselected() {
      return this.isSelectId === this.addressUnit.addressid;
    }
  },
  methods: {
    goEdit() {
      if (this.addressType != 1) {
        console.log("编辑信息", this.addressUnit);
        this.$store.dispatch("setEditAddressData", this.addressUnit);
        this.$router.push("/user/editAddress/" + ENUM.editAddressType.edit.val);
      }
    },
    goUrl() {
      // console.log('address go', this.addressType == 1 && this.addressUnit.mobile, !this.addressUnit.mobile)
      if (this.addressType == 1) {
        let param = `${
          this.addressUnit && this.addressUnit.mobile ? "" : "没"
        }有收货地址`;

        // && this.addressUnit.mobile
        sessionStorage.setItem("address", "1");
        this.$router.push("/user/address");
      } else {
        if (!this.addressUnit.mobile) {
          sessionStorage.setItem("address", "1");
          this.$router.push(
            "/user/editAddress/" + ENUM.editAddressType.add.val
          );
        }
      }
    },
    goBack() {
      if (this.$route.query.platid) {
        // console.log("-----------ox", this.addressUnit);
        let { address, addressid } = this.addressUnit,id	= this.$route.query.platid
        AddAddr({ addressid, address,id })
          .then(res => {
            this.toast("领取成功");
            this.$router.push("/plat/gift?addr=1");
          })
          .catch(e => {
            console.error(e);
            this.toast("领取失败");
          });
        // this.$router.go(-1);
      } else if(this.$route.query.prizeid && this.$route.query.size) {
        // 从集卡页面进来的
        let param = {
          prizeid: parseInt(this.$route.query.prizeid || ''),
          size: this.$route.query.size,
          name: this.addressUnit.receiver,
          phone: this.addressUnit.mobile,
          address: this.addressUnit.address
        }
        AjcardUploadinfo(param).then( res => {
          if(res && res.status) {
            $log({ e: "collectcards_cash", p: { describe: "兑奖" } });
            this.toast('兑换成功')
            this.$router.go(-1);
          } else {
            this.toast(res.msg)
            this.$router.go(-1);
          }
        }).catch( e => {
          this.toast('兑换失败')
          console.error(e)
          this.$router.go(-1);
        })
        
      } else if (this.addressType == 0) {
        if (
          sessionStorage.getItem("address") ||
          this.$route.query.cutType == 1
        ) {
          sessionStorage.removeItem("address");
          // this.addressUnit.isdefault=true
          //  isselectid
          this.$store.dispatch("isselectid", this.addressUnit.addressid);
          this.$store.dispatch("setDefaultAddress", this.addressUnit);
          console.log("this.isSelectId", this.isSelectId);
          if (this.$route.query.cutType == 1) {
            this.$store.state.user.cutType = true;
          }
          this.$router.go(-1);
        } else {
          SetDefaultAddress({ id: this.addressUnit.addressid })
            .then(res => {
              this.addressUnit.isdefault = true;
              this.$store.dispatch("setDefaultAddress", this.addressUnit);
              this.upAddressList();
              this.toast("设置默认成功！");
            })
            .catch(err => {
              console.log(err);
              this.toast("设置默认地址失败！");
            });
        }
      }
    },
    upAddressList() {
      AddressList()
        .then(res => {
          console.log("收获地址", res);
          this.$store.dispatch("setUserAddressList", res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.address_unit {
  width: 100%;
  /* background: #fff; */
}

.address_flex_box {
  justify-content: space-between;
  padding: 10px 0;
  /* box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5); */
  /* margin: 0 10px; */
  /* padding-left: 10px; */
  width: 100%;
}
.address_flex_box.order {
  padding: 10px 0;
}

.address_box {
  width: 80%;
  font-size: 15px;
  padding: 0 10px;
}
.address_box .addInfo{
  margin: 0 0 2px 0 !important;
}
.address_box .addInfo label:first-child{
  margin-right: 15px;
  max-width: 50%;

}
.address-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.address-info div:last-child {
  line-height: 20px;
}
.defaultTex {
  background: #ffc700;
  color: #666;
  font-size: 10px;
  padding: 3px 1.3333vw;
  border-radius: 3px;
  line-height: 3.7333vw;
  margin-right: 2.6667vw;
  white-space: nowrap;
}
.address_box p {
  word-break: break-all;
}
.address_box p label {
  position: relative;
}
.address_box p:nth-of-type(1) {
  margin-bottom: 15px;
  margin-right: 20px;
}
.address_box p.order_adrs {
  font-size: 13px;

}
.address_box.order_check {
  width: 85%;
  padding: 0;
}
.order_address {
  width: 100%;
}
</style>
