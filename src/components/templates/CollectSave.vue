<template>
    <div class="save-extend fix-btm" :class="{'active':isShowSaveModel||cssShowPop}" @click.stop="submit(0)">
        <div class="countend fix-btm" :class="{'active':isShowSaveModel}" @click.stop>
             <div class="title">
                 <p class="ellipsis">{{productname}}</p>
                 <span>提前收藏想要的规格，快速进行心仪条件商品条件比较挑选</span>
             </div>
             <!-- 顏色尺碼 -->
             <div class="si-color" v-if="info&&info.length>0">
                <p class="si-title ">颜色/尺码</p>
                <div class="si-list " v-for="(item,indx) in info" :key="'si'+indx">
                  <!-- :class="{'selected':item.selected}" -->
                    <div class="si-pro-color ellipsis" >{{item.color}}</div>
                    <div class="si-pro-size flex-aic flex-wrap"  >
                        <span class="si-pro-list"  v-for="(subitem,index) in item.sizelist"  :class="{'selected':subitem.iscollect}"
                        :key="'sub'+index" @click.stop="selected(subitem,indx)">{{subitem.size}}</span>
                    </div>
                </div>
             </div>
             <div v-else class="nodata">
                亲，暂无法收藏哦~
             </div>
        </div>
        <!-- 球鞋 -->
        <div class="maskBox" :class="{'active':cssShowPop}">
          <p class="detailName">{{productname}}</p>
          <p class="shoucang">收藏想要的尺码，快速在心仪鞋款间比价挑选</p>
          <div class="chooseSize">
            <div
              class="shoeSize"
              v-for="(item,index) in sneakerSizeColl"
              :key="index"
              @click.stop="changeImg(index,item.size)"
            >
              <span>{{item.size}}</span>
              <img :src="item.iscollect?like2:like1" alt class="shoeImg">
            </div>
          </div>
        </div>
        <div class="select-btn fix-btm" @click.stop="submit(1)" 
          v-if="info&&info.length>0||sneakerSizeColl&&sneakerSizeColl.length>0">
           <span>{{isSneCol?'确认收藏':'请选择收藏规格'}}</span>
        </div>
    </div>
