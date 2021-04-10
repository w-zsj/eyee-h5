<template>
  <div class="flex card" @click="handleClick">
    <div class="card-right">
      <img v-lazy="info.imageurl" alt />
      <div class="card-right-status">{{info.statustext}}</div>
    </div>
    <div class="flex-col flex-btwn card-left">
      <div class="card-left-title flex">
        <span class="ellipsis-2 card-left-title-text">{{info.name}}</span>
        <!-- //收藏 -->
        <!-- <img
          @click.stop="handleIsWant"
          class="card-left-title-heart"
          :class="{'bot':info.status!==2}"
          :src="`https://files.eyee.com/mcdn/img/auc/u/ic_love`+(info.iswant?0:1)+`.png`"
          alt
        />-->
      </div>
      <div class="card-left-content flex-between">
        <div class="card-left-priceBox">
          <span class="card-left-price">
            <span style="font-size:14px">¥</span>
            <span>{{info.currentbid || info.initbid}}</span>
          </span>
          <span class="card-left-text">
            {{info.quality==0?'全新瑕疵':info.quality==1?'9成新':info.quality==2?'全新闲置':''}}
            <i
              v-if="info.quality>=0"
            >•</i>
            {{info.size}}码
          </span>

          <!-- <span class="card-left-text">
            {{info.size}}码
            <i>•</i>
            {{info.onlookers}}人围观
          </span>-->
        </div>
        <div
          class="card-left-priceBtn"
          @click="handleToDetail(info.auctiongoodid,0)"
          v-if="info.status==2"
        >出价</div>
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
<style lang="scss">
.card {
  height: 27.7333vw;
  // margin-right: 2.667vw;
  padding: 1.6vw;
  overflow: hidden;
  color: #232323;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding-right: 4vw;

  &-right {
    width: 24.5333vw;
    height: 24.5333vw;
    position: relative;
    overflow: hidden;
    border-radius: 2px;

    img {
      width: 100%;
      height: 100%;
    }

    &-status {
      padding: 0.3vw 1vw;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      color: #ffffff;
      text-align: center;
      line-height: 20px;
      font-size: 11px;
      font-weight: 600;

      background: rgba(0, 0, 0, 0.5);
      border-radius: 2px;
    }
  }

  &-left {
    width: 62.0667vw;
    overflow: hidden;
    margin-left: 2.1333vw;
    padding: 1.3333vw 0;
    &-title {
      color: #232323;
      font-size: 14px;
      font-weight: 600;
      position: relative;
      height: 40px;

      &-text {
        width: calc(100% - 23px);
        white-space: pre-line;
      }

      &-heart {
        width: 6.133vw;
        height: 6.133vw;

        position: absolute;
        bottom: -1.6vw !important;
        right: 0 !important;
        left: auto !important;
        top: auto !important;
        &.bot {
          bottom: -10.6vw;
        }
      }
    }

    &-price {
      font-size: 5.333vw;
      font-family: "OswaldBold";
    }

    &-text {
      color: #969696;
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
    }

    &-priceBtn {
      width: 11.733vw;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      line-height: 6.4vw;
      text-align: center;
      background: rgba(250, 35, 55, 1);
      border-radius: 2px;
    }
  }
}
</style>