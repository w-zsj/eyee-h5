<template>
  <div class="oa-team">
    <header>
      <div class="photo">
        <img v-if="localUserInfos.imageurl" :src="localUserInfos.imageurl" alt="photo">
      </div>
      <p>{{localUserInfos.username}}</p>
      <p v-if="user.level === 1">vip</p>
      <p v-else-if="user.level === 2">总监</p>
      <p v-else>主理人</p>
    </header>
    <router-link to="personallyFans" class="mode">
      <div class="left">
        <p class="num">{{user.directfanscount||0}}</p>
        <p>直招粉丝（人）</p>
      </div>
      <div class="right">本月新增:{{user.directaddcount||0}}人</div>
    </router-link>
    <router-link to="teamFans" class="mode">
      <div class="left">
        <p class="num">{{user.teamfanscount||0}}</p>
        <p>团队粉丝（人）</p>
      </div>
      <div class="right">本月新增:{{user.teamaddcount||0}}人</div>
    </router-link>
    <oa-footer></oa-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import OaFooter from '@/comps/oa/Footer'
import { fanshomepage } from '@/common/api/oa'
export default {
  data() {
    return {
      user: {},
      redirectUrl: process.env.NODE_ENV !== "production"?'//qzone.eyee.com':'//m.eyee.com'
    };
  },
  computed: {
    ...mapGetters({ localUserInfos: "userInfo" })
  },
  components: {
    OaFooter,
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
      fanshomepage()
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
  .oa-team{
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
    position: relative;
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 15px 10px;
    line-height: 30px;
    align-items: center;
    justify-content: space-between;

    &::after {
      position: absolute;
      top: 50%;
      right: 18px;
      margin-top: -4px;
      content: '';
      width: 8px;
      height: 8px;
      border-top: 1px solid #333;
      border-right: 1px solid #333; 
      transform: rotate(45deg);
    }

    .left {
      width: 120px;
      text-align: center;

      .num {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .right {
      padding-right: 20px;
    }
  }
</style>
