<template>
    <div class="cata-wrap">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>{{title}}店铺</h3>
            </div>
        </v-header>
        <div class="banner">
            <img v-lazy="https(banner)" alt="">
        </div>
        <div class="shop">
          <v-cutlist  :more-handle="rcdloadmore" :more-handling="css.loading"  :isend="css.isEnd"   > 
            <div class="shop-list" v-for="(item,i) in classifyList" :key="i">
              <div class="shop-top flex-aic">
                <div class="logo flex-aic">
                  <img v-lazy="https(item.headurl)" alt>
                  <div class="shop-brand-name flex-col flex-around">
                    <span class="brand-name">{{item.businessname}}</span>
                    <span class="fans">
                      <i :class="item.classIcon"></i>
                      {{item.businessfans}}
                    </span>
                  </div>
                </div>
                <div class="shop-product flex-end">
                  <span class="flex-center" @click.stop="ShopDetail(item.id)">进店逛逛</span>
                </div>
              </div>
              <div class="shop-pro-list flex-aic">
                <div class="product" v-for="(items,i) in item.products" :key="i"  @click.stop="productDetail(items.id)">
                  <div class="img">
                    <img v-lazy="https(items.mainpic)" alt>
                  </div>
                  <div class="product-name" style="line-clamp: 2">{{items.businessname}}</div>
                  <div class="price">￥{{items.specialprice>0?items.specialprice:items.saleprice}}</div>
                </div>
              </div>
            </div>
          </v-cutlist>
        </div>
    </div>
</template>
<script>
import { categoryShop } from "../../utils/api/shop";
export default {
  data() {
    return {
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
        pageindex: 1,
        pagesize: 10
      },
      title:'',
      classifyid: "",
      classifyList: [],
      banner:''
    };
  },
  mounted() {
    let _ = this;
    _.classifyid = _.$route.params.id;
    _.title = _.$route.query.shopname;
    document.title =_.title
    _.categoryShop();
    // console.log(classifyid)
  },
  methods: {
    categoryShop() {
      let _ = this;
      _.css.isLoading = true;
      let pageindex = _.css.pageindex;
      categoryShop({ categoryid: _.classifyid, pageindex })
        .then(res => {
          if (res) {
            if (res.list) {
              console.log("分类", res);
              _.banner = res.banner
              if (res.pageindex == 1 && res.list.length == 0) {
                _.classifyList = res.list;
                document.body.classList.add("lock");
              } else {
                _.classifyList.push(...res.list);
                document.body.classList.remove("lock");
              }

              _.classifyList = _.classifyList.map(i => {
                if (i.isglobalpurchase) {
                  i.classIcon = "ico-sp-glb";
                } else {
                  switch (i.type) {
                    case 1:
                      i.classIcon = "ico-sp-official";
                      break;
                    case 2:
                      i.classIcon = "ico-sp-buy";
                      break;
                    case 3:
                      i.classIcon = "ico-sp-store";
                      break;
                  }
                }
                return i;
              });
            }
            if (res.pageindex * res.pagesize >= res.sumcount) {
              _.css.isEnd = true;
              document.body.classList.remove("lock");
            }
          } else _.css.isEnd = true;
          _.css.isLoading = false;
        })
        .catch(e => {
          _.css.isLoading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    ShopDetail(id){
      this.$router.push("/shop/shopdetail/" + id);
    },
    productDetail(id) {
      this.$router.push("/productDetail/" + id);
    },
    rcdloadmore() {
      let _ = this;
      if (_.css.isLoading) return;
      if (_.css.isend) _.toast("已无更多");
      else {
        _.css.pageindex++;
        _.categoryShop();
      }
    }
  }
};
</script>
<style scoped>
.cata-wrap {
  min-height: 95vh;
  background: #f2f2f2;
}
.banner {
  padding: 0 2vw;
  background: #f2f2f2;
}
.shop {
  font-size: 12px;
  /* padding: 0 16px; */
  /* box-shadow: 0 0 10px #999; */

  padding: 0 2vw;
  overflow: hidden;
  padding-bottom: 4.66vw;
}
.shop .mint-loadmore {
  background: #f2f2f2;
}
.shop .shop-list {
  background: #fff;
  margin-top: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.shop .shop-top {
  padding: 6px;
}
.shop .logo {
  width: 80%;
}
.shop .brand-name {
  font-weight: bold;
  font-size: 13px;
}
.shop-brand-name {
  min-height: 54px;
  margin-left: 10%;
}
.shop-brand-name span {
  width: 100%;
  display: inline-block;
}
.shop-brand-name span:nth-child(1) {
  width: 100%;
  text-align: left;
}
.shop-brand-name i {
  transform: rotate(3deg);
}
.shop .logo img {
  width: 25%;
}
.shop-product {
  width: 40%;
  text-align: right;
}
.shop-product span {
  width: 64px;
  height: 30px;
  border-radius: 15px;
  background: #707afc;
  color: #fff;
  font-size: 10px;
}
.shop-pro-list {
  /* padding: 15px 6px; */
  background: #f2f2f2;
  padding-top: 10px;
  /* padding: 12px 6px 6px 6px; */
  /* border-radius: 6px; */
}
.shop-pro-list .product {
  width: 32%;
  background: #fff;
  border-radius: 6px;
  padding: 0 1.333vw;
}
.shop-pro-list .product:nth-child(2) {
  margin: 0 2.5%;
}
.shop-pro-list .product .img {
  height: 0;
  width: 100%;
  padding-bottom: 100%;
}
.shop-pro-list .product .product-name {
  height: 30px;
  font-size: 11px;
  color: #333;
  line-height: 30px;
}
.shop-pro-list .product .price {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 35px;
}
.shop .clearfix {
}
</style>


