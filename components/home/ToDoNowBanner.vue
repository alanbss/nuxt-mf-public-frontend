<template>
  <div class="to-do-size">
    <vs-divider v-show="mobileBrowser" />
    <h3>O que fazer agora?</h3>
    <h6>Escolha como prefere simplificar suas compras</h6>
    <div>
      <div
        class="p-2"
        :class="this.mobileBrowser ? 'cotar-button-mobile' : 'cotar-button-desktop' "
      >
        <img src="@/assets/images/cmassa1.png" height="80px" alt />
        <div style="padding-left: 15px;">
          <h4>Cotar</h4>
          <span>Veja o preço de vários fornecedores</span>
          <button class="btn btn-outline-primary">
            <a href="/cotar-em-massa">Montar nova cotação</a>
          </button>
        </div>
      </div>
      <div
        class="p-2"
        :class="this.mobileBrowser ? 'direta-button-mobile' : 'direta-button-desktop'"
      >
        <img src="@/assets/images/loja1.png" height="80px" alt />
        <div style="padding-left: 15px;">
          <h4>Pedir direto</h4>
          <span>Pedir direto na loja virtual do fornecedor</span>
          <button class="btn btn-outline-primary">
            <a href="/fornecedores">Escolher fornecedor</a>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mobileBrowser: false,
    };
  },
  created() {
    this.isMobile();
  },
  methods: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
};
</script>

<style>
.cotar-button-mobile {
  background: linear-gradient(
    90deg,
    rgb(12, 182, 149) 33%,
    rgb(92, 233, 198) 66%
  );
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 20px;
  width: -webkit-fill-available;
}
.cotar-button-desktop {
  background: linear-gradient(
    90deg,
    rgb(12, 182, 149) 33%,
    rgb(92, 233, 198) 66%
  );
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 20px;
}
.direta-button-mobile {
  background: linear-gradient(
    90deg,
    rgb(245, 127, 23) 33%,
    rgb(255, 176, 76) 66%
  );
  display: flex;
  align-items: center;
  border-radius: 10px;
  width: -webkit-fill-available;
}
.direta-button-desktop {
  background: linear-gradient(
    90deg,
    rgb(245, 127, 23) 33%,
    rgb(255, 176, 76) 66%
  );
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 10px;
}
.to-do-size {
  width: 50vh;
}
</style>