<template>
  <span class="" ref="secondaryCharacteristics" style="color: #333;">
    <div
      v-for="(char, index) in secondary"
      :key="char + index"
      :ref="'char' + index"
      class="div-char"
      style="margin-bottom: 2px;"
    >
      <span>{{ char }}</span>
    </div>

  </span>
</template>

<script>

export default {
  name: "VNewSecondaryCharacteristics",
  data() {
    return {

    }
  },
  created() {
    this.secondary = [...this.product.secondaryCharacteristics]
    //this.secondary.sort()
  },
  mounted() {


  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {

  },
};
</script>
