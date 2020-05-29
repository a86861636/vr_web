<template>
  <div class="hello">
    <c-header></c-header>
  </div>
</template>

<script>
import header from '@/components/header'
export default {
  name: 'HelloWorld',
  components: {
    'c-header': header
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
