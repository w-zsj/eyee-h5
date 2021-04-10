<template>
    <div style="padding-bottom:20px;">
      <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>我的出售</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <!-- <button @click="model">弹框</button> -->
         <div class="flex-around tab">
             <span v-for="(item,ind) in statustab" :key="ind" :class="{'active':activeindex===ind}" @click.stop="orderStatus(ind)" >{{item}}</span>
         </div>
         <!-- <mt-search v-model="value" placeholder="输入商品名称、货号快速查找" cancel-text="取消" @keyup.native.enter="loadmore(value)">

         </mt-search> -->
         <div class="sc-input flex-center" v-if="shopType=='0'">
          <input type="text" placeholder="输入商品名称、货号快速查找" v-model="keyword" @focus="searchShop" @keyup.enter="searchResult(query)">
          <img class="ico-search" :src="sImg" alt="">
          <div class="sc-cancel" v-show="css.isshow" @click.stop.prevent="cancelist"><span>取消</span></div>
        </div>
        
        <v-cutlist :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd' v-if="css.hasData && css.issearch">
          <div>
            <div v-if="shopType==0&&personageShop==1" v-for="(item,ind) in selllist" :key="ind">
              <sellinglist :info="item" :statusVal="statusVal"></sellinglist>
            </div>
            <div v-if="snealist&&snealist.length>0" v-for="(item,ind) in snealist" :key="ind">
              <orderlist :shopType='shopType' :info="item" :statusVal="statusVal" :snealist='snealist' :curVal='ind'></orderlist>
            </div>
          </div>
        </v-cutlist>
         <!-- 缺省状态 -->
        <div v-else-if="css.issearch" class="default">
          <img :src="defaultMessageImgUrl" alt="">
           您暂无{{defaultSellText}}商品哦~
           <div class="gosell" @click.stop="gosell">去出售</div>
        </div>
        <div v-else class="noresult">
            <img :src="noshoe" alt="">
            <div>暂无搜索结果</div>
            <div @click="returnList" class="returnlists">返回列表</div>
        </div>
    </div>
