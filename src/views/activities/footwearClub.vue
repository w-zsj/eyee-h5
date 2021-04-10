<template>
  <div class="footwearclub-page">
    <loader class="load" from="3" ref="load" :id="teamid" v-if="!$root.ISAPP">
      <img style="display:block" src="/static/img/bull/download_app.png?c=1" alt />
    </loader>
    <!-- <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3 class="bold">加入潮友团</h3>
      </div>
    </v-header> -->
    <div class="club-cont clearfix">
      <img :src="bgImgurl" alt="">
      <div class="club-detls bg-gradient">
        <img class="leader-pic" :src="clubInfos.leaderimage" alt />
        <p class="leader-name">团长：{{clubInfos.leadername}}</p>
        <p class="club-name">{{clubInfos.teamname}}</p>
        <p class="club-describs">{{clubInfos.description}}</p>
        <div class="butn-joinclub" @click="joinClub()">加入他的潮友团</div>
      </div>
    </div>
    <!-- <div class="flesh-imgs">
      <img v-for="(item,index) in fleshImgs" :key="index" v-lazy="item" alt="">
    </div>
    <div class="bonus-imgs">
      <img v-for="(item,index) in bonusImgs" :key="index" v-lazy="item" alt="">
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FootwearClubHInfos, FootwearClubJoin } from "../../common/api/bull";
import Loader from "@/comps/Loader";
export default {
  components: { Loader },
  data() {
    return {
      bgImgurl:
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_bg.png?c=1",
      clubInfos: {},
      userid: "",
      teamid: "",
      fleshImgs: [
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_img6.png",
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_img7.png"
      ],
      bonusImgs: [
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_img9.png",
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_img10.png",
        "https://files.eyee.com/eyeeh5/img/monitor/shoefriend_img11.png"
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    })
  },
  mounted() {
    let _ = this;
    console.log("地址栏携带参数", _.$route.query);
    var userid = _.$route.query.userid,
      teamid = _.$route.query.teamid;
    _.teamid = teamid;
    _.userid = userid;
    if (userid && teamid) {
      _.getInfos(userid, teamid);
    }
  },
  methods: {
    getInfos(userid, teamid) {
      let _ = this;
      FootwearClubHInfos({ userid: userid, teamid: teamid })
        .then(res => {
          console.log(res);
          this.clubInfos = res;
        })
        .catch(err => {
          if (err && err.msg == "对不起，该鞋团已不存在") {
            _.toast(err.msg);
            setTimeout(function() {
              _.$router.push("/");
            }, 1000);
          }
          console.log(err);
        });
    },
    joinClub() {
      let _ = this,
        settimeEves = function() {
          setTimeout(function() {
            _.$refs.load.$el.click();
          }, 1500);
        };
      $log({
        e: "click",
        p: { describe: "页面浏览数，加入潮友团的按钮点击数" }
      });
      if (_.user.token) {
        FootwearClubJoin({ teamid: _.$route.query.teamid })
          .then(res => {
            _.toast("加团成功，前往下载斗牛DoNew APP");
            settimeEves();
          })
          .catch(err => {
            if (err && err.msg == "已经加入该团") {
              _.toast("你已加入该潮友团，打开斗牛DoNew APP查看详情");
              settimeEves();
              // setTimeout(function(){
              //     window.location = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee&channel=0002160650432d595942&fromcase=60001';
              // },2000);
            } else if (err && err.msg == "已经加入其他潮友团") {
              _.toast("你已加入其它潮友团，打开斗牛DoNew APP查看详情");
              settimeEves();
              // setTimeout(function(){
              //     window.location = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee&channel=0002160650432d595942&fromcase=60001';
              // },2000);
            } else if (err && err.msg == "不是普通鞋头，无法加入潮友团") {
              _.toast("你已加入其它潮友团，打开斗牛DoNew App查看详情");
              settimeEves();
              // setTimeout(function(){
              //     window.location = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee&channel=0002160650432d595942&fromcase=60001';
              // },2000);
            } else {
              _.toast(err.msg);
            }
            console.log(err);
          });
      } else {
        _.toast("请先完成登录/注册");
        setTimeout(function() {
          _.$router.push(
            "/winners/pullnewuser?userid=" + _.userid + "&participation=true"
          );
        }, 1500);
      }
    }
  }
};
</script>
<style scoped>
.footwearclub-page {
  font-family: Arial, Helvetica, sans-serif;
  /* padding: 13.33vw 6.7vw 0; */
  color: #232323;
  background-color: #cb231c;
  min-height: 100vh;
}
.club-cont {
  position: relative;
  overflow: hidden;
  /* padding: 20.5vw 0 2.7vw;
  background-color: #fd2b5b;
  background-image: url("https://files.eyee.com/eyeeh5/img/monitor/shoefriend_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 4px;
  background-position: top center; */
}
.club-cont > img {
  display: block;
  width: 100%;
}
.bg-gradient {
  background: -moz-linear-gradient(top, #fff 0%, #eebcba 100%);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #fff),
    color-stop(100%, #eebcba)
  );
  background: -webkit-linear-gradient(top, #fff 0%, #eebcba 100%);
  background: -o-linear-gradient(top, #fff 0%, #eebcba 100%);
  background: -ms-linear-gradient(top, #fff 0%, #eebcba 100%);
  background: linear-gradient(to bottom, #fff 0%, #eebcba 100%);
}
.club-detls {
  float: left;
  position: relative;
  width: 89.33vw;
  height: 79.2vw;
  background-color: #fff;
  border-radius: 6px;
  margin: -60vw 5.33vw 0;
  padding: 12vw 6.67vw 10.67vw;
}
.leader-pic {
  position: absolute;
  width: 70px;
  height: 70px;
  left: 50%;
  top: -35px;
  margin-left: -35px;
  border-radius: 50%;
  border: 3px solid #fff;
}
.club-detls > p.leader-name {
  color: #232323;
  font-size: 3.2vw;
  margin: 0 auto 15px;
  text-align: center;
}
.club-detls > p.club-name {
  font-size: 5.33vw;
  font-weight: bold;
  margin-bottom: 8vw;
  text-align: center;
}
.club-detls > p.club-describs {
  color: #646464;
  font-size: 3.73vw;
  line-height: 5.33vw;
  height: 10.66vw;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 0 auto 9.33vw;
}
.butn-joinclub {
  background: #cb231c;
  color: #fff;
  border-radius: 4px;
  height: 12vw;
  line-height: 12vw;
  text-align: center;
  font-weight: bold;
  font-size: 4.27vw;
  margin: 5.6vw auto 0;
}
.flesh-imgs {
  padding: 0 5.33vw;
  margin: 7.47vw auto 9.07vw;
}
.flesh-imgs img,
.bonus-imgs img {
  display: block;
  width: 100%;
}
</style>

