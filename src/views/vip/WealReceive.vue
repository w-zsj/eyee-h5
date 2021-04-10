<template>
  <div class="weal-receive">
    <!-- 详情大图轮播 -->
      <div class="product_sw" v-if="swItem&&swItem.length">
        <carousel
          :per-page="1"
          :autoplay="true"
          :autoplayTimeout="3500"
          :navigate-to="someLocalProperty"
          :loop="true"
          :autoplayHoverPause="false"
          @page-change="pageChange"
        >
          <slide v-for="(item, index) in swItem" :key="index+'ad'">
            <img :src="https(item)" :alt="item" />
          </slide>
        </carousel>
      </div>
     <!--收货地址  -->
    <UserAddressUint :addressUnit="userDefaultAddress" :addressType="1" class="wr-address"></UserAddressUint>
    <p class="wr-title">商品规格</p>
    <ul class="wr-size">
      <li
        v-for="(i,idx) in sizes"
        :key="i.id"
        :class="{act:i.ok&&idx===sizeSelectedIdx}"
        @click="ckCell('size',idx)"
      >{{i.sizeName}}</li>
    </ul>
    <p class="wr-title">颜色规格</p>
    <ul class="wr-size">
      <li
        v-for="(i,idx) in colors"
        :key="i.id"
        :class="{act:i.ok&&idx===colorSelectedIdx}"
        @click="ckCell('color',idx)"
      >
        {{i.colorName}}
      </li>
    </ul>
    <div class="wr-footer">
      <div class="wr-btn" :disabled="noitem" @click="submit">立即领取</div>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import { mapGetters } from "vuex";
