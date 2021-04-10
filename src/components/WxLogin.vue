<template>
    <div class="login_wx" :style="{height: deviceHei + 'px',backgroundImage: 'url('+https( baseRegImg) +')'}">
        <div v-if="showBind" class="bind_pannel">
            <p class="head_img">
                <img :src="bindeHeadImg" alt="">
                <span>完善个人信息可以<br>让购物变得更加轻松安全哦</span>
            </p>
            <span class="close" @click.stop = "gotoLogin"></span>
            <form class="log_reg">
                <label>
                    <span class="icon_setPhone"></span>
                    <span class="country_code" @click="goToCountry()">{{currentCode}}<em></em></span><input type="number" placeholder="请输入手机号码" v-model="bindUser.mobile">
                </label>
                <label>
                    <span class="icon_setMsg"></span>
                    <input type="number" placeholder="请输入验证码" v-model="bindUser.validcode">
                    <span class="iden_btn" @click="getValiCode()">{{bindValiWords}}</span>
                </label>
                <p class="tips_pan">由于系统升级，如果您的手机号已注册过无法绑定，请联系在线客服为您处理</p>
                <p class="confirm_btn" @click="bindCellphone()">确定</p>
            </form>
        </div>
    </div>
</template>
<script>
    import { MD5, Checking } from '../common/util'
    import { weixinApp } from '../common/api/oauthAPI'
import { mapGetters } from 'vuex'
    import * as api from '../common/api/user'
    export default {
      data() {
        return {
          showBind: true,
          bindValiWords: '获取验证码',
          bindUser: {},
          currentCode: '',
          bindeHeadImg: '//files.eyee.com/mcdn/static/img/boy.png' // require('../assets/img/boy.png')
        }
      },
      computed: {
        ...mapGetters({ baseValue: 'baseValue', selectCountryCode: 'selectCountryCode' }),
        deviceHei() {
          return document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight
        },
        baseRegImg() {
          let bv = this.baseValue
          return (bv.configs && bv.configs.registerbgimg) || ''
        }
      },
      mounted() {
        if (window.location.href.indexOf('code') > 0) {

        } else {
          var path = window.location.origin + window.location.pathname
          var link = weixinApp.get_authorize_base_link(path, 'weixinJ')
          window.location = link
        }
        this.currentCode = this.selectCountryCode
        this.wx_code()
      },
      methods: {
        wx_code() { // 微信静默登录返回uid
          if (window.location.href.indexOf('code') > 0) {
            var weixincode = window.location.href.split('code=')[1].split('&state')[0]
            // alert('code'+weixincode)
            api.WXRegisterAuth({
              WXCode: weixincode
            }).then((res) => {
              // alert('server'+JSON.stringify(res))
              if (res.unionid) {
                sessionStorage.setItem('uid', res.unionid)
                this.loginWX(res.unionid)
              }
            }).catch((err) => {
              // this.toast('微信登录失败')
              // alert('request'+JSON.stringify(err))
              console.log(err)
            })
          }
        },
        loginWX(id) {
          // this.toast('微信登录中')
          api.LoginOpen({
            Id: id,
            RegisterType: 0
          }).then((res) => {
            // alert(res.uid)
            if (res.uid) {
              this.$store.dispatch('setUserInfo', res)
              // localStorage.setItem('currentUser', JSON.stringify(res))
              // this.$router.push('/');
              // this.toast('登录成功');
              if (history.length < 3) {
                // this.toast('登录成功'+history.length);
                this.$router.push('/')
              } else {
                // this.toast('微信登录成功'+history.length);
                this.$router.go(-2)
              }
            }
          }).catch((err) => {
            this.showBind = true
            // alert(JSON.stringify(err));
            // if(err && err.code == 1511543){
            //     // alert('weidenglu')
            //     this.showBind = true
            // }
          })
        },
        goToCountry() {
          this.$router.push('country')
        },
        decpadleft(val) {
          if (val < 10) return '0' + val
          else return val
        },
        getValiCode() { // 验证码登录
          // 验证手机号
          if (this.currentCode == '+86' && !Checking(this.bindUser.mobile, 'phone')) {
            this.toast('请输入合法的手机号码')
            return false
          }
          var option = {
            'checktype': 1,
            'mobile': this.currentCode + '-' + this.bindUser.mobile
          }
          console.log(option)
          api.SendCaptcha(option).then(res => {              // 发送验证码
            if (!res) {
              console.log(res)
              var time_secs = 60
              var tips_word = ''
              this.toast('发送成功')
              this.timeRun = setInterval(() => {
                if (time_secs > 1) {
                  time_secs--
                  tips_word = '已发送' + this.decpadleft(time_secs) + 's'
                  this.bindValiWords = tips_word
                } else {
                  this.bindValiWords = '再次发送'
                  clearInterval(this.timeRun)
                  this.timeRun = null
                }
              }, 1000)
            }
          }).catch(e => {
            if (e && e.code == 1511531) {
              this.toast('验证码发送频繁,请60s之后再试')
            } else if (e && e.code == 1511543) {
              this.toast('未注册号码')
            } else if (e && e.code == 1511544) {
              this.toast('账号已被注册')
            }
          })
        },
        bindCellphone() { // 第三方注册 绑定手机号
          if (this.currentCode == '+86' && !Checking(this.bindUser.mobile, 'phone')) {
            this.toast('请输入合法的手机号码')
            return false
          }
          if (Checking(this.bindUser.validcode, 'validcode')) {
            this.toast(Checking(this.bindUser.validcode, 'validcode'))
            return false
          }
          let option = {
            Id: sessionStorage.getItem('uid'),
            Mobile: this.currentCode + '-' + this.bindUser.mobile,
            RegisterType: 0,
            RegisterTypeCode: 0,
            ValidCode: this.bindUser.validcode
          }
          // alert(JSON.stringify(option))
          api.RegisterOpen(option).then(res => {
            // console.log('Register', res)
            // alert(JSON.stringify(res))
            if (res) {
              this.toast('注册成功')
              this.$store.dispatch('setUserInfo', res)
              // localStorage.setItem('currentUser', JSON.stringify(res))
              this.$router.push('/')
              // if (!res.isbindhobby) {
              //     //跳转绑定兴趣页面
              //     this.$router.replace('/addUserInfo');
              //     return false;
              // }
            }
          }).catch(e => {
            // alert(JSON.stringify(e))
            if (e && e.code == 1511533) {
              this.toast('请输入正确的验证码')
            } else if (e && e.code == 1511532) {
              this.toast('请发送验证码')
            } else {
              this.toast(e.msg)
            }
          })
        },
        gotoLogin() {
          this.$router.replace('/login')
        }
      }
    }
