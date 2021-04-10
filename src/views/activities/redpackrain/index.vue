<template>
  <div class="hall">
    <div class="top"></div>
    <div class="entry">
      <div @click="goOther()">
        <img src="/static/imgs/redpackrain/hall_left.png" />
      </div>
      <div @click="goGame()">
        <img src="/static/imgs/redpackrain/hall_right.png" />
      </div>
    </div>
    <div class="block" v-if="!isxxx">
      <div class="hall_title" @click="goHall('b1')">
        <img src="/static/imgs/redpackrain/hall_t1.png" />
      </div>
      <div class="hall_product">
        <div
          class="item"
          v-for="(item, index) in b1List"
          :key="'b1'+index"
          @click="todetail('b1',item.productid)"
        >
          <div class="img">
            <img :src="item.mainpic | firstImg" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="hall_title" @click="goHall('b2')">
        <img src="/static/imgs/redpackrain/hall_t2.png" />
      </div>
      <div class="hall_product">
        <div
          class="item"
          v-for="(item, index) in b2List"
          :key="'b2'+index"
          @click="todetail('b2',item.productid)"
        >
          <div class="img">
            <img :src="item.mainpic | firstImg" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="hall_title" @click="goHall('b3')">
        <img src="/static/imgs/redpackrain/hall_t3.png" />
      </div>
      <div class="hall_product">
        <div
          class="item"
          v-for="(item, index) in b3List"
          :key="'b3'+index"
          @click="todetail('b3',item.productid)"
        >
          <div class="img">
            <img :src="item.mainpic | firstImg" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="hall_title" @click="goHall('b4')">
        <img src="/static/imgs/redpackrain/hall_t4.png" />
      </div>
      <div class="hall_product">
        <div
          class="item"
          v-for="(item, index) in b4List"
          :key="'b4'+index"
          @click="todetail('b4',item.productid)"
        >
          <div class="img">
            <img :src="item.mainpic | firstImg" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="hall_title" @click="goHall('b5')">
        <img src="/static/imgs/redpackrain/hall_t5.png" />
      </div>
      <div class="hall_product">
        <div
          class="item"
          v-for="(item, index) in b5List"
          :key="'b5'+index"
          @click="todetail('b5',item.productid)"
        >
          <div class="img">
            <img :src="item.mainpic | firstImg" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
    </div>
    <div class="guess_title"></div>
    <div class="guess_main">
      <div class="guess_main_top"></div>
      <div class="guess_main_center">
        <div
          class="guess_item"
          v-for="(item, index) in b6List"
          :key="'b6'+index"
          @click="todetail('b6',item.productid)"
        >
          <div class="img">
            <img :src="item.imageurl" />
          </div>
          <div class="name" style="-webkit-box-orient: vertical;">{{item.productname}}</div>
          <div class="price">
            <span>¥</span>
            {{item.price}}
          </div>
        </div>
      </div>
      <div class="guess_main_bottom"></div>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { CargoList } from "@/common/api/active.js";
