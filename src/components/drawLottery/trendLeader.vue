<template>
    <div>
        <div class="going-buy">
            <span>潮人正在买</span>
        </div>
        <v-cutlist :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' v-if="hasData">
            <div class="flex-between damp-user flex-wrap">
                <div class="flex-col product" v-for="(item,index) in snealist" :key="index"  @click.stop="goDetail(item.productid)">
                    <div>
                        <img :src="item.productimgurl" alt="">
                    </div>
                    <p class="product-name ellipsis">{{item.productname}}</p>
                    <p class="product-price">￥{{item.productprice>0?item.productprice:'--'}}</p>
                </div>
            </div>
        </v-cutlist>
    </div>
    
</template>

<script>
import { Recommend } from "../../common/api/lotter.js";
export default {
  data() {
    return {
      isLoading: false,
      isEnd: false,
      hasData: true,
      pagination: {
        pagesize: 5,
        pageindex: 1
      },
      snealist: []
    };
  },
  mounted() {
    this.trendsetter();
  },
  methods: {
    loadmore() {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        this.trendsetter();
      }
    },
    goDetail(id) {
      this.$router.push("/sneaker/detail/" + id);
    },
    trendsetter() {
      if (this.isLoading) return;
      this.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.isEnd = false;
        window.scrollTo(0, 0);
      }
      Recommend(postParams)
        .then(res => {
          if (res && res.list.length > 0) {
              console.log('潮人在mai',res.list)
            this.snealist.push(...res.list);
            
            this.hasData = true;
            if (
              postParams.page * res.size >= res.total &&
              this.snealist.length != 1
            )
              this.isEnd = true;
          } else {
            this.isEnd = true;
            if (this.snealist.length == 0) {
              this.hasData = false;
            }
          }
          this.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.isLoading = false;
          this.hasData = false;
        });
    }
  }
};
</script>
<style scoped>
.going-buy {
  font-size: 14px;
  color: #333;
  text-align: center;
  padding-top: 5.3vw;
  padding-bottom: 10.6vw;
  background: #fcfcfc;
}
.going-buy span {
  position: relative;
}
.going-buy span:before,
.going-buy span:after {
  content: "";
  position: absolute;
  width: 10px;
  height: 1px;
  background: #333;
  top: 50%;
  left: -15px;
  transform: translateY(-50%);
}
.going-buy span:after {
  left: auto;
  right: -15px;
}
.damp-user {
  background: #fcfcfc;
}
.damp-user .product {
  width: 49%;
  background: #fff;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2%;
  padding-bottom: 10px;
}
.damp-user .product .product-name {
  font-size: 12px;
  width: 100%;
  padding: 0 10px;
}
.damp-user .product .product-price {
  font-size: 14px;
  margin-top: 7.2vw;
}
</style>


