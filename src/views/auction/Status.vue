<template>
  <div>
    <p class="flex-between aco-status">
      <span class="bold">{{info.statustext}}</span>
      <span v-if="cd&&(info.status==2||info.status==1)" :class="{'red':info.status==2}" class="wh">
        <i v-if="info.status==1">买家支付倒计时:{{cd}}</i>
        <i v-else>请在{{cd}}前发货</i>
      </span>
      <span class="flex-center" v-else @click.stop="checknotpass(info.checknotpassurl)">
        <i class="gh" v-if="info.childstatus==11"></i>
        {{info.auctiontext||''}}
        <span
          class="red open flex-center"
          @click.stop="openInfo(info.checkmemo,info.auctiontext)"
          v-if="info.checkmemo"
        >
          展开
          <i class="ico-lg"></i>
        </span>
      </span>
    </p>
  </div>
</template>
<script>
window.$cd;
const pad = num =>
  Math.floor(num)
    .toString()
    .padLeft(2, "0");
export default {
  data() {
    return {
      cd: ""
    };
  },
  props: {
    item: Object,
    isOrder: Boolean
  },
  computed: {
    info() {
      let _ = this;
      let it = _.item;
      if (_.isOrder) {
        // if ($timer) clearTimeout($timer);
        if (it.status == 1 && it.waitpaytime > 0) {
          _.countdown(it.waitpaytime);
        } else if (it.status == 2 && it.waitshiptime > 0) {
          _.countdown(it.waitshiptime);
        }
      }
      return it;
    }
  },
  methods: {
    openInfo(msg, title) {
      let _ = this;
      _.confirm({
        title: title,
        msg,
        okText: "我知道了",
        cancelBtn: 1
      });
    },
    checknotpass(url) {
      let _ = this;
      if (ENV.ua.mini) {
        wx.miniProgram.navigateTo({
          url: `/pages/auction/publish/richtext?url=${encodeURIComponent(url)}`
        });
      } else {
        url = url.split("active/")[1];
        // _.toast(url);
        _.$router.push(`/active/${url}`);
      }
    },
    countdown(next) {
      let _ = this;
      if (next > 0) {
        const pad = num =>
          Math.floor(num)
            .toString()
            .padLeft(2, "0");
        _.cd = `${pad(next / 36e5) || "00"}:${pad((next / 6e4) % 60) ||
          "00"}:${pad((next / 1e3) % 60) || "00"}`;

        next -= 1000;
        setTimeout(
          () => {
            //   console.log(_.cd)
            _.countdown(next);
          },
          next > 0 ? 1000 : 0
        );
      } else {
        _.cd = "00:00:00";
        _.$router.push({
          path: "/auction/orders",
          query: { s: _.info.status }
        });
      }
    }
  }
};
</script>