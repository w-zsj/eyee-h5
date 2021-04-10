<template>
    <div>
        <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>卖家须知</h3>
            </div>
        </v-header>
        <div>试试</div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  }
};
</script>
<style scoped>
</style>