</template>
<script>
import {
  cloconfirmcollect,
  NotLogClothessizelist,
  HaslogCloconfirmcollect
} from "../../common/api/product";
import {
  ConfirmCollect,
  CollectSizeList,
  CollectSizeListLogin
} from "../../common/api/sneaker";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      infolist: [],
      updaSize: [],
      curSelectSize: [],
      ispush: true,

      // 球鞋收藏参数
      sneakerSizeColl: [],
      choosesize: [],
      like1: "/static/img/d_like1.png",
      like2: "/static/img/d_like2.png",

      hasColl:0
    };
  },
  props: {
    productid: { type: String, default: "" }, //
    productname: { type: String, default: "" }, //
    isShowSaveModel: { type: Boolean, default: false }, // 是否显示弹框
    cssShowPop: { type: Boolean, default: false } // 球鞋收藏
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    }),
    info() {
      let _ = this;
      _.updaSize = _.infolist;
      //   console.log("this.infolist", this.updaSize);
      // _.choosesize=[]
      if (_.updaSize && _.updaSize.length > 0) {
        for (let i = 0; i < _.updaSize.length; i++) {
          let co = [];
          for (let p = 0; p < _.updaSize[i].sizelist.length; p++) {
            let curSel = {};
            if (_.updaSize[i].sizelist[p].iscollect) {
              curSel.color = _.updaSize[i].color;

              curSel.size = _.updaSize[i].sizelist[p].size;

              _.updaSize[i].selected = true; // 判断颜色按钮 是否选中

              // 该商品 已经收藏
              if (_.ispush) _.curSelectSize.push(curSel);

              co.push(_.updaSize[i].sizelist[p]);
            } else if (co.length == 0) {
              _.updaSize[i].selected = false; // 判断颜色按钮 是否选中
            }
          }
        }
      }

      // if(_.updaSize.length==0)_.ShowSizeList();
      return _.updaSize;
    },
    isSneCol() {
      let _ = this;
      return (
        (_.choosesize && _.choosesize.length > 0) ||
        (_.curSelectSize && _.curSelectSize.length > 0)
      );
    }
  },
  mounted() {},
  methods: {
    changeImg(i,size) {
      let _ = this,item = _.sneakerSizeColl
      if (_.userInfo.token) {
        
        item[i].iscollect = !item[i].iscollect;
        if(item[i].iscollect){
          _.choosesize.push(_.sneakerSizeColl[i].size);
        }else{
          _.choosesize =_.choosesize.filter(i=>i!=size)
        }
         console.log(this.choosesize);
      } else {
        _.$router.push("/login");
      }
    },
    sneSizeCol() {
      let _ = this,
        api = CollectSizeListLogin;
      if (_.userInfo && _.userInfo.token) api = CollectSizeList;
      let params = {
        productid: _.productid
      };
      api(params)
        .then(res => {
          console.log("sneakerSizeColl", res);
          _.sneakerSizeColl = res.list;
          _.sneakerSizeColl.map((i, index) => {
            if (i.iscollect == 1) {
              _.choosesize.push(i.size);
            } else _.choosesize.splice(index, 1);
            return i;
          });
        })
        .catch(e => {
          console.error("CollectSizeListLogin error: ", e);
        });
    },
    ShowSizeList() {
      let _ = this,
        api = NotLogClothessizelist,
        productid = _.productid;
      if (_.userInfo && _.userInfo.token) api = HaslogCloconfirmcollect;
      if (productid)
        api(productid)
          .then(res => {
            if (res && res.length > 0) {
              _.infolist = res;
            }
          })
          .catch(e => {
            _.close();
            if (e) console.error("暂无法收藏" + e.msg);
          });
      else {
        _.close();
        // _.toast("暂无法收藏");
      }
    },
    selected(item, i) {
      let _ = this,
        curSel = {};
      item = item || {};
      _.updaSize = [];
      _.ispush = false;

      item.iscollect = !item.iscollect;
      item.color = _.infolist[i].color;
      curSel.color = _.infolist[i].color;
      curSel.size = item.size;

      if (item.iscollect) _.curSelectSize.push(curSel);
      else {
        for (var j = 0; j < _.curSelectSize.length; j++) {
          if (
            _.curSelectSize[j].size == item.size &&
            _.curSelectSize[j].color == item.color
          ) {
            _.curSelectSize.splice(j, 1);
          }
        }
      }
      console.log("已选收藏尺码", _.curSelectSize);
    },
    submit(type) {
      let _ = this;
      if (!_.userInfo || !_.userInfo.token) {
        _.$router.push("/login");
        return;
      }

      let params = {
        productid: _.productid,
        sizelist: _.curSelectSize,
        deviceid: "",
        os: "h5"
      };

      let sneParams = {
        productid: _.productid,
        size: _.choosesize.join(",") || ""
      };

      try{
        $log({ e: 'goodsCollect', p:  {productid: _.productid,type:"C2C"},t:2,ext:1 })
      }
      catch(err) { console.error('request error report error: ', err)}

      if (type == 1) {
        if (_.cssShowPop) {
          if (_.choosesize && _.choosesize.length > 0) {
            _.clcollect(sneParams, type);
          } else _.toast("请选择收藏规格");
        } else if (_.isShowSaveModel) {
          if (_.curSelectSize && _.curSelectSize.length > 0) {
         
            _.clcollect(params, type);
          } else {
            _.toast("请选择收藏规格");
          }
        }
      } else {
        if (_.cssShowPop) _.clcollect(sneParams, type);
        else if (_.isShowSaveModel) _.clcollect(params, type);
      }
    },
    clcollect(params, type) {
      let _ = this;
      let api = ConfirmCollect;
      if (_.cssShowPop) api = ConfirmCollect;
      else if (_.isShowSaveModel) api = cloconfirmcollect;

      if(params.sizelist&&params.sizelist.length||params.size&&params.size.length>1)_.hasColl=1
      else _.hasColl=0
      api(params)
        .then(res => {
          _.choosesize =[]
          _.close();
           
          if (type == 1) _.toast("收藏成功~");
        })
        .catch(e => {
          if (e) _.toast(e.msg);
          _.close();
        });
    },
    close() {
      this.$emit("closeSave",this.hasColl);
      document.body.classList.remove("lock");
    }
  },
  destroyed() {
    document.body.classList.remove("lock");
  },
  watch: {
    cssShowPop: function(n, o) {
      if (n == true) {
        document.body.classList.add("lock");
        this.sneSizeCol();
      }
    },
    isShowSaveModel: function(n, o) {
      if (n == true) {
        document.body.classList.add("lock");
        this.ShowSizeList();
      }
    }
  }
};
</script>

