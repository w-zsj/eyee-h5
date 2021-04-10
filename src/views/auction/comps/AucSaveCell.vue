<template>
  <div class="card" @click="handleClick">
    <div class="card-right">
      <img v-lazy="info.imageurl" alt />
      <div class="card-right-status">{{info.statustext}}</div>
      <!-- 直播中 -->
      <template v-if="info.livestatus">
        <span class="live-img"></span>
      </template>
    </div>
    <div class="card-left">
      <div class="card-left-title">{{info.name}}</div>
      <div class="card-left-content">
        <div class="card-left-priceBox">
          <p class="card-left-markprice font-price">¥<span>{{info.marketprice}}</span></p>
          <p class="card-left-price font-price">
            <em>¥</em>
            <span>{{info.currentbid || info.initbid}}</span>
          </p>
          <p class="card-left-text">
            {{info.quality==0?'全新瑕疵':info.quality==1?'9成新':info.quality==2?'全新闲置':''}}
            <i
              v-if="info.quality>=0"
            >•</i>
            {{info.size}}码
          </p>
        </div>
        <div class="card-left-handle">
          <img
            @click.stop="handleIsWant"
            class="card-left-heart"
            :src="info.iswant?'//files.eyee.com/mcdn/img/auction/icon_star_selected.png':'//files.eyee.com/mcdn/img/auction/icon_star_unselected.png'"
            alt
          />
          <div
            class="card-left-price-btn"
            @click="handleToDetail(info.auctiongoodid,0)"
            v-if="info.status==2"
          >出价</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { IsWant } from "@/utils/api/auction";
export default {
  data() {
    return {};
  },
  props: {
    info: Object,
    detail: Boolean,
    loged: Boolean
  },
  methods: {
    checkLogin(callback) {
      let _ = this;
      if (_.loged) callback();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    },
    handleIsWant() {
      let _ = this,
        { auctiongoodid, iswant } = _.info || {};
      iswant = iswant > 0 ? 0 : 1 || 0;
      _.checkLogin(() => {
        IsWant(auctiongoodid, iswant)
          .then(res => {
            console.log("TCL: handleIsWant -> res", res);
            _.$set(_.info, "iswant", iswant);
            _.$emit("sencedeal", { auctiongoodid, iswant });
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    handleClick() {
      let _ = this,
        { auctiongoodid } = _.info || {},
        channel = _.$route.query.channel || 0;
      if (auctiongoodid) {
        _.$emit("handleLog", auctiongoodid);
        _.$router.push(
          `/auction/detail/ ${auctiongoodid}?channel=${channel == 1 ? 1 : 0} `
        );
      } else {
        console.error("没有auctiongoodid");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.live-img {
  position: absolute;
  width: 14.4vw;
  height: 4.8vw;
  top: 6.133vw;
  left: 2.133vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_video.png") no-repeat 0 0;
  background-size: contain;
}
.card {
  display: flex;
  padding: 1.333vw 3.2vw 1.333vw 1.333vw;
  height: 32vw;
  background-color: #282828;
  border-radius: 3.2vw;
  overflow: hidden;
  color: #fff;

  &-right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 29.333vw;
    height: 29.333vw;
    position: relative;
    overflow: hidden;
    border-radius: 3.2vw;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    &-status {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 3.2vw 0 3.2vw 0;
      width: 12.2666vw;
      line-height: 5.333vw;
      color: #ffffff;
      text-align: center;
      font-size: 2.666vw;
      font-weight: 600;
    }
  }

  &-left {
    flex: 1;
    padding-left: 3.2vw;

    &-title {
      margin-top: 1.333vw;
      height: 9.6vw;
      overflow: hidden;
      line-height: 4.8vw;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
      font-size: 3.466vw;
      font-weight: 600;
    }
    &-content {
      display: flex;
      height: 18.4vw;
      align-items: flex-end;
      padding-bottom: 1.333vw;
    }
    &-priceBox {
      flex: 1;
    }
    &-price {
      line-height: 5.866vw;
      color: #C8AF6E;
      font-size: 3.733vw;
      font-weight: 600;

      span {
        font-size: 4.8vw;
      }
    }
    &-markprice {
      margin-left: -1.9vw;
      color: #969696;
      font-size: 2.666vw;
      font-weight: 600;
      text-decoration: line-through;
      transform: scale(0.9);
      span {
        font-size: 3.733vw;
      }
    }
    &-text {
      font-size: 2.666vw;
      color: #969696;
    }
    &-handle {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    &-heart {
      width: 5.866vw;
      height: 5.866vw;
    }
    &-price-btn {
      margin-top: 2.4vw;
      width: 13.333vw;
      line-height: 7.466vw;
      background-color: #000000;
      border-radius: 3.733vw;
      text-align: center;
      color: #C8AF6E;
      font-size: 3.466vw;
      font-weight: 600;
    }
  }
}
</style>