<template>
  <div class="list" v-if="recordList.length">
    <v-list
      :load-handle="getRecordList"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isEnd"
    >
      <ul>
        <li v-for="(item,index) in recordList" :key="index">
          <div class="title">{{item.typedesc}}</div>
          <div class="num">
            {{item.status===1?"+":"-"}}<img src="/static/imgs/ball/oxball_b.png?c=1" />{{item.amount}}
          </div>
          <div class="date">{{item.createdate}}</div>
        </li>
      </ul>
    </v-list>
  </div>
  <div class="nodata" v-else>
    <img src="/static/imgs/ball/norecord.png?c=1" />
    <span>暂无牛丸获取记录</span>
  </div>
</template>
<script>
import { GetBallRecordApi } from "@/utils/api/oxball";
import { getIosVersion } from "@/common/util";
let page = 1,
  size = 10;
export default {
  name: "oxballrecord",
  data() {
    return {
      loading: false,
      isEnd: false,
      recordList: []
    };
  },
  mounted() {
    let _ = this;
    _.getRecordList();
    //ios9特殊处理
    // if (!(getIosVersion() < 10)) {
    //   if (window.history && window.history.pushState) {
    //     history.pushState(null, null, document.URL);
    //     window.addEventListener("popstate", _.physicalReturn, false); //false阻止默认事件
    //   }
    // }
  },
  // destroyed() {
  //   let _ = this;
  //   window.removeEventListener("popstate", _.physicalReturn, false); //false阻止默认事件
  // },
  methods: {
    // physicalReturn() {
    //   let _ = this;
    //   _.javascriptBridge({
    //     name: "gotoAppMallCenterPage",
    //     params: {
    //       homepageindex: 4
    //     }
    //   });
    // },
    getRecordList() {
      page = 1;
      let _ = this;
      _.load();
    },
    load() {
      let _ = this;
      _.loading = true;
      GetBallRecordApi({ page, size })
        .then(res => {
          if (res.list && res.list.length > 0) {
            if (page === 1) _.recordList = res.list;
            else _.recordList = _.recordList.concat(res.list);
            _.isEnd =
              res.page * res.size >= res.total && _.recordList.length > 0;
          } else if (page === 1) _.recordList = [];
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast("加载失败~");
        });
    },
    loadmore() {
      let _ = this,
        { isEnd } = _;
      if (isEnd) return;
      page++;
      _.load();
    }
  }
};
</script>

<style scoped>
.mint-loadmore {
  background: none;
}
.list {
  margin: 4vw auto 0;
  width: 92vw;
  height: auto;
  padding-bottom: 6.4vw;
  border-radius: 0px 0px 20px 20px;
}
.list li {
  border-radius: 6px;
  margin-bottom: 2.666vw;
  background: #fff;
  width: 100%;
  height: 19.466vw;
  position: relative;
}
.list li .title {
  padding-left: 5.333vw;
  padding-top: 6.933vw;
  color: #232323;
  font-size: 14px;
  font-weight: 600;
}
.list li .num {
  position: absolute;
  right: 5.333vw;
  top: 4.266vw;
  color: #232323;
  font-size: 14px;
  font-weight: 600;
  height: 5.333vw;
  height: 5.333vw;
}
.list li .num img {
  display: inline-block;
  vertical-align: top;
  margin-right: 0.666vw;
  width: 4.8vw;
  height: 4.8vw;
}
.list li .date {
  position: absolute;
  right: 5.333vw;
  top: 10.933vw;
  color: #969696;
  font-size: 12px;
  font-weight: 400;
}
.nodata {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 48.533vw;
  background: #f5f5f5;
  text-align: center;
}
.nodata img {
  display: block;
  margin: 32vw auto 0;
  width: 32vw;
  height: 32vw;
}
.nodata span {
  font-size: 16px;
  font-weight: 600;
  color: #b4b4b4;
}
</style>