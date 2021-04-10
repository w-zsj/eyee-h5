<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div
      class="load-modal"
      :class="{act:$root.showLoadModal}"
      @click="$root.showLoadModal=!$root.showLoadModal"
    >
      <div>
        <img v-lazy="'https://files.eyee.com/activity/redpacket/share_guide.png'" alt />
        <p>1. 点击右上角【···】</p>
        <p>2. 选择【在浏览器打开】</p>
      </div>
    </div>
  </div>
</template>
<script>
// const doc = window.document
// const evt = doc.createEvent('Event')
// evt.initEvent('touchmove', true, true)
// var reporting = false
import { mapGetters } from "vuex";
import { TabBar } from "./utils/enum";
import { getUrlParam } from "./common/util";

import { LoginAuto } from "./common/api/user";

const wss = window.sessionStorage;
const TabSSKEY = "MEMBER_FIRST_TAB";

export default {
  name: "app",
  computed: {
    ...mapGetters({
      // baseValue: "baseValue",
      user: "userInfo",
      baseReq: "baseReq"
    })
  },
  beforeCreate() {
    let _ = this,
      {
        $root: { ISMP }
      } = _,
      queryParam = getUrlParam("param");
    console.log(queryParam, 'queryParam--->')
    // _.$store.dispatch("setBaseValue");

    // APP进入时先清空登录态再重新通过链接参数自动登录, 防止更换账号未同步更换
    if (ENV.ua.eyee || ENV.ua.mini) {
      // 链接参数登录处理
      if (queryParam) {
        try {
          let param = JSON.parse(decodeURIComponent(queryParam)),
            user = _.user || {};
          console.log("query params: ", param);

          window.$DONEW.env = {
            os: param.os,
            version: param.version,
            deviceid: param.deviceid
          };

          if (param.version >= "3.6.3" && ENV.ua.eyee) {
            let { env } = $DONEW;
            _.$root.loging = new Promise((resolve, reject) => {
              _.$store.dispatch("setUserInfo", {});
              // let $timeout;
              _JSB(
                {
                  name: "callAppAuth",
                  params: {}
                },
                function(res) {
                  console.log("--> callAppAuth: ", res);
                  // $timeout && clearTimeout($timeout);
                  window.$DONEW.env = { ...env, ...res };
                  let { version, os, deviceid, token } = res || {};
                  if (token) {
                    LoginAuto({ token })
                      .then(res => {
                        _.$store.dispatch("setUserInfo", res);
                        resolve(res);
                      })
                      .catch(e => {
                        console.error("链接参数自动登录异常: ", e);
                        resolve();
                        // 认证令牌冲突 已在其他地方登陆
                        _.$store.dispatch("setUserInfo", {});
                      });
                  } else {
                    _.$store.dispatch("setUserInfo", {});
                    resolve();
                  }
                }
              );
              // $timeout = setTimeout(() => {
              //   reject("timeout 8s");
              // }, 8000);
            });
          } else if (
            param.token &&
            (!user.token || user.token != param.token || ENV.ua.mini)
          ) {
            _.$store.dispatch("setUserInfo", {});
            _.$root.loging = new Promise((resolve, reject) => {
              LoginAuto(param)
                .then(res => {
                  _.$store.dispatch("setUserInfo", res);
                  resolve(res);
                })
                .catch(e => {
                  console.error("链接参数自动登录异常: ", e);
                  reject(e);
                });
            });
          } else if (!param.token) _.$store.dispatch("setUserInfo", {});
        } catch (e) {
          console.error("deal url query param error: ", e);
        }
      } else if (ENV.ua.eyee) {
        // IOS 未登录 处理
        _JSB(
          {
            name: "callAppAuth",
            params: {}
          },
          function(res) {
            console.log("--> IOS 未登录: ", res);
            if ((res && !res.token) || !res)
              _.$store.dispatch("setUserInfo", {});
          }
        );
      }
    }
  },
  created() {
    let _ = this,
      { user, baseReq } = _;

    baseReq
      .then(val => {
        _.$store.dispatch("setBaseValue", val);

        if (val && val.configs) {
          let { targettabindex } = val.configs || {};
          let tabed = wss.getItem(TabSSKEY);
          if (!tabed) {
            wss.setItem(TabSSKEY, "1");
            if (!isNaN(targettabindex)) {
              let path = "";
              switch (Number(targettabindex)) {
                case TabBar.user:
                  path = "/user/home";
                  break;
              }
              path && this.$router.replace(path);
            }
          }
        }
      })
      .catch(e => {
        console.error("getting base error: ", e);
      });
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     let launching = window.document.querySelector("i.launching");
  //     if (launching) launching.remove();
  //   });
  // },
  // updated() {
  //   if (!reporting) {
  //     reporting = true
  //     this.$nextTick(() => {
  //       reporting = false
  //       console.log('%cupdated nextTick', 'color:red;font-size:20px;')
  //     })
  //   }
  // },
  watch: {
    $route(to, from) {
      let _ = this,
        { user } = _,
        { meta, path } = to;
      _.setToolBar({
        title: meta.title || "斗牛，Let’s DoNew！",
        bgcolor: meta.bgcolor || "#191919",
        textcolor: meta.textcolor || "#FFFFFF",
        showshoppingcarticon: !!meta.showshoppingcarticon,
        disbounce: !!meta.disbounce
      });
      // 默认隐藏分享按钮
      if (ENV.ua.eyee)
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            hideshareicon: true
          }
        });

      _.initShare();
      // console.log("%cwatch $route", "color:yellowgreen;font-size:18px;");
      _.$nextTick(() => {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
        // doc.querySelector('body').dispatchEvent(evt)
      });
    }
    // baseValue(val, old) {
    //   if (val && val.configs) {
    //     console.log('zzzzzzzzzzz',val.configs)
    //     let tabed = wss.getItem(TabSSKEY);
    //     if (!tabed) {
    //       wss.setItem(TabSSKEY, "1");
    //       let { targettabindex } = val.configs;
    //       if (!isNaN(targettabindex)) {
    //         let path = "";
    //         switch (Number(targettabindex)) {
    //           case TabBar.user:
    //             path = "/user/home";
    //             break;
    //         }
    //         path && this.$router.replace(path);
    //       }
    //     }
    //   }
    // }
  }
};
</script>
<!--<style src='mint-ui/lib/style.css'></style>-->
<style src='./assets/css/app.css'></style>
<style src='./assets/css/reset-ui.css'></style>
<!--<style src='./assets/css/page-group.css'></style>-->
<!--<style lang="scss" src='./assets/css/page-group.scss'></style>-->
