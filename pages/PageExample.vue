<template>
  <div id="custom">
    <paypal-button/>
  </div>
</template>

<script>
import PaypalButton from '../components/PaymentPaypal'

export default {
  name: 'CustomExample',
  data () {
    return {
      'exampleData': 'Data from base component'
    }
  },
  components: {
    PaypalButton
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
