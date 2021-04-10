<template>
  <div style="background-color:#131313;">
    <v-headerscopy :showback='true' :bg='dark'>
      <div class="nav-tab2" style="color: #fff">工商执照</div>
    </v-headerscopy>
    <div style="padding:20px;">
      <p style="margin-bottom:20px;font-size:14px; color:#fff;">斗牛经营者营业执照信息：</p>
      <p style="margin-bottom:20px;font-size:12px;color:#969696;">注：以下营业执照信息来源于卖家自行申报，具体以工商部门登记为准。经营者需确保信息真实有效，平台也将定期核查。</p>
      <img v-lazy="url" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  beforeMount() {
    this.url = this.$route.params.url
    console.log('License url', this.url)
    if (!this.url) this.$router.back()
  }
}
</script>