import { IndexRecommend } from "@/common/api/sneaker";
const productIds = {
  b1: ["Pt9Qpxkb", "DojC90wT", "wJ6YkWBF", "LIDcAMPr", "oSRisPLN", "F4bprDFP"],
  b2: [
    "7df838c2f51c4b169ea7f29721865aa2",
    "b1b5cd361bf1401cbaa71b1bc0a342c8",
    "2b24cc6df5c24a4884006eb339222aa6",
    "63cd6d250efe4c34844099a0877da67f",
    "530d6eab7d0f451d9e74fef2f0932f38",
    "f44a70d65e77432c8cea71064ba821ad"
  ],
  b3: [
    "351863a5d6a14492a5cbc93acf3645c4",
    "06f1ef3651764fcebd23c5b2b50a91b6",
    "ede8df5cdbf24faa9f7165218196359e",
    "3223f8b4a42a4f3380f4b7af159ebda5",
    "80a5278733d7455486d42e879fbf0478",
    "2019244664f2469092a7b1ed94f6273b"
  ],
  b4: [
    "446e5ebd064b4170a441ce0067db2137",
    "ec778e1968f2461d90f6eb80b3ae05be",
    "8ba0d75cfd9f4fa4adf3baf44e63f794",
    "b640edde3cc84426bc2b5741a5ff8d46",
    "16ba0b5663844662afe3318cb106d484",
    "42bcfb13807f4cd2b9ce557e71c882fb"
  ],
  b5: [
    "5008980ccbb34e39ae952dee0ba7ecd6",
    "6120d56b02ae4bb4a9a6eca5f7a9353a",
    "454bc038a99b49f598385fb51320bd8e",
    "54c7ee13be014cc583ccee054ba226d0",
    "3d18a22d0ead4b95b42023eb0ee9c636",
    "a47ed5d706a04d6ca95f21dab77e11ab"
  ]
};
export default {
  name: "rainhall",
  data() {
    return {
      b1List: [],
      b2List: [],
      b3List: [],
      b4List: [],
      b5List: [],
      b6List: [],
      isxxx: false
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    }
  },
  mounted() {
    let _ = this;
    if (_.$root.ISMP) _.isxxx = true;
    return _.getList("b1", productIds.b1.join(","))
      .then(b2 => {
        return _.getList("b2", productIds.b2.join(","));
      })
      .then(b3 => {
        return _.getList("b3", productIds.b3.join(","));
      })
      .then(b4 => {
        return _.getList("b4", productIds.b4.join(","));
      })
      .then(b5 => {
        return _.getList("b5", productIds.b5.join(","));
      })
      .then(b6 => {
        return _.guessYouLove();
      })
      .catch(() => {
        console.log("获取列表失败");
      });
  },
  methods: {
    goGame() {
      let _ = this;
      if (ENV.ua.mini) {
        let domain = _.$root.isdebug
          ? "https://qzone.eyee.com/"
          : "https://m.eyee.com/";
        wx.miniProgram.navigateTo({
          url: `/pages/home/web?url=${encodeURIComponent(domain + `rainindex`)}`
        });
      } else _.$router.push("/rainindex");
    },
    goOther() {
      let _ = this;
      _.$router.push("/active/bdad300c7c1848c580a376731e13820d");
    },
    getList(type, ids) {
      let _ = this;
      return new Promise((resolve, reject) => {
        CargoList({ ids: ids })
          .then(res => {
            resolve(res);
            if (type === "b1") {
              _.b1List = res;
            } else if (type === "b2") {
              _.b2List = res;
            } else if (type === "b3") {
              _.b3List = res;
            } else if (type === "b4") {
              _.b4List = res;
            } else if (type === "b5") {
              _.b5List = res;
            }
          })
          .catch(err => {
            reject(err);
            console.log(err);
          });
      });
    },
    // 猜你喜欢
    guessYouLove() {
      let _ = this;
      IndexRecommend({
        page: 1,
        size: 8
      }).then(res => {
        _.b6List = res.list;
      });
    },
    // 猜你喜欢end
    todetail(type, productid) {
      let _ = this;
      // APP跳转
      if (_.$root.ISAPP) {
        let apptype =
          (type === "b1" ||  type === "b6")
            ? "gotoAppSneakerDetailPage"
            : "gotoAppProductDetailPage";
        _.javascriptBridge({
          name: apptype,
          params: { productid }
        });
      } else if (_.$root.ISMP) {
        if(type === "b6"){
          _.confirm({
              msg: "请在【斗牛DoNew】APP内操作?",
              okText: "立即前往",
              cancelBtn: 1,
              ok: () => {
                _.openAppClient();
                setTimeout(() => {
                  _.$router.replace("/loadapp");
                }, 800);
              }
          });
        }else{
          wx.miniProgram.navigateTo({
            url: `/pages/product/detail?id=${productid}`
          });
        }
      }
    },
    goHall(type) {
      let _ = this;
      let url,id
      if(_.$root.ISAPP){
        if (type === "b1") {
          url = "/active/0dc4507012644ea792f11e2d29b5b3d3";
        } else if (type === "b2") {
          url = "/platformActivity/8b7bf2e57f3f44d9927ead05052da952";
        } else if (type === "b3") {
          url = "/platformActivity/dfe9e9ca13f945d185ad777d762030b4";
        } else if (type === "b4") {
          url = "/platformActivity/c7c6e1407f5e4721ae866eb49ac81c0d";
        } else if (type === "b5") {
          url = "/platformActivity/dad83de933e4427a9033eaf1a4dd6b81";
        }
        _.$router.push(url);
      }else if(_.$root.ISMP){
        if (type === "b1") {
          id = "0dc4507012644ea792f11e2d29b5b3d3";
        } else if (type === "b2") {
          id = "8b7bf2e57f3f44d9927ead05052da952";
        } else if (type === "b3") {
          id = "dfe9e9ca13f945d185ad777d762030b4";
        } else if (type === "b4") {
          id = "c7c6e1407f5e4721ae866eb49ac81c0d";
        } else if (type === "b5") {
          id = "dad83de933e4427a9033eaf1a4dd6b81";
        }  
        wx.miniProgram.navigateTo({
          url: `/pages/other/activity?id=${id}`
        });      
      }
    }
  }
};
</script>
<style scoped>
.hall {
  width: 100%;
  height: auto;
  background: url("/static/imgs/redpackrain/hall_bg.png") no-repeat;
  background-size: 100% 100%;
}
.top {
  width: 100%;
  height: 61.0667vw;
  background: url("/static/imgs/redpackrain/hall_top.png") no-repeat;
  background-size: 100% 100%;
}
.bottom {
  width: 100%;
  height: 47.7333vw;
  background: url("/static/imgs/redpackrain/hall_bottom.png") no-repeat;
  background-size: 100% 100%;
}
.entry {
  margin: 3.2vw auto 0;
  width: 100%;
  height: 21.3333vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.entry div {
  width: 44.5333vw;
  height: 21.3333vw;
  border-radius: 10px;
  background: #fff;
  margin: 0 auto;
}
.entry div img {
  width: 44.5333vw;
  height: 21.3333vw;
}
.block {
  margin: 3.2vw auto 0;
  width: 91.7333vw;
  height: 69.3333vw;
  background: url("/static/imgs/redpackrain/hall_block.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 1.8667vw;
}
.block .hall_title {
  margin: 0 auto;
  width: 91.3333vw;
  height: 18.8vw;
}
.block .hall_title img {
  width: 100%;
}
.block .hall_product {
  margin-top: 1.8667vw;
  height: 43.4667vw;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-left: 2.1333vw;
}
.block .item {
  display: inline-block;
  height: 43.4667vw;
  width: 24vw;
  border: 1px solid #fff;
  border-radius: 5px;
  margin-right: 2.1333vw;
  position: relative;
  white-space: normal;
  overflow: hidden;
}
.block .item .img {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 23.4667vw;
  height: 23.4667vw;
}
.block .item .img img {
  width: 23.4667vw;
  height: 23.4667vw;
}
.block .item .name {
  position: absolute;
  top: 23.4667vw;
  left: 0px;
  width: 23.4667vw;
  height: 8.0667vw;
  line-height: 4.0333vw;
  background: url("/static/imgs/redpackrain/hall_item_name.png") no-repeat;
  background-size: 100% 100%;
  padding: 0vw 1.0667vw 0;
  font-size: 9px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.block .item .price {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 23.4667vw;
  height: 11vw;
  background: #000;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  line-height: 11vw;
  padding-left: 1.0667vw;
  font-family: 'OswaldBold';
}
.block .item .price span {
  font-size: 18px;
}
.guess_title {
  margin: 3.2vw auto;
  width: 65.2vw;
  height: 16.1333vw;
  background: url("/static/imgs/redpackrain/hall_guess_t.png") no-repeat;
  background-size: 100% 100%;
}
.guess_main {
  margin: 0 auto;
  width: 91.7333vw;
  height: auto;
  overflow: hidden;
}
.guess_main_top {
  width: 91.7333vw;
  height: 5.8667vw;
  background: url("/static/imgs/redpackrain/guess_main_top.png") no-repeat;
  background-size: 100% 100%;
}
.guess_main_center {
  width: 91.7333vw;
  height: 107.8667vw;
  background: url("/static/imgs/redpackrain/guess_main_center.png") repeat-y;
  background-size: 91.7333vw 5.7333vw;
  padding: 0 4vw;
  overflow: hidden;
}
.guess_main_center .guess_item {
  margin-bottom: 4vw;
  width: 40vw;
  height: 51.2vw;
  border: 1px solid #fff;
  border-radius: 5px;
  position: relative;
  white-space: normal;
  overflow: hidden;
}
.guess_item .img {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 39.4667vw;
  height: 32vw;
  background: #fff;
  text-align: center;
}
.guess_item .img img {
  height: 32vw;
  height: 32vw;
}
.guess_item .name {
  position: absolute;
  top: 32vw;
  left: 0px;
  width: 39.4667vw;
  height: 8.0667vw;
  line-height: 4.0333vw;
  background: url("/static/imgs/redpackrain/guess_item_name.png.png") no-repeat;
  background-size: 100% 100%;
  padding: 0 1.0667vw 0;
  font-size:9px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.guess_item .price {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 39.4667vw;
  height: 10.3333vw;
  background: #000;
  font-size: 23px;
  font-weight: bold;
  color: #fff;
  line-height: 11vw;
  padding-left: 2.9333vw;
  font-family: OswaldBold;
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf");
}
.guess_item span {
  font-size: 18px;
}
.guess_main_center .guess_item:nth-child(odd) {
  float: left;
}
.guess_main_center .guess_item:nth-child(even) {
  float: right;
}

.guess_main_bottom {
  width: 91.7333vw;
  height: 4.9333vw;
  background: url("/static/imgs/redpackrain/guess_main_bottom.png") no-repeat;
  background-size: 100% 100%;
}
</style>
