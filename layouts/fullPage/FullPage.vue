<template>
  <div class="app-content content">
    <div class="content-wrapper">
      <div class="content-body">
        <meu-fornecedor-card>
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </meu-fornecedor-card>
      </div>
    </div>
  </div>
</template>

<script>
import MeuFornecedorCard from "./components/MeuFornecedorCard";

export default {
  name: "FullPage",
  data() {
    return {
      // Essas classes fazem o layout ter o corpo do contéudo preenchido
      // elas afetam o body.
      classes: [
        "vertical-layout",
        "vertical-menu-modern",
        "1-column",
        "navbar-floating",
        "footer-static",
        "bg-full-screen-image",
        "menu-collapsed",
        "blank-page"
      ]
    };
  },
  mounted() {
    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.add(this.classes[i]);
    }

    // Adiciona atributos do template do MF pra tag body
    document.body.setAttribute("data-menu", "vertical-menu-modern");
    document.body.setAttribute("data-col", "1-columns");
    document.body.style.overflow = "auto";
  },
  beforeDestroy() {
    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.remove(this.classes[i]);
    }

    document.body.setAttribute("data-menu", "");
    document.body.setAttribute("data-col", "");
  },
  components: {
    MeuFornecedorCard
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
