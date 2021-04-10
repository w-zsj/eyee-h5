<template>
  <div class="kol">
    <img v-lazy="'//files.eyee.com/activity/dglk/desc.png'" alt>
    <v-delay :delay="300">
      <div @click="goto('vdo')">
        <img v-lazy="`//files.eyee.com/activity/dglk/vdo.png`" alt>
      </div>
      <!-- 相关活动 -->
      <div class="kol-sec kol-enter">
        <img v-lazy="'//files.eyee.com/activity/dglk/act-bg.png'" alt>
        <div class="flex-around kol-acts">
          <div v-for="(ai, aIdx) in acts" :key="'act'+aIdx" @click="goto('enter',ai)">
            <img v-lazy="`//files.eyee.com/activity/dglk/act-${ai.name}.png`" alt>
          </div>
        </div>
      </div>

      <!-- 品牌墙 -->
      <div class="kol-sec">
        <img v-lazy="'//files.eyee.com/activity/dglk/brand-bg.png'" alt>
        <div class="flex-wrap kol-brands">
          <div v-for="(bi, bIdx) in brands" :key="'brand'+bIdx" @click="goto('brand',bi)">
            <img v-lazy="`//files.eyee.com/activity/dglk/bd-${bi.name}.png`" alt>
          </div>
        </div>
      </div>

      <!-- 相关商品 -->
      <img v-lazy="`//files.eyee.com/activity/dglk/prd-title.png`" alt>
      <v-list :load-handle="()=>{}" :more-handle="loadmore" :more-handling="loading" :isend="isend">
        <img v-lazy="`//files.eyee.com/activity/dglk/prd-bg01.png`" alt>
        <div class="flex-wrap kol-list">
          <template v-for="(pi, pIdx) in list">
            <div class :key="'prod'+pIdx" @click="goto('product',pi)">
              <div class="kl-img">
                <img v-lazy="pi.mainpic" alt>
              </div>
              <div class="kol-sec">
                <img v-lazy="`//files.eyee.com/activity/dglk/prd-info.png`" alt>
                <div>
                  <p class="font-price">¥{{getPrice(pi.saleprice,pi.specialprice)}}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
        <img v-lazy="`//files.eyee.com/activity/dglk/prd-bg03.png`" alt>
      </v-list>
      <img v-lazy="`//files.eyee.com/activity/dglk/prd-btm.png`" alt>
    </v-delay>
  </div>
</template>
<script>
import { ProdSearch } from "@/common/api/product";

export default {
  name: "DglkHome",
  data() {
    return {
      acts: [
        { name: "ggl", url: "/rasp/rasphappy" },
        // { name: "cjbdy", url: "/20190128/main" },
        { name: "bwhb", url: "/luckycoin/home" }
      ],
      brands: [
        { name: "vans", id: "f74eb8f42bf34381a801e433b59d0f2e", isc2c: true },
        { name: "nike", id: "86233b5cb2ff41bd9bb9ce86922e2d2b", isc2c: true },
        { name: "aj", id: "f1c1dff54cab43bca5fdc0be75dc9d7c", isc2c: true },
        { name: "yeezy", id: "252e581b4f96423f9606378b924a68f1", isc2c: true },
        { name: "hgw", id: "82fea77bd00e4d28a3e8381f85760bdd", isc2c: false },
        {
          name: "converse",
          id: "d9b4ceb46595420792a1710060f56c61",
          isc2c: true
        }
      ],
      list: [],
      pageindex: 0,
      loading: false,
      isend: false
    };
  },
  mounted() {
    let _ = this,
      info = {
        title: "抖音“毁舞王”代古拉K 送你猪年福利!",
        desc:
          "除夕到十五百万AJ免费送，现金红包天天派，春节不打烊 购物399-100！",
        img: "https://files.eyee.com/activity/dglk/share.jpg",
        url: window.location.origin + "/dglk"
      };
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          sharetitle: info.title,
          sharecontent: info.desc,
          sharepicurl: info.img,
          shareurl: info.url,
          hideshareicon: false
        }
      });
    } else if (_.$root.ISWX) {
      _.initShare({ info });
    }
  },
  methods: {
    goto(type, item) {
      let _ = this,
        { ISAPP } = _.$root,
        url = "";
      console.log("goto ", type, item);
      switch (type) {
        case "vdo":
          url = "/dglk/vdo";
          break;
        case "enter":
          url = item.url + window.location.search;
          break;
        case "brand":
          if (ISAPP) {
            _.javascriptBridge({
              name: item.isc2c
                ? "gotoAppC2CSearchResultPage"
                : "gotoAppProductListPage",
              params: {
                brandid: item.id,
                keyword: item.name
              }
            });
            return;
          } else {
            url = `/results/${encodeURIComponent(item.name)}?${
              item.isc2c ? "isc2c=1" : "brandid=" + item.id
            }`;
          }
          break;
        case "product":
          if (ISAPP) {
            _.javascriptBridge({
              name: item.isc2c
                ? "gotoAppSneakerDetailPage"
                : "gotoAppProductDetailPage",
              params: { productid: item.id }
            });
            return;
          } else {
            if (item.isc2c) url = `/sneaker/detail/${item.id}`;
            else url = `/productDetail/${item.id}`;
          }
          break;
      }
      if (url) _.$router.push(url);
    },
    loadmore() {
      let _ = this,
        { loading, isend, req, toast } = _;
      if (loading) return;
      if (isend) toast("已无更多");
      else {
        _.pageindex++;
        req();
      }
    },
    req() {
      let _ = this,
        { pageindex, toast } = _;
      _.loading = true;

      ProdSearch({ pageindex, keyword: "代古拉K专题", isc2c: true })
        .then(res => {
          console.log("ProdSearch res: ", res);
          if (res) {
            if (res.list && res.list.length) {
              if (pageindex === 1) _.list = res.list;
              else _.list = _.list.concat(res.list);

              _.isend =
                res.pageindex * res.pagesize >= res.sumcount &&
                _.list.length > 0;
            } else _.isend = true;
          }
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    getPrice(sale, special) {
      let price = special > 0 && special != sale ? special : sale;
      return price > 0 ? price : "— —";
    }
  }
};
</script>
<style scoped>
.kol {
  background: url("//files.eyee.com/activity/dglk/bg.png");
}
.kol img {
  display: block;
}
.kol-sec {
  position: relative;
}
.kol-sec > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.kol-sec > div.kol-acts{
  width:75%;
  left: 50%;
  transform: translateX(-50%);
}
.kol-sec > div.kol-acts>div{
  margin: 0 2%;
}
.kol-acts {
  padding: 6% 6% 0;
}

.kol-brands {
  padding: 22% 13%;
}
.kol-brands > div {
  width: 33.33%;
}
.mint-loadmore {
  background: #f0dbb4;
}
.kol-list {
  background: url("//files.eyee.com/activity/dglk/prd-bg02.png");
  background-size: 100% auto;
  padding: 0 7%;
}
.kol-list > div {
  width: 46%;
  margin: 0 2% 20px;
  border-radius: 5px;
  overflow: hidden;
}
.kol-list p {
  width: 64%;
  color: #fff;
  text-align: center;
}
</style>
