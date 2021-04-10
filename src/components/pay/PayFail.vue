<template>
    <div class="pay_box">
        <v-header>
            <div class="nav-tab2">
                <h3>支付失败</h3>
            </div>
        </v-header>
        <PayUnit :payStatus="0"></PayUnit>
    </div>
</template>
<script>
    import PayUnit from './PayUnit'
export default {
      data() {
        return {
    
        }
      },
      components: { PayUnit },
      computed: {
    
      },
      mounted() {
    
      },
      methods: {
    
      }
    }
</script>