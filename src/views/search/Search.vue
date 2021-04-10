<template>
  <div class="sc-box">
    <!-- 顶部 -->
    <v-header :showback="true">
      <div class="sc-input flex-center">
        <input
          type="text"
          :placeholder="firstKey"
          ref="input"
          v-model.trim="searchKey"
          @keyup.enter="submit(searchKey)"
        />
        <img class="ico-search" :src="sImg" alt />
        <div v-show="showX" class="sc-x flex-center" @click.stop.prevent="clear">
          <i class="ico-x"></i>
        </div>
      </div>
      <!-- <div class="sc-cancel" @click.stop.prevent="goBack">
        <span>取消</span>
      </div>
      <div class="sc-ok" @click.stop.prevent="submit">
        <span>搜索</span>
      </div>-->
    </v-header>
    <!-- 意向搜索列表 -->
    <section class="purpose-ul" v-if="purposeData&&purposeData.length>0">
      <ul>
        <li
          v-for="(item,indx) in purposeData"
          :key="indx"
          @click.stop.prevent="submit(item)"
        >{{item}}</li>
      </ul>
    </section>
    <template>
      <section v-if="hotKeyArr&&hotKeyArr.length>0">
        <p class="sc-title">热门搜索</p>
        <ul class="sc-hotkey">
          <li
            v-for="(item,indx) in hotKeyArr"
            :key="indx"
            @click.stop.prevent="go(item.keyword,item)"
            :class="{'active': item.highlight==2}"
            v-show="item.keyword"
          >{{item.keyword}}</li>
        </ul>
      </section>
    </template>
    <section v-if="historyList&&historyList.length>0">
      <div class="sc-title">
        <span>历史搜索记录</span>
        <img class="sc-ico" :src="dImg" alt @click.stop.prevent="clean" />
      </div>
      <ul class="sc-history flex-aic flex-wrap">
        <li v-for="(item,i) in historyList" :key="item">
          <!-- <img :src="cImg" alt="" v-if="{isShowHistory}"> ellipsis           @click.stop.prevent="go(item)"-->
          <span @touchstart.stop="gtouchstart(i)" @touchend.stop="gtouchend(item)">{{item}}</span>
          <i class="clo flex-center" v-if="purposeCurIndex==i" @click.stop="clearhistory(i)">x</i>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { Gettoplist, GetAssWordList } from "../../utils/api/search.js";
