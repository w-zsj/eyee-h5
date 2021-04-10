<template>
  <div>
    <img v-if="banner" v-lazy="banner" alt>
    <v-list
      :load-handle="()=>{}"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      v-if="list.length>0"
    >
      <div class="rcd-list">
        <template v-for="(pi,pIdx) in list">
          <div class="flex-between pitem" :key="'list'+pIdx" @click="goDetail(pi.productid)">
            <div class="pimg">
              <img v-lazy="https(pi.productimgurl)" alt>
            </div>
            <div class="flex-col flex-btwn pinfo">
              <p class="ellipsis-2 pname">{{pi.productname}}</p>
              <div class="pprice flex-between">
                <p class="font-price">
                  <span>¥{{pi.productprice || ' — —'}}</span>
                  <!-- <template v-if="pi.saleprice&&pi.saleprice>pi.advanceprice">
                    <span>现货价</span>
                    <span>¥{{pi.saleprice}}</span>
                  </template>-->
                </p>
                <div class>
                  <!-- <span class="psku">货号{{pi.sku}}</span> -->
                  <button class="pbtn">马上抢</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </v-list>
  </div>
</template>
<script>
import { PresaleList } from "@/utils/api/sneaker";

import { SneakerSearch } from "@/common/api/sneaker"; //按关键词--年度热销，销量 搜索

import ProductUnit from "@/components/templates/ProductUnit";

export default {
  name: "HotSale",
  components: { ProductUnit },
  data() {
    return {
      banner: "https://files.eyee.com/activity/hotsale.jpg",
      list: [],
      page: 1,
      size: 10,
      loading: false,
      isend: false,
      key: ""
    };
  },
  mounted() {
    let _ = this;
    _.key = _.$route.query.k || "春季新品";
    _.setToolBar({ title: _.key + "榜" });
    _.req();
  },
  methods: {
    loadmore() {
      let _ = this,
        { loading, isend, req, toast } = _;
      if (loading) return;
      if (isend) toast("已无更多");
      else {
        _.page++;
        req();
      }
    },
    req() {
      let _ = this,
        { page, toast, size, key } = _;
      _.loading = true;
      let postParams = {
        page: page,
        size: size,
        sorttype: 1, //sorttype	搜索类型:	默认0:人气,1销量,2新品,3价格
        keyword: key
      };
      SneakerSearch(postParams)
        .then(res => {
          if (res) {
            if (res.list && res.list.length) {
              // res.list = res.list.map(i => {
              //   // i.paynumber = i.sumcount;
              //   return {
              //     id: i.productid,
              //     name: `${i.name} ${i.sku||''} ${i.size||''}${!!i.size?'码':''}`,// 商品名称 +货号+尺码
              //     mainpic: i.imgurl || "",
              //     saleprice: i.price,
              //     specialprice: 0,
              //     isc2c: 1
              //     // paynumber: i.paynumber
              //   };
              // });
              if (page === 1) _.list = res.list;
              else _.list = _.list.concat(res.list);
              _.isend = res.page * res.size >= res.total && _.list.length > 0;
            } else _.isend = true;
          }
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    goDetail(id) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid: id }
        });
      } else _.$router.push("/sneaker/detail/" + id);
    }
  }
};
</script>

<style scoped>
img {
  display: block;
}
.pitem {
  margin: 12px 16px;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
}
.pimg {
  width: 24%;
}
.pimg img {
}
.pinfo {
  width: 84%;
  padding: 0 12px;
}
.pname {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  line-height: 18px;
  height: 36px;
  margin-bottom: 4px;
}
.pprice {
  margin-bottom: 16px;
}
.pprice span:not(:first-of-type) {
  font-size: 13px;
  font-weight: 400;
  color: #999;
  line-height: 18px;
  margin-right: 8px;
}
.pprice span:last-of-type {
  font-size: 16px;
}
.pprice span:first-of-type {
  font-size: 20px;
  color: #333;
  line-height: 26px;
  margin-right: 20px;
}
.psku {
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  line-height: 18px;
}
.pbtn {
  background: linear-gradient(
    223deg,
    rgba(96, 175, 255, 1) 0%,
    rgba(128, 80, 255, 1) 100%
  );
  border-radius: 13px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 18px;
  padding: 3px 18px;
  border: none;
  outline: none;
}
</style>

