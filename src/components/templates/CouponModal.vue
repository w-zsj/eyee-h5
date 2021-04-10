<template>
  <!-- @click.stop.prevent="UnShow" -->
  <div class :class="isShow ? 'cou-box-act' : 'couBox'" v-show="showCoupons">
    <ul class="cou_ul">
      <li
        v-for="(item, index) in realCou"
        :key="index"
        class="flex-aic"
        :class="{ isgeted: item.isgeted == 1 }"
      >
        <CouponUnit :cous="item" :couType="3"></CouponUnit>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { GetCoupon } from '../../common/api/marketing'
import CouponUnit from "./CouponUnit";
export default {
  props: {
    cous: { type: Array, default: [] },
    isShow: { type: Boolean, default: false },
  },
  components: {
    CouponUnit,
  },
  data() {
    return {
      isShowModal: false,
    };
  },
  computed: {
    realCou() {
      return this.cous;
    },
    ...mapGetters({
      showCoupons: "showCoupons",
      userInfo: "userInfo",
    }),
  },
  mounted() {
    // console.log('cous------>>>',this.cous)
  },
  methods: {
    UnShow() {
      this.$store.state.product.showCoupons = false;
    },
  },
};
</script>
<style scoped>
.couBox {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}
.cou-box-act {
  padding: 0 4vw;
}
.cou-box-act .cou_ul {
  margin: 0;
  padding: 0;
}
.cou_ul {
  /* width: 100%;
    margin: 20% auto 10%; */
  margin: 20% -7%;
  padding: 0 10%;
  max-height: 80%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.cou_ul li {
  /* width: 100%;
    height: 90px; */
  width: 100%;
  height: 27vw;
  margin-bottom: 5px;
  position: relative;
  z-index: 1000;
  overflow: hidden;
}
/*
  .cou_ul li img {
    width: 100%;
    min-height: 100%;
  } */
/* .cou_right,
  .cou_left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .cou_left {
    width: 35%;
    text-align: center;
    left: 0;
  }

  .cou_right {
    width: 65%;
    right: 0;
    color: #333;
    padding-left: 20px;
  }

  .cou_left .fac {
    font-size: 25px;
    line-height: 25px;
    height: 25px;
  }

  .cou_left .fac span {
    font-size: 18px;
  }

  .desc {
    margin: 10px auto 0;
    font-size: 12px;
    width: 80%;
    white-space: wrap;
  }

  .cou_right .desc {
    margin-left: 0;
  }


  .cou_ul li.isgeted {
    color: #666;
  }

  .getedLogo {
    position: absolute;
    display: inline-block;
    width: 40px;
    height: 22px;
    background: url(//files.eyee.com/mcdn/static/img/geted.png) no-repeat;
    background-size: contain;
    right: 20px;
    top: 3px;
    font-size: 10px;
    text-align: center;
    line-height: 22px;
    color: #fff;
  }

  .getedLogo i {
    font-style: normal;
  } */
/* @media (max-width:321px) {
    .cou_ul li {
      height: 76px;
    }
    .cou_left .fac {
      font-size: 20px;
      line-height: 20px;
      height: 20px;
    }
  } */
</style>
