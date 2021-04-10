<template>
  <div>
    <v-list
      :load-handle="()=>{}"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      v-if="list.length>0"
    >
      <div v-if="rcd.productid" class="rcd" @click="goDetail(rcd.productid,rcd.productname)">
        <div class="pimg">
          <img v-lazy="https(rcd.imgurl)" alt>
        </div>
        <div class="flex-col flex-btwn pinfo">
          <p class="ellipsis-2 pname">{{rcd.productname}}</p>
          <div class="flex-between">
            <p class="pprice font-price">
              <span>¥{{rcd.advanceprice}}</span>
              <template v-if="rcd.saleprice&&rcd.saleprice>rcd.advanceprice">
                <span>现货价</span>
                <span>¥{{rcd.saleprice}}</span>
              </template>
            </p>
            <!-- <span class="psku">货号{{rcd.sku}}</span> -->
            <button class="pbtn">立即入手</button>
          </div>
        </div>
      </div>
      <img v-else-if="banner" v-lazy="banner" alt>
      <div class="rcd-list flex-wrap">
        <template v-for="(pi,pIdx) in list">
          <div class="pitem" :key="'list'+pIdx" @click="goDetail(pi.productid,pi.productname)">
            <div class="pimg">
              <img v-lazy="https(pi.imgurl)" alt>
            </div>
            <div class="flex-col flex-btwn pinfo">
              <p class="ellipsis-2 pname">{{pi.productname}}</p>
              <p class="pprice font-price">
                <span>¥{{pi.advanceprice}}</span>
                <template v-if="pi.saleprice&&pi.saleprice>pi.advanceprice">
                  <span>现货价</span>
                  <span>¥{{pi.saleprice}}</span>
                </template>
              </p>
              <div class="flex-center">
                <!-- <span class="psku">货号{{pi.sku}}</span> -->
                <button class="pbtn">立即入手</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </v-list>
    <div v-else-if="!loading">
      <p>未加载到数据</p>
      <button class="pbtn">去逛逛</button>
    </div>
  </div>
</template>
<script>
import { PresaleList } from "@/utils/api/sneaker";

import ProductUnit from "@/components/templates/ProductUnit";

export default {
  hasdata: 2,
  name: "Presale",
  components: { ProductUnit },
  data() {
    return {
      banner: "",
      rcd: {},
      list: [],
      page: 1,
      loading: false,
      isend: false
    };
  },
  mounted() {
    this.req();
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
        { page, toast } = _;
      _.loading = true;
      PresaleList({ page })
        .then(res => {
          if (res) {
            _.banner = res.bannerurl || "";
            _.rcd = res.recommend || {};
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
    goDetail(id, name) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid: id }
        });
      } else {
        _.$router.push("/sneaker/detail/" + id);
        if (!_.$root.isdebug)
          window.gio("track", "PresaleClick", {
            PresaleId: id,
            PresaleName: name,
            PresaleSource: "h5"
          });
      }
    }
  }
};
</script>

<style scoped>
img {
  display: block;
}
.rcd-list {
  padding: 1.5vw;
  background-color: #f8f8f8;
}
.pitem {
  width: 45.5vw;
  margin: 2vw 1.5vw;
  /* margin: 12px 16px; */
  /* padding: 12px; */
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  overflow: hidden;
  background: #fff;
}
.pimg {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-bottom: 100%;
}
.rcd .pimg {
  padding-bottom: 65%;
}
.pimg img {
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}
.pinfo {
  /* width: 84%; */
  padding: 1vw 1.8vw 2vw;
}
.rcd .pinfo {
  padding: 1vw 5vw 2vw;
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
  margin-bottom: 10px;
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
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 18px;
  padding: 3px 18px;
  border: none;
  outline: none;
}
</style>

