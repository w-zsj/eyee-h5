<template>
  <div class="oa-home">
    <header>
      <div class="photo">
        <img v-if="localUserInfos.imageurl" :src="localUserInfos.imageurl" alt="photo">
      </div>
      <p>{{localUserInfos.username}}</p>
      <p v-if="user.level === 1">vip</p>
      <p v-else-if="user.level === 2">总监</p>
      <p v-else>主理人</p>
    </header>
    <div class="mode">
      <div class="title"><span>我的管理收入</span></div>
      <ul class="content">
        <li>
          <p class="num">{{user.dayexceptedincome||0}}</p>
          <p>今日</p>
          <p>预估管理收入</p>
        </li>
        <li>
          <p class="num">{{user.monthexceptedincome||0}}</p>
          <p>本月</p>
          <p>预估管理收入</p>
        </li>
        <li>
          <p class="num">{{user.totalexceptedincome||0}}</p>
          <p>历史</p>
          <p>累计管理收入</p>
        </li>
      </ul>
    </div>
    <div class="mode">
      <div class="title"><span>核心数据</span></div>
      <ul class="content">
        <li>
          <p class="num">{{user.dayteamincome||0}}</p>
          <p>今日团队</p>
          <p>预估佣金总额</p>
        </li>
        <li>
          <p class="num">{{user.monthteamincome||0}}</p>
          <p>本月团队</p>
          <p>预估佣金总额</p>
        </li>
        <li>
          <p class="num">{{user.lastmonthteamincome||0}}</p>
          <p>上月团队已</p>
          <p>结算佣金总额</p>
        </li>
        <li>
          <p class="num">{{user.monthtrainincome||0}}</p>
          <p>本月新增</p>
          <p>培训津贴</p>
        </li>
        <li>
          <p class="num">{{user.totaltrainincome||0}}</p>
          <p>历史累计</p>
          <p>培训津贴</p>
        </li>
        <li>
          <p class="num">{{user.lastmonthteamincomeavg||0}}</p>
          <p>上月团队</p>
          <p>平均收入</p>
        </li>
      </ul>
    </div>
    <div class="mode">
      <div class="title"><span>增长数据</span></div>
      <ul class="content">
        <li>
          <p class="num">{{user.dayaddvip||0}}</p>
          <p>今日新增</p>
          <p>潮牌合伙人</p>
        </li>
        <li>
          <p class="num">{{user.monthaddvip||0}}</p>
          <p>本月新增</p>
          <p>潮牌合伙人</p>
        </li>
        <li>
          <p class="num">{{user.totaladdvip||0}}</p>
          <p>历史累计</p>
          <p>有效潮牌合伙人</p>
        </li>
        <li>
          <p class="num">{{user.dayaddvalidvip||0}}</p>
          <p>今日新增</p>
          <p>有效合伙人</p>
        </li>
        <li>
          <p class="num">{{user.monthaddvalidvip||0}}</p>
          <p>本月新增</p>
          <p>有效合伙人</p>
        </li>
        <li>
          <p class="num">{{user.totaladdvalidvip||0}}</p>
          <p>历史累计</p>
          <p>有效合伙人</p>
        </li>
      </ul>
    </div>
    <oa-footer></oa-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import OaFooter from '@/comps/oa/Footer'
import { oahome } from '@/common/api/oa'
export default {
  data() {
    return {
      user: {},
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    };
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
      oahome()
        .then(res => {
          _.user = res
        })
        .catch(e => {
          toast(e.msg)
          location.href = redirectUrl
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .oa-home{
    padding-bottom: 60px;
    font-size: 13px;
  }
  header {
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
  }
  .mode {
    border-bottom: 1px solid #eee;
    padding: 15px 10px 4px;

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
      line-height: 26px;
      overflow: hidden;
      
      li {
        float: left;
        width: 33.3%;
        padding-bottom: 20px;
        text-align: center;
      }
      .num {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>
