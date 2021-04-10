<template>
  <div class="group-comment ">
    <dl>
      <dd class="colonel" >
        <div v-if="orderStatus!=0 && orderStatus!=4"><img :src="headImgUrl" alt=""></div>
        <div v-else>?</div>
      </dd>
      <dd v-for="(url,index) in realJoins" :key="index" v-if="realJoins.length>0">
        <div><img :src="url.headimgurl" alt=""></div>
      </dd>
      <dd v-if="remainingCount>0" v-for="(person, ind) in remainingCount"  >
        <div>?</div>
      </dd>
      </dl>
  </div>
</template>
<script>
export default {
  props: {
    joins: Array,
    remainingCount: Number || String,
    headImgUrl: String,
    orderStatus: Number,
    teamlimitcount: Number
  },
  computed: {
    realJoins() {
      let join = [];
      if (this.joins && this.joins.length > 0) {
        this.joins.forEach(n => {
          if (n.validuser === 0) {
            join.push(n)
          } else {
            if (n.order.hasOwnProperty("payedat")) {
              join.push(n)
            }
          }
        })
      }
      // 判断超团的情况
      if (join.length > this.teamlimitcount - 1) {
        join = join.slice(0, this.teamlimitcount - 1)
      }
      return join
    }
  }
};
</script>
<style scoped>
.group-comment dl {
  text-align: center;
  font-size: 0;
}
.group-comment dl dd {
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 15px;
  border: 1px dotted #ffc700;
}
.group-comment dl dd.colonel {
  position: relative;
}
.group-comment dl dd.colonel:before {
  width: 30px;
  height: 14px;
  line-height: 14px;
  border-radius: 7px;
  text-align: center;
  color: #333333;
  content: "团长";
  position: absolute;
  background: #ffc700;
  font-size: 8px;
  bottom: -5px;
  left: 2px;
  transform: scale(0.8);
}
/* .group-comment.gray dl dd {
  border: 1px solid #ccc;
}
.group-comment dl dd.grayYuan {
  border: 1px solid #ccc;
}
.group-comment.gray dl dd.colonel:before {
  color: #333;
  background: #ccc;
} */
.group-comment dl dd img {
  display: block;
  width: 100%;
  height: 100%;
}
.group-comment dl dd > div {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  text-align: center;
  width: 100%;
  height: 100%;
  float: left;
  overflow: hidden;
  border-radius: 50%;
  /* background-size: cover; */
}
</style>


