<template>
  <b-modal id="browser-warning-modal" hide-footer hide-header>
    <div class="warning-icon-circle">
      <div class="warning-icon">!</div>
    </div>
    <div class="d-block text-center mt-2">
      <h2>Navegador incompatível</h2>
      <br>
      <p>
        A plataforma ainda não funciona com o <b>Safari Desktop</b>.
        <br>
        Estamos cuidando disso!
        <br>
        Recomendamos o acesso pelo Google Chrome.
      </p>
      <b-button variant="primary" class="mt-2"  @click="$bvModal.hide('browser-warning-modal')">Ok</b-button>
    </div>
  </b-modal>
</template>

<style scoped>

  .warning-icon-circle {
    margin: 0 auto;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    border: 3px solid #f8bb86;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .warning-icon {
    color: #f8bb86;
    font-size: 34px;
    font-weight: bold;
  }
</style>

<script>
export default {
  name: "BrowserCompatibilityWarning",
  mounted() {
    if(this.$browserDetect.isSafari){
      this.$bvModal.show("browser-warning-modal")	
    }
  },
  methods: {
  },
};
</script>
