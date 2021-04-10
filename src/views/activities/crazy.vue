<template>
  <div>
    <div class="banner">
      <img src="https://files.eyee.com/eyeeh5/img/activity/banner.jpg" alt="" />
    </div>
    <div class="img" v-for="(item, index) in imglist" :key="index">
      <img
        v-lazy="https(item.pic)"
        alt=""
        @click.stop="joinActivity(item.id)"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imglist: [
        {
          date: "11.4",
          id: "4ifuOt19",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=4ifuOt19",
          pic: `https://files.eyee.com/eyeeh5/img/activity/1.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.6",
          id: "hR5FmNjD",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=hR5FmNjD",
          pic: `https://files.eyee.com/eyeeh5/img/activity/2.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.6",
          id: "KCUfyLkq",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=KCUfyLkq",
          pic: `https://files.eyee.com/eyeeh5/img/activity/3.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.7",
          id: "vJOyIedm",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=vJOyIedm",
          pic: `https://files.eyee.com/eyeeh5/img/activity/4.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.7",
          id: "3UBQd681",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=3UBQd681",
          pic: `https://files.eyee.com/eyeeh5/img/activity/5.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.8",
          id: "yoqrlzKk",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=yoqrlzKk",
          pic: `https://files.eyee.com/eyeeh5/img/activity/6.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.8",
          id: "06N1PzM0",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=06N1PzM0",
          pic: `https://files.eyee.com/eyeeh5/img/activity/7.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.9",
          id: "aN3HecXg",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=aN3HecXg",
          pic: `https://files.eyee.com/eyeeh5/img/activity/8.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.9",
          id: "EzvdIf9M",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=EzvdIf9M",
          pic: `https://files.eyee.com/eyeeh5/img/activity/9.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.10",
          id: "2UCj5o7d",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=2UCj5o7d",
          pic: `https://files.eyee.com/eyeeh5/img/activity/10.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.10",
          id: "r1QP6aip",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=r1QP6aip",
          pic: `https://files.eyee.com/eyeeh5/img/activity/11.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.11",
          id: "SupB2YOC",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=SupB2YOC",
          pic: `https://files.eyee.com/eyeeh5/img/activity/12.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.11",
          id: "Kb6suwsl",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=Kb6suwsl",
          pic: `https://files.eyee.com/eyeeh5/img/activity/13.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.12",
          id: "pzL9vfi3",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=pzL9vfi3",
          pic: `https://files.eyee.com/eyeeh5/img/activity/14.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.12",
          id: "zBMGioiE",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=zBMGioiE",
          pic: `https://files.eyee.com/eyeeh5/img/activity/15.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.13",
          id: "Kr559kvz",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=Kr559kvz",
          pic: `https://files.eyee.com/eyeeh5/img/activity/16.png?c=${new Date().getTime()}`,
        },
        {
          date: "11.13",
          id: "2xKyXAAs",
          path: "https://m.eyee.com/sneakerticket/detail?activityid=2xKyXAAs",
          pic: `https://files.eyee.com/eyeeh5/img/activity/17.png?c=${new Date().getTime()}`,
        },
      ],
    };
  },
  mounted() {
    let _ = this;
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          sharecontent: "低价球鞋每日抢不停",
          sharetitle: "球鞋狂欢周",
          shareurl: "https://m.eyee.com/activity/crazy",
          sharepicurl:
            "http://files.eyee.com/eyeeh5/img/activity/share.jpg?c=" +
            new Date().getTime(),
          callbackname: "",
          hideshareicon: false,
        },
      });
    } else if (_.$root.ISMP) {
      let data = {
        sharetitle: "球鞋狂欢周",
        sharecontent: "低价球鞋每日抢不停",
        xcxurl: `/pages/home/web?url=${encodeURIComponent(
          "https://m.eyee.com/activity/crazy"
        )}`,
        xcxicon:
          "http://files.eyee.com/eyeeh5/img/activity/wx-share.jpg?c=" +
          new Date().getTime(),
      };
      wx.miniProgram.postMessage({ data: { share: data } });
    } else {
      _.initShare({
        info: {
          title: "球鞋狂欢周",
          url: "https://m.eyee.com/activity/crazy",
          img:
            "http://files.eyee.com/eyeeh5/img/activity/share.jpg?c=" +
            new Date().getTime(),
          desc: "低价球鞋每日抢不停",
        },
      });
    }
  },
  methods: {
    joinActivity(id) {
      if (id) {
        if (this.$root.ISMP) {
          wx.miniProgram.navigateTo({
            url: "/pages/bull/sneakerTicket?activityid=" + id,
          });
        } else if (this.$root.ISAPP) {
          this.$router.push(`/sneakerticket/detail?activityid=${id}`);
        } else this.toast("请在斗牛APP内参与活动");
      }
    },
  },
};
</script>
<style scoped lang='scss'>
img {
  display: block;
}
</style>