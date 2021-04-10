<template>
    <div class="pay_box">
        <v-header>
            <div class="nav-tab2">
                <h3>支付成功</h3>
            </div>
        </v-header>
        <div style="padding-bottom:50px;">
            <PayUnit></PayUnit>
        </div>
        
    </div>
</template>
<script>
import PayUnit from './PayUnit'
export default {
  data() {
    return {}
  },
  components: { PayUnit },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style scoped>

</style>