import { ENUM, Storage } from "../../common/util.js";
import NewHeader from "@/comps/NewHeader";
import { mapGetters } from "vuex";
export default {
  components: { NewHeader },
  data() {
    return {
      sImg: "//files.eyee.com/mcdn/static/img/search_gray.png", // require('../assets/img/search_gray.png'),
      dImg: "//files.eyee.com/mcdn/static/img/dustbin.png", // require('../assets/img/dustbin.png'),
      cImg: "//files.eyee.com/mcdn/static/img/clock.png", // require('../assets/img/clock.png'),
      searchKey: "",
      storageKey: "",
      toUrl: "",
      history: [],
      hotKeyType: 0,
      timeOutEvent: null,
      purposeData: [],
      purposeCurIndex: -1,
      hotkeywords: {}
    };
  },
  beforeMount() {
    // console.log("beforeCreate search", this.hotSearchKey);
    // if (!(this.hotSearchKey && this.hotSearchKey.mallkeys)) {
    //   this.$store.dispatch("setHotSearchKey");
    // }
  },
  mounted() {
    let c2ctype = this.$route.query.isc2c;
    this.storageKey =
      c2ctype == 1 ? "sneakerLocal" : ENUM.StorageKey.SEARCH + 2;
    let storage = Storage.get(this.storageKey);
    if (!(storage && storage.length > 0)) storage = [];
    this.history = storage;
    console.log("history", this.history);
    this.hotwors();
  },
  computed: {
    ...mapGetters(["hotSearchKey", "newsSearchSneaker"]),
    hotKeyArr() {
      return this.hotkeywords;
    },
    historyList() {
      return this.history;
    },
    firstKey() {
      let list = this.hotKeyArr;
      if (list && list.length > 0) return list[0].keyword;
      else return "Search";
    },
    showX() {
      if (this.searchKey && this.searchKey.length > 0) return true;
      else return false;
    },
    isc2c() {
      return this.$route.query.isc2c;
    }
  },
  methods: {
    hotwors() {
      let type = this.isc2c == 1 ? 1 : 2;
      Gettoplist(type)
        .then(res => {
          let _ = this;
          console.log("热词", res);
          _.hotkeywords = res;
          _.hotkeywords.map(i => {
            if (
              /.*?eyee\.com\/rainhall/i.test(i.link) ||
              /.*?eyee\.com\/collectionCard/i.test(i.link)
            )
              i.keyword = "";
            if (i.keyword) return i;
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    clear() {
      this.searchKey = "";
      this.$refs.input.focus();
    },
    goBack() {
      if (window.mqq) window.mqq.ui.popBack();
      else this.$router.back();
    },
    submit(keyword) {
      let _ = this;

      /**
       * 命令行模式
       * fc://do([todo])
       */
      _.keyword = keyword;
      if (_.keyword && _.keyword.length > 0) {
        _.setStorage(_.keyword);
        _.go(_.keyword);
      } else _.toast("请输入要搜索的关键字");
    },

    setStorage(key) {
      var s = this.history,
        b = false;
      if (!s || s.length < 1) s = [];
      if (s.length > 0) {
        s.forEach((i, idx) => {
          // console.log('i==key?%s,key:%s', i == key, key)
          if (i == key) {
            s.splice(idx, 1);
            b = true;
            return;
          }
        });
      }
      // console.log('bbbb', b);
      if (!b) {
        if (s.length > 4) s.pop();
      }
      this.history.unshift(key);
      // console.log('setStorage:%s,val:', this.storageKey, this.history);
      Storage.set(this.storageKey, this.history);
    },
    clearhistory(key) {
      var s = this.history;

      s.forEach((i, idx) => {
        // console.log('i==key?%s,key:%s', i == key, key)
        if (idx == key) {
          s.splice(idx, 1);
        }
        return i;
      });
      // this.purposeCurIndex =-1
      console.log("setStorage:%s,val:", key);
      Storage.set(this.storageKey, s);
    },
    clean() {
      this.history = [];
      Storage.set(this.storageKey, this.history);
      // Storage.del(this.storageKey)
    },
    go(key, item) {
      item = item || {};
      this.setStorage(key);
      let isc2c =
        (item.channel && item.channel == 2) || this.isc2c == 1 ? 1 : 0;
      if (this.isc2c == 1 || item.channel == 2) isc2c = 1;
      else if (item.channel == 1) isc2c = 0;
      else isc2c = "";
      if (item.type == 3) {
        this.$router.replace("/platformActivity/" + item.link);
      } else
        this.$router.replace(
          "/results/" + encodeURIComponent(key) + "?isc2c=" + isc2c
        );
      $log({ e: "search", p: { keyword: key }, t: 2, ext: 1 });
    },
    gtouchstart(i) {
      let _ = this;
      _.timeOutEvent = setTimeout(function() {
        _.longPress(i);
      }, 500);
      return false;
    },

    gtouchend(key) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        this.go(key);
      }
      return false;
    },
    longPress(i) {
      this.timeOutEvent = 0;
      console.log("longPress", i);
      this.purposeCurIndex = i;
    }
    // ,
    // getHotKeys() {
    //   HotSearchKey().then((res) => {
    //     console.log('热门搜索关键字', res)
    //     this.$store.dispatch('setHotSearchKey', res)
    //   }).catch(e => { console.error('热门搜索关键字加载失败', e) })
    // }
  },
  watch: {
    searchKey: function(newVal, oldVal) {
      // console.log("newVal", newVal);
      let type = this.isc2c == 1 ? 1 : 2;
      GetAssWordList(newVal, type)
        .then(res => {
          if (res) {
            this.purposeData = res;
          } else this.purposeData = [];
        })
        .catch(e => {
          this.purposeData = [];
          console.error(e);
        });
    }
  }
};
</script>
<style scoped>
.sc-box {
  font-size: 12px;
  color: #666;
  min-height: 90vh;
  background-color: #f9f9f9;
}
.purpose-ul {
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding-bottom: 0;
}
.purpose-ul li {
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #f0f0f0;
}
section {
  padding: 15px 10px;
}

.sc-title {
  border-left: 2px solid #999;
  line-height: 14px;
  padding: 0 10px 1px;
  position: relative;
  margin: 0 3px;
}

.sc-ico {
  width: 14px;
  position: absolute;
  right: -8px;
}

.sc-history li {
  /* line-height: 44px; */
  padding: 10px 15px;
  margin: 10px 10px 0 0;
  background-color: #fff;
  border-radius: 2px;
  position: relative;
}
.sc-history li i.clo {
  position: absolute;
  width: 14px;
  height: 14px;
  font-style: normal;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  background: #999;
  right: -7px;
  top: -7px;
}
.sc-history img {
  width: 14px;
  vertical-align: middle;
  margin-right: 15px;
}

.sc-hotkey {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
}

.ico-x::before {
  content: "×";
}

.sc-input {
  /* width: 90%; */
}
.sc-ok {
  font-size: 14px;
}
.sc-cancel {
  text-align: center;
  padding-right: 6px;
}
.sc-ok,
.sc-cancel {
  width: 15%;
  line-height: 46px;
  padding-left: 3px;
}
.sc-title {
  border-left: 2px solid #999;
  line-height: 14px;
  padding: 0 10px 1px;
  position: relative;
  margin: 0 3px;
}

.sc-ico {
  width: 14px;
  position: absolute;
  right: -8px;
}

.sc-history img {
  width: 14px;
  vertical-align: middle;
  margin-right: 15px;
}

.sc-hotkey {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
}

.sc-hotkey li {
  padding: 10px 15px;
  margin: 10px 10px 0 0;
  background-color: #fff;
  border-radius: 2px;
}
.sc-hotkey li.active {
  color: #ff6828;
}
</style>
