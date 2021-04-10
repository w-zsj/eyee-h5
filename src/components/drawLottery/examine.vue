<template>
  <div>
    <v-header v-if="!insq&&!$root.ISAPP">
      <div class="nav-tab2">
        <h3>抽奖规则</h3>
      </div>
      <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
    </v-header>
    <div v-html="richtext" class="richtext"></div>
  </div>
</template>

<script>
import { getUrlParam } from "../../common/util";
import { Rule } from "../../common/api/lotter.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawid: "",
      richtext: " "
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    window.document.title = "抽奖规则";
    let _ = this;
    _.drawid = getUrlParam("id");
    console.log("this.drawid", _.drawid);
    Rule({ id: _.drawid })
      .then(res => {
        if (res.rule) {
          _.richtext = res.rule;
          // _.richtext  =_.richtext.replace(/<p/g,'<p style="text-indent: -20px;"')
        }
      })
      .catch(e => {
        console.error(e);
      });
  },
  methods: {}
};
</script>
<style scoped>
.richtext {
  padding: 5px 15px 0;
  font-size: 12px;
}
</style>


