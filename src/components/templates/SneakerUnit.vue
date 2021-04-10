<template>
    <div class="commodit flex">
        <div class="commodit-item flex-center flex-col"  @click="goDetail(sneakInfo.productid)">
            <img :src="sneakInfo.productimgurl" alt="">
            <span class="commodit-item-name font-price">{{sneakInfo.productname}}</span>
            <span class="commodit-item-price font-price">{{sneakInfo.productprice&&sneakInfo.productprice.toFixed(2)||'¥ — —'}}</span>
        </div>
    </div>
</template>
<script>
    export default {
      props: {
        SneakType: { type: Number, default: 0 },
        sneakItem: { type: Object },
        sneakerCaty: '',
        hotIndex: { type: Number }
      },
      methods: {
        goDetail(id) {
            this.$router.push("/sneaker/detail/" + id);
        }
      },
      computed: {
        sneakInfo() {
          return this.sneakItem
        },
        sneakerNum() {
          return this.sneakerCaty
        }
      }
    }

</script>
<style lang="scss" scoped>
.commodit {
  flex-wrap: wrap;
  padding: 4.207vw 2.6667vw;
  justify-content: space-between;
  width: 50%;
  .commodit-item {
    width: 47.2vw;
    position: relative;
    color: #333;
    img {
      width: 37.8667vw;
    }
    .commodit-item-name {
      margin-top: 1.8667vw;
      font-size: 13px;
      font-family: BASE_PRICE;
      font-weight: 800;
      width: 38.1333vw;
      height: 8.5333vw;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .commodit-item-price {
      color: #999;
      margin-top: 2.1333vw;
    }
    .sub {
      width: 20px;
      height: 26px;
      background-size: 100% 100%;
      position: absolute;
      top: 1.3333vw;
      left: 1.3333vw;
      span {
        position: relative;
        top: 5px;
        font-size: 14px;
      }
    }
    .sub-y {
      background-image: url("/static/img/sneaker/hot_brand.png");
    }
    .sub-g {
      background-image: url("/static/img/sneaker/hot_brand_three.png");
      color: #fff;
    }
  }
}
</style>