</script>
<style scoped>
    .bind_pannel{
        position: fixed;
        width: 90%;
        padding: 15px;
        left: 50%;
        top: 50%;
        margin:-25% 0 0 -45%;
        border-radius: 4px;
        z-index: 1;
        background: #fff;
    }
    .bind_pannel .close{
        display: inline-block;
        width: 28px;
        height: 28px;
        position: absolute;
        right: 5px;
        top: 5px;
    }
    .bind_pannel .close:before{
        display: block;
        width: 28px;
        height: 28px;
        line-height: 27px;
        border-radius: 50%;
        border: 1px solid #999;
        text-align: center;
        font-size: 30px;
        content: "\2717";
        color: #999;
    }
    form.log_reg label{
        position: relative;
        display: block;
        height: 40px;
        line-height: 40px;
        margin-bottom: 5px;
        border-bottom: 1px solid #f1f1f1;
    }
    form.log_reg label>span.country_code{
        display: inline-block;
        float: left;
        position: relative;
        margin-right: 8px;
    }
    form.log_reg label>span.country_code:after{
        content: '';
        position: absolute;
        width: 1px;
        height: 15px;
        right: -4px;
        top: 12px;
        background: #f3f3f3;
    }
    form.log_reg label>span.country_code>em{
        display: inline-block;
        margin-left: 8px;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 8px solid #555;
    }
    .bind_pannel .head_img{
        position: relative;
        text-align: center;
    }
    .bind_pannel .head_img>img{
        display: block;
        width: 90px;
        height: 90px;
        margin: 0 auto;
        margin-top: -50px;
        border-radius: 45px;
        border:4px solid #fff;
    }
    .bind_pannel .head_img>span{
        display: inline-block;
        margin: 5px 0 15px;
        width: 50%;
        font-size: 11px;
        color: #e6b40d;
    }
    .bind_pannel .tips_pan{
        text-align: left;
        color: #e6b40d;
        margin-bottom: 20px;
    }
    .bind_pannel .icon_setPhone{
        float: left;
        margin-top: 10px;
    }
    .bind_pannel .icon_setMsg{
        vertical-align: middle;
    }
    .iden_btn{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        display: inline-block;
    }
    .iden_btn,.confirm_btn{
        text-align: center;
        font-size: 13px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        border-radius: 4px;
        background: #333;
    }
    .tips_pan{
        text-align: center;
        font-size: 11px;
        color: #888;
        margin: 10px 0;
    }
</style>
