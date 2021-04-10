<template>
  <div class="add_box">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>收货地址</h3>
      </div>
      <div class="del-adress" @click="delAll()">
        <img src="//files.eyee.com/mcdn/static/img/dustbin.png" alt="">
      </div>
    </v-header>
    <div v-if="userAddressList.length>0" class="address_lists">
      <div v-for="(item,index) in userAddressList" :key="index" class="unit_box" ref="addressItem">
        <mt-cell-swipe  :right="[{content: '删除',style: { background: 'red', color: '#fff', 'font-size':'14px','display':'flex','align-items':'center'},handler: () => deleAddress(item,index)}]">
          <UserAddressUnit :addressUnit="item" :isShowIcon="isShowIcon"></UserAddressUnit>
        </mt-cell-swipe>
      </div>
    </div>
    <template v-else>
      <div class="add_brank">
        <img :src="noAddress">
        <span>您还没有添加收货地址</span>
      </div>
    </template>
    <router-link class="add_footer" :to="'/user/editAddress/'+goType">添加新地址</router-link>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import UserAddressUnit from "../templates/user/UserAddressUnit";
import { ENUM } from "../../common/util";
import { AddressList, RemoveAddress } from "../../common/api/user";
export default {
  data() {
    return {
      noAddress: "//files.eyee.com/mcdn/static/img/user/no_address.png", // require('../../assets/img/user/no_address.png')
      isShowIcon:0 // 0：从设置进入不显示   1：从订单进入  显示
    };
  },
  props: {
    cutType: { type: Number, default: 0 } // 助力列表传值
  },
  components: {
    UserAddressUnit
  },
  mounted() {
    // console.log('收获地址', this.userAddressList)
    let _ = this;
    if (_.user.token) _.getAddressList();
    else {
      setTimeout(() => {
        _.getAddressList();
      }, 800);
    }
  },
  computed: {
    ...mapGetters({
      userAddressList: "userAddressList",
      user: "userInfo"
    }),
    goType() {
      return ENUM.editAddressType.add.val;
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('from',from.path.indexOf('account'))
    next(vm=>{
      if(from.path.indexOf('account')>-1){
        vm.isShowIcon = 0
      }else if(from.path.indexOf('NewCheck')>-1){
        vm.isShowIcon = 1
      }else{
        vm.isShowIcon = 0
      }
      console.log('vm.isShowIcon的值：',vm.isShowIcon)
    })
  },
  methods: {
    deleAddress(item, index) {
      console.log(item);
      RemoveAddress({ id: item.addressid, token: this.user.token })
        .then(res => {
          this.toast("删除成功！");
          this.userAddressList.splice(index, 1);
          let addde = {};
          if (this.userAddressList && this.userAddressList.length > 0) {
            for (let i = 0; i < this.userAddressList.length; i++) {
              if (this.userAddressList[i].isdefault == true) {
                addde = this.userAddressList[i];
              } else {
                addde = this.userAddressList[0];
              }
            }
            this.userAddressList[0].isdefault = true;
            this.$store.dispatch("setDefaultAddress", addde);
          } else {
            this.$store.dispatch("setDefaultAddress", {});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAddressList() {
      AddressList()
        .then(res => {
          console.log("收获地址", res);
          this.$store.dispatch("setUserAddressList", res);
        })
        .catch(err => {
          console.log(err);
        });
      console.log(this.hasAddress);
    },
    delAll(){

      let addressInfo = this.$refs.addressItem
      console.log(addressInfo)
      addressInfo = addressInfo.map( i => {
        i.firstElementChild.children[0].style.cssText = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[0].style.transform = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[0].style.webkitTransform = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[1].style.cssText = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[1].style.transform = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[1].style.webkitTransform = "transform: translate3d(-48px, 0px, 0px);"
        i.firstElementChild.children[2].style.cssText = "transform: translate3d(0px, 0px, 0px);"
        i.firstElementChild.children[2].style.transform = "transform: translate3d(0px, 0px, 0px);"
        i.firstElementChild.children[2].style.webkitTransform = "transform: translate3d(0px, 0px, 0px);"
        return i
      })
      console.log(addressInfo)
    }
  }
};
</script>
<style scoped>
.add_box {
  /*background: #eee;*/
  padding-bottom: 90px;
}
.add_brank {
  text-align: center;
  color: #999;
  font-size: 14px;
}

.add_brank > img {
  display: block;
  width: 20%;
  margin: 60% auto 10px;
}
.address_lists {
  padding: 5px 10px 0;
}
.unit_box {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 0 4px 0 rgba(212, 212, 212, 0.5);
}
.unit_box .mint-cell {
  float: none;
  width: 100%;
  padding-right: 0;
  margin-bottom: 0px;
}
.bottom_border {
  background: #eee;
  height: 10px;
  width: 100%;
}
.del-adress{
  width: 20px;
  height: 20px;
  position: relative;
  left: 4vw;
}
</style>