<style  scoped>
.save-extend {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 105;
  padding-bottom: 55px;
  background: transparent;
  transition: background 0.3s ease-in;
  pointer-events: none;
  z-index: 999;
}
.save-extend.active {
  pointer-events: unset;
  background: rgba(0, 0, 0, 0.4);
}
.save-extend .countend {
  background: #fff;
  position: absolute;
  right: 0;
  top: 0;
  width: 80%;
  height: 100vh;
  padding: 18.66vw 15px 14vw;
  overflow-y: auto;
  transform: translate(100vw, 0);
  transition: transform 0.2s ease-in;
}
.save-extend .countend.active {
  transform: translate(0, 0);
}
.select-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  margin-top: 60px;
  background: #fff;
  color: #fff;
  font-size: 14px;
  width: 80%;
  line-height: 44px;
  text-align: center;
  transform: translate(100vw, 0);
  transition: transform 0.2s ease-in;
}
.select-btn span {
  display: block;
  height: 44px;
  background: #333;
}
.save-extend.active .select-btn {
  transform: translate(0, 0);
}
.save-extend .countend p {
  color: #333;
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: bold;
}
.save-extend .countend .title {
  font-size: 12px;
  color: #999;
  margin-bottom: 30px;
}
.si-color .si-title {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
.si-list {
  font-size: 12px;
  color: #333;
  font-weight: bold;
  border-bottom: 2px solid #f5f5f5;
  padding-top: 10px;
}
.si-list:last-child {
  margin-bottom: 50px;
}
.si-list .si-pro-color,
.si-pro-size .si-pro-list {
  width: 60px;
  height: 30px;
  line-height: 30px;
  background: #f5f5f9;
  text-align: center;
  border-radius: 4px;
  margin: 0 10px 10px 0;
}
.si-list .si-pro-color {
  background: #fff;
  border: 1px solid #333;
  border-radius: 5px;
}
.si-list .selected {
  color: #fff;
  background: #333;
}
.si-pro-size .si-pro-list:nth-child(4n + 4) {
  margin-right: 0;
}
.nodata {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 80px;
}
.save-extend .countend {
  background: #fff;
  position: absolute;
  right: 0;
  top: 0;
  width: 80%;
  height: 100vh;
  padding: 18.66vw 15px 14vw;
  overflow-y: auto;
  transform: translate(100vw, 0);
  transition: transform 0.2s ease-in;
}

.save-extend .maskBox {
  position: absolute;
  right: 0;
  height: 100%;
  width: 80%;
  padding: 18.66vw 0 0 5%;
  background-color: #fff;
  overflow-y: auto;
  transform: translate(100vw, 0);
  transition: transform 0.2s ease-in;
}
.save-extend .maskBox.active {
  transform: translate(0, 0);
}
.maskBox .rightImg {
  position: absolute;
  right: 5%;
  top: 5%;
  width: 10%;
}
.maskBox .detailName {
  padding: 7% 10% 7% 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.maskBox .shoucang {
  color: #ccc;
  font-size: 0.6em;
  margin-bottom: 12%;
}
.maskBox .chooseSize {
  height: 70%;
  overflow-y: scroll;
}
.maskBox .chooseSize .shoeSize {
  border-bottom: 1px solid #ccc;
  position: relative;
  padding: 3% 0;
}
.maskBox .chooseSize .shoeSize .shoeImg {
  width: 7%;
  position: absolute;
  right: 6%;
}
</style>

