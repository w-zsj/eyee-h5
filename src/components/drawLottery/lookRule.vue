<template>
    <div >
       <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>查看往期</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <v-cutlist :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' v-if="hasData">
          <div class=" product" v-for="(item,index) in lookBefore" :key="index" @click="detail(item.id)">
              <div class="border-bot flex-between">
                  <div class="product-img">
                      <img :src="item.prizepic" alt="">
                  </div>
                  <div class="flex-col product-jeishao">
                      <div class="product-name flex-aic"><span class="ellipsis name">{{item.name}} {{item.sku}}</span> </div>
                      <div class="flex-between price">
                          <span>￥{{item.drawprize}} <i>原价￥{{item.saleprice}}</i></span>
                          <!-- <span>{{item.size}}码</span> -->
                      </div>
                  </div>
              </div>
              <!-- 中奖号码 -->
              <div class="flex-between user-info">
                  <div class="flex-aic ">
                      <img class="user-img" :src="item.targetcode.icon" alt=""> 
                      <span>中奖号码: {{item.targetcode.drawcode}}</span>     
                  </div>
                  <div>{{item.drawtime}}</div>
              </div>
          </div>
        </v-cutlist>
        <div class="nodata" v-else>暂无数据</div>
    </div>
    
</template>
<script>
import { mapGetters } from "vuex";
import { history } from "../../common/api/lotter.js";
export default {
  data() {
    return {
      isLoading: false,
      isEnd: false,
      hasData: true,
      pagination: {
        pagesize: 10,
        pageindex: 1
      },
      lookBefore: []
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
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
    detail(id) {
      this.$router.push("/drawLottery/lookRuleDetail/" + id);
    },
    trendsetter() {
      let _ = this;
      if (_.isLoading) return;
      _.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: _.pagination.pageindex,
        size: _.pagination.pagesize
      };
      if (postParams.page === 1) {
        _.isEnd = false;
        window.scrollTo(0, 0);
      }
      history(postParams)
        .then(res => {
          if (res && res.list.length > 0) {
            console.log("往期查看", res);
            _.lookBefore.push(...res.list);

            _.hasData = true;
            if (
              postParams.page * res.size >= res.total &&
              _.lookBefore.length != 1
            ) {
              _.isEnd = true;
            }
          } else {
            _.isEnd = true;
            if (_.lookBefore.length == 0) {
              _.hasData = false;
            }
          }
          _.isLoading = false;
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style scoped>
.nodata {
  text-align: center;
  margin: 150px auto 0;
}
.product {
  padding: 15px 20px;
  background: #fff;
  border-bottom: 10px solid #f5f5f9;
  padding-bottom: 0;
}
.border-bot {
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.product-img {
  width: 20%;
  border: 1px solid #ccc;
  margin-right: 10px;
}
.product-img img {
  width: 100%;
  height: 100%;
  display: block;
}
.product-jeishao {
  width: 80%;
  font-size: 12px;
  color: #3f3f3f;
}
.price {
  margin-top: 22px;
  font-size: 14px;
}
.price span i {
  font-style: normal;
  font-size: 10px;
  color: #979797;
  text-decoration: line-through;
}
.user-img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-info {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  height: 60px;
  line-height: 60px;
}
</style>