import { ProdGetItems, NewDetail } from "@/common/api/product";
import UserAddressUint from "@/components/templates/user/UserAddressUnit";
import { getGift } from '@/utils/api/vip'
import { ENUM } from "@/common/util";
const PT = ENUM.ProductType;
export default {
  name: 'VipWealReceive',
  data() {
    return {
      swItem: [],
      someLocalProperty: 0,
      queryGift: {
        productid: '',
        size: '',
        addressid: ''
      },
      propertyList: [],
      sizes: [],
      colors: [],
      colorSelectedIdx: -1,
      sizeSelectedIdx: -1
    }
  },
  components: {
    Carousel,
    Slide,
    UserAddressUint
  },
  computed: {
    ...mapGetters({
      userDefaultAddress: 'userDefaultAddress',
      user: 'userInfo'
    }),
    noitem() {
      return this.colorSelectedIdx < 0 || this.sizeSelectedIdx < 0;
    }
  },
  beforeMount() {
    let _ = this
    let { load } = _
    _.setToolBar({
      title: '领取盲盒礼包',
      bgcolor: '#ffffff',
      textcolor: '#232323'
    })
    load()
  },
  methods: {
    load() {
      let _ = this
      let productid = _.$route.params.id
      NewDetail(productid)
        .then(res => {
          console.log("商品详情", res);
          if (res && res.info) {
            let info = (res && res.info) || {};
            _.swItem = (info.mainpic || "").split("|");
            _.prodItems()
          } else {
            _.toast("商品不存在或已下架");
          }
        })
        .catch(e => {
          this.toast("加载失败");
          console.error("商品详情异常", e);
        })
    },
    prodItems() {
      let _ = this
      let optionsparam = {
        productid: _.$route.params.id
      }
      ProdGetItems(optionsparam)
          .then(res => {
            if (res && res.length > 0) {
              let colors = [];
              let sizes = [];
              let colorIndex = 0;
              let sizeIndex = 0;

              let resultTemp = res.map(i => {
                colorIndex = i.colororder;
                sizeIndex = i.sizeorder;

                if (colors[colorIndex])
                  if (colors[colorIndex].id !== i.colorid) colorIndex++;

                colors[colorIndex] = {
                  colorName: i.color,
                  id: i.colorid,
                  colorimg: i.colorimg,
                  ok: true
                };

                if (sizes[sizeIndex])
                  if (sizes[sizeIndex].id !== i.sizeid) sizeIndex++;

                sizes[sizeIndex] = {
                  sizeName: i.size,
                  id: i.sizeid,
                  ok: true
                };

                i = this.dealPrice(i);
                return i;
              });

              if (colors.length > 0) colors = colors.filter(i => i);
              if (sizes.length > 0) sizes = sizes.filter(i => i);

              this.colors = colors;
              this.sizes = sizes;
              this.propertyList = resultTemp;
              // console.log("deal items: ", colors, sizes, _.propertyList);
            } else this.toast("商品已下架");
          })
          .catch(e => {
            console.error("商品子项加载失败", e);
          })
    },
    pageChange(index) {
      let _ = this;
      _.someLocalProperty = index;
      // console.log("index--->>", index);
    },
    dealPrice(i) {
      i.delprice = 0;
      if (i.specialprice > 0 && i.specialprice !== i.saleprice) {
        i.price = i.specialprice;
        i.delprice = i.saleprice;
      } else if (i.groupPrice < 999999 && this.isGroupBuy) {
        i.price = i.groupPrice;
      } else {
        i.price = i.saleprice;
      }
      //  else if(i.helpPrice < 999999 && this.helpType) {
      //   i.price = i.saleprice - i.helpPrice
      // }
      switch (i.producttype) {
        case PT.activity:
          if (i.salestatus !== 1) {
            i.price = i.saleprice;
            i.delprice = 0;
            i.specialprice = 0;
            i.producttype = PT.normal;
          }
          break;
        case PT.bees:
        case PT.sign:
          // 暂时不做 置空特价
          if (i.delprice > 0) i.price = i.delprice;
          i.delprice = 0;
          i.producttype = PT.normal;
          break;
      }
      return i;
    },
    ckCell(name, idx) {
      let current = this[name + "s"][idx];
      let tempIndex = this[name + "SelectedIdx"];
      if (current && current.ok) {
        if (tempIndex === -1) tempIndex = idx;
        else tempIndex = tempIndex === idx ? -1 : idx;
        this[name + "SelectedIdx"] = tempIndex;
      }
    },
    submit() {
      let _ = this;
      let { noitem, toast, hostName } = _
      if (noitem) {
        toast("请选择颜色尺码")
        return
      }
      if(!_.userDefaultAddress.addressid){
        toast("请添加收货地址")
        return
      }
      let size = _.sizes[_.sizeSelectedIdx].sizeName
      let color = _.colors[_.colorSelectedIdx].colorName
      let selectItem = _.propertyList.filter(i => {
        return i.color === color && i.size === size
      })
      _.queryGift = {
        productitemid: selectItem[0].id,
        addressid: _.userDefaultAddress.addressid
      }
      getGift(_.queryGift)
        .then(res => {
          toast('领取成功')
          setTimeout(() => {
            _.$router.replace('/vip')
          }, 100);
        })
        .catch(e => {
          toast(e.msg)
        })
    }
  }
}
</script>
<style>
.product_sw .VueCarousel-pagination {
  position: absolute;
  left: 50%;
  bottom: 8vw;
  transform: translateX(-50%);
}
.product_sw .VueCarousel-pagination .VueCarousel-dot {
  width: 6px !important;
  height: 6px !important;
  padding: 0 !important;
  margin-top: 0 !important;
  margin-right: 7px;
  border-radius: 3px !important;
}
.product_sw .VueCarousel-pagination .VueCarousel-dot--active {
  width: 4.266vw !important;
  background: #f5f5f5 !important;
}
</style>
<style lang="scss" scoped>
.weal-receive {
  padding-bottom: 120px;
  font-size: 15px;
  color: #333;

  .product_sw {
    width: 100vw;
    height: 100vw;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
    overflow: hidden;
  }
  .wr-address {
    padding: 5px 15px;
    font-weight: 500;
  }
  .wr-title {
    font-weight: bold;
    padding: 10px 15px;
  }
  .wr-size {
    padding: 0 10px;
    overflow: hidden;
    
    li {
      margin: 5px;
      float: left;
      padding: 0 8px;
      min-width: 30px;
      line-height: 28px;
      border-radius: 2px;
      background: #F5F5F5;
      border: 1px solid #F5F5F5;
      color: #969696;
      font-size: 13px;
    }
    .act {
      background: #FFF2F3;
      border: 1px solid #FA4B4B;
      color: #FA2337;
    }
  }
  .wr-footer {
    position: fixed;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px 15px;
    background-color: #fff;
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 1px rgba(0,0,0,.12);
    text-align: center;
    font-size: 13px;
  }
  .wr-btn {
    margin-top: 10px;
    line-height: 50px;
    background-color: #FA2337;
    border-radius: 2px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    opacity: 1;
  }
  .wr-btn[disabled] {
    opacity: 0.5
  }
}
</style>
