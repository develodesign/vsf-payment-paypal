<template>
  <div id="custom">
    <payment-paypal/>
  </div>
</template>

<script>
import PaymentPaypal from '../components/PaymentPaypal'

export default {
  name: 'CustomExample',
  data () {
    return {
      'exampleData': 'Data from base component'
    }
  },
  components: {
    PaymentPaypal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
