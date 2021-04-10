<template>
  <div class="oa-fiance">
    <header>
      <span @click="loginOut()" class="exit">退出登录</span>
      <div class="photo">
        <img v-if="localUserInfos.imageurl" :src="localUserInfos.imageurl" alt="photo">
      </div>
      <p>{{localUserInfos.username}}</p>
      <p v-if="user.level === 1">vip</p>
      <p v-else-if="user.level === 2">总监</p>
      <p v-else>主理人</p>
    </header>
    <div class="mode">
      <div class="title"><span>我的钱包</span></div>
      <ul class="content">
        <li>
          <p class="num">{{user.amount||0}}</p>
          <p>可提取金额</p>
        </li>
        <li>
          <p class="btn" @click="pickUp=true,price=''">立即提取</p>
          <router-link to="billList" class="btn">查看账单</router-link>
        </li>
      </ul>
    </div>
    <div v-if="pickUp" class="dialog" @touchmove.prevent>
      <div class="form">
        <p>钱包余额： {{user.amount||0}}</p>
        <p><input type="number" @blur="priceBlur" v-model="price" placeholder="输入你要提取的金额"/></p>
        <div class="footer">
          <span class="btn" @click="cancel">取消</span>
          <span class="btn" @click="comfirm">确认提取</span>
        </div>
      </div>
    </div>
    <oa-footer></oa-footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import OaFooter from "@/comps/oa/Footer"
import { financeinfo, withdraw } from '@/common/api/oa'
export default {
  data() {
    return {
      user: {},
      pickUp: false,
      price: '',
      query: {
        amount: '',
        type: 2
      },
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    };
  },
  watch:{
    'price':function (newVal,oldVal) {
      if(newVal.toString().includes('-')) {
        this.price = Number(newVal.toString().replace(/\-/g,''));
      }
      if(newVal==='' && oldVal.toString().indexOf('.')>0){
        this.price = oldVal;
        return
      }
      if(newVal){
        newVal = newVal.toString();
        var pointIndex =  newVal.indexOf('.');
        if(pointIndex>0 && (newVal.length - pointIndex)>3){
          this.price = oldVal;
          return
        }
      }
    }
  },
  components: {
    OaFooter,
  },
  computed: {
    ...mapGetters({ localUserInfos: "userInfo" })
  },
  beforeMount() {
    let _ = this
    let { load } = _
    load()
  },
  methods: {
    load() {
      let _ = this
      let { toast, redirectUrl } = _
      financeinfo()
        .then(res => {
          _.user = res
        })
        .catch(e => {
          toast(e.msg)
          location.href = redirectUrl
        })
    },
    priceBlur() {
      let _ = this
      _.pickUp = false
      _.resetScroll()
    },
    comfirm() {
      let _ = this
      let { query, price, toast, load } = _
      if (!price) {
        toast('请输入提取金额')
        return
      }
      if(price*1 === 0 || price*1 > _.user.amount*1){
        toast('提取金额大于0并且小于钱包余额')
        _.resetScroll()
        return
      }
      _.query.amount = price
      withdraw(query)
        .then(res => {
          toast('提现成功')
          _.pickUp = false
          load()
        })
        .catch(e => {
          toast('加载失败')
          _.pickUp = false
        })
      
    },
    cancel() {
      let _ = this
      _.pickUp = false
    },
    loginOut() {
      let _ = this
      let option = {
        msg: "确定退出当前用户吗 ?",
        okText: "确定",
        ok: () => {
          _.logOut();
        }
      };
      _.confirm(option);
    },
    logOut() {
      let _ = this
      _.$store.dispatch("setUserInfo", {})
      _.$router.push("/")
    },
    resetScroll() {
      let scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      window.scrollTo(0, scrollTop)
    },
  }
}
</script>
<style lang="scss" scoped>
  .oa-fiance{
    padding-bottom: 60px;
    font-size: 13px;
  }
  header {
    position: relative;
    border-bottom: 1px solid #eee;
    padding: 10px;
    text-align: center;
    line-height: 30px;

    .photo{
      width: 46px;
      height: 46px;
      background: url(http://files.eyee.com//user/defaultUserIcon.png) no-repeat;
      background-size: contain;
      margin: 10px auto;
      border-radius: 100%;
      overflow: hidden;
    }
    .exit {
      position: absolute;
      top: 10px;
      right: 15px;
      padding-left: 24px;

      &::after {
        position: absolute;
        top: 5px;
        left: 0;
        content: '';
        width: 20px;
        height: 20px;
        background: url("/static/img/exp.png") 0 0 no-repeat;
        background-size: contain;
      }
    }
  }
  .mode {
    border-bottom: 1px solid #eee;
    padding: 15px 10px 24px;

    .title {
      position: relative;
      margin-bottom: 18px;
      line-height: 30px;

      &::before {
        content: '';
        position: absolute;
        top: 15px;
        right: 20px;
        left: 20px;
        height: 1px;
        background-color: #eee;
      }
      span {
        position: relative;
        z-index: 1;
        display: block;
        margin: 0 auto;
        width: 100px;
        background-color: #fff;
        text-align: center;
      }
    }
    .content{
      display: flex;
      align-items: center;
      line-height: 30px;
      padding: 0 30px;
      p {
          margin: 5px 0;
        }
      li:first-child {
        flex: 1;
      }
      .num {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .btn {
    display: block;
    width: 90px;
    text-align: center;
    border: 1px solid #999;
    border-radius: 5px;
  }
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .form {
      padding: 20px;
      text-align: center;
      background-color: #fff;
      line-height: 30px;

      input {
        border: 1px solid #eee;
        width: 100%;
        line-height: 30px;
        margin: 20px 0;
      }
      .footer{
        display: flex;
        
        span:first-child{
          margin-right: 10px;
        }
      }
    }
  }
</style>
