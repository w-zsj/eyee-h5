<template>
    <div>
         <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>违规信息</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="list" v-if="hasdata">
          <div class="flex-between orderstatus" v-for="(item,ind) in violateInfoList" :key="ind">
              <span>{{item.violatename}}</span><span>{{item.count}}</span>
          </div>
        </div>
        <div v-else class="nodata">
           暂无违规信息~
        </div>
    </div>
</template>
<script>
// violateList
import { violateList } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      violateInfoList: [],
      hasdata:1
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    violateList()
      .then(res => {
        if (res) {
          this.violateInfoList = res;
        }
        console.log("违规信息", res);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style scoped>
.list {
  border-top: 15px solid #f7f7f7;
}
.orderstatus {
  margin: 0 15px;
  height: 40px;
  line-height: 40px;
  color: #333333;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
}
.nodata{
  text-align: center;
  font-size: 14px;
  margin: 150px 0;
}
</style>