</template>
<script>
import { businessProcessSellList,searchsaleingproduct } from "../../../common/api/snekc2c.js";
import { mySellDetail,searchpersonalsalingproduct } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
import sellinglist from "./sellinglist.vue";
import orderlist from "./orderlist.vue";
export default {
  data() {
    return {   
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
        isshow:false,
        issearch:true
      },
      pagination: {
        sumcount: 0,
        pagesize: 10,
        pageindex: 1,
        hasLoad: true
      },
      personageShop: 0,
      defaultMessage: "",
      defaultMessageImgUrl: "/static/img/salepage_image_empty.png", //  /static/img/page_image_empty.png
      activeindex: 0,
      statustab: ["出售中", "待发货", "已发货", "交易成功", "交易失败"],
      snealist: [],
      selllist: [],
      defaultSellText: "出售中",
      keyword: "",
      sImg: "//files.eyee.com/mcdn/static/img/search_gray.png",
      query:'',
      noshoe:"/static/img/no_shoe.png",
      statusVal:1  //账户状态
    };
  },
  components: {
    sellinglist, 
    orderlist
  },
  computed: {
    ...mapGetters({
      shopType: "shopType",
      userInfo: "userInfo"
    }),
  },
  mounted() {
    let per = this.$route.params.per;
    this.personageShop = per;
    this.activeindex = this.shopType;
    console.log("shoptype c2c订单类型标识", this.shopType);
    if(this.shopType==0&&this.personageShop==1) {
      this.getBusinessProcessSellList();
    } else {
      this.sneakerListDataLoad();
    } 
  },
  methods: {
    orderStatus(index) {
      this.css.issearch = true
      this.activeindex = index;
      this.$store.dispatch("shoptype", index);
      this.selllist = [];
      this.snealist = [];
      this.pagination.pageindex = 1;
      this.keyword = ''
      this.css.isshow = false
      if(this.shopType==0&&this.personageShop==1) {
        this.getBusinessProcessSellList();
      } else {
        this.sneakerListDataLoad();
      } 
      this.defaultSellText = this.statustab[index];
    },
    loadmore(query) {
      console.log("22222222")
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        if(this.shopType==0&&this.personageShop==1) {
          this.getBusinessProcessSellList();
        } else {
          this.sneakerListDataLoad();
        } 
      }
    },
    gosell() {
      this.$router.push("/");
    },
    searchShop() {
      console.log(111111111)
      this.css.isshow=true
    },
    searchResult(query) {
      console.log("搜索")
      console.log(this.keyword)
      if(this.shopType==0&&this.personageShop==1) {
          this.searchsaleingproduct();
        } else {
          this.searchpersonalsalingproduct();
        } 
    },
    cancelist() {
      this.css.isshow = false
      if(this.keyword){
        this.keyword = ''
        this.pagination.pageindex = 1
        this.selllist = []
        if(this.shopType==0&&this.personageShop==1) {
          this.getBusinessProcessSellList();
        } else {
          this.sneakerListDataLoad();
        }
      }
    },
    returnList(){
      this.css.issearch = true
      this.css.isshow = false
      this.selllist = []
      this.keyword = ''
      this.pagination.pageindex = 1
      if(this.shopType==0&&this.personageShop==1) {
        this.getBusinessProcessSellList();
      } else {
        this.sneakerListDataLoad();
      }
    },
    sneakerListDataLoad() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
        status: this.shopType
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      console.log("获取团购列表参数: ", postParams, this.pagination.hasLoad);

      mySellDetail(postParams, this.pagination.hasLoad)
        .then(res => {
          if(res.userstatus || res.userstatus == 0){
            // this.statusVal = 2
            this.statusVal = res.userstatus
          }
          if (res && res.total && res.list.length > 0) {
            this.snealist.push(...res.list);
            this.css.hasData = true;

            if (
              postParams.page * res.size >= res.total &&
              this.snealist.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.snealist.length == 0) {
              this.css.hasData = false;
            }
          }
          this.css.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.css.isLoading = false;
          this.css.hasData = false;
        });
    },
    getBusinessProcessSellList() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;
        window.scrollTo(0, 0);
      }
      businessProcessSellList(postParams, this.pagination.hasLoad)
        .then(res => {
          console.log(res)
          if(res.status || res.status == 0){
            this.statusVal = res.status
            // this.statusVal = 2
          }
          
          if (res && res.total && res.list.length > 0) {
            this.selllist.push(...res.list);
            this.css.hasData = true;

            if (
              postParams.page * res.size >= res.total &&
              this.selllist.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.selllist.length == 0) {
              this.css.hasData = false;
            }
          }
          this.css.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.css.isLoading = false;
          this.css.hasData = false;
        });
    },

    searchsaleingproduct(){
      let postParams = {
        text: this.keyword,
      };
      this.selllist = []
      console.log(postParams)
      searchsaleingproduct(postParams)
        .then(res => {
          console.log(res)
          if(res){
            this.selllist = res
          }
          if(this.selllist.length == 0){
            this.css.issearch = false
          }else{
            this.css.issearch = true
          }
        })
        .catch(e => {
          console.error(e);
      });
    },

    searchpersonalsalingproduct(){
      let postParams = {
        text: this.keyword,
      };
      this.selllist = []
      console.log(postParams)
      searchpersonalsalingproduct(postParams)
        .then(res => {
          console.log(res)
          if(res){
            this.selllist = res
          }
          if(this.selllist.length == 0){
            this.css.issearch = false
          }else{
            this.css.issearch = true
          }
        })
        .catch(e => {
          console.error(e);
      });
    },
    
    del(v) {
      // 我不卖了
      this.snealist = [];
      this.sneakerListDataLoad();
    }
  }
};
</script>
<style scoped>
.tab {
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
}
.tab span {
  font-size: 14px;
  color: #999;
  line-height: 28px;
  position: relative;
  /* border-bottom: 2px solid #fff; */
}
.tab span.active {
  color: #333;
  font-weight: bold;
  /* border-bottom: 2px solid #333; */
}
.tab span.active::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background: #333;
  bottom: -3px;
  left: 0;
}
.default {
  text-align: center;
  font-size: 16px;
  color: #333;
}
.default img {
  width: 60%;
  margin: 0 auto;
  display: block;
  margin-top: 21vw;
  margin-bottom: 15px;
}
.gosell {
  position: fixed;
  width: 80%;
  left: 10%;
  bottom: 21vw;
  text-align: center;
  background: #333;
  color: #fff;
  line-height: 44px;
  height: 44px;
  border-radius: 5px;
}
.sc-input {
  width: 92%;
  margin: 3% auto 0;
}
.sc-input input {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ccc;
  height:30px;
}
.ico-search {
  left: 2%;
  margin-left: 5px;
}
.sc-cancel {
  padding-left: 3%;
  color: #333;
  line-height: 30px;
}
.noresult {
  text-align: center;
  margin-top: 30%;
  color:#999;
  font-size: 0.8em;
}
.noresult img {
  width: 40%;
  margin-bottom: 6%;
}
.returnlists {
  width: 48%;
  height: 9.5vw;
  background: #000;
  color: #fff;
  font-size: 1.2em;
  margin: 20% auto;
  line-height: 9.5vw;
  border-radius: 5vw;
}
</style>


