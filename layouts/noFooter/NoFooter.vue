<template>
  <div>
    <div v-on-clickaway="away">
      <v-navbar />
      <v-sidebar />
    </div>

    <div class="app-content content">
      <div class="header-navbar-shadow"></div>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <div class="sidenav-overlay d-none" style="touch-action: pan-y; user-select: none;"></div>
  </div>
</template>

<script>
import VNavbar from "../main/components/VNavbar";
import VSidebar from "../main/components/VSidebar";
import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "Main",
  data() {
    return {
      // Essas classes fazem o layout ter o corpo do contéudo preenchido
      // elas afetam o body.
      classes: [
        "vertical-layout",
        "2-columns",
        "navbar-sticky",
        "footer-static",
        "vertical-overlay-menu",
        "pace-done",
        "menu-hide"
      ]
    };
  },
  created() {
    if (process.env.NODE_ENV && process.env.NODE_ENV != 'development' && location.protocol !== 'https:') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`)
    }
  },
  mounted() {
    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.add(this.classes[i]);
    }

    // Adiciona atributos do template do MF pra tag body
    document.body.setAttribute("data-open", "click");
    document.body.setAttribute("data-menu", "vertical-menu-modern");
    document.body.setAttribute("data-menu", "2-columns");
    document.body.style.overflow = "auto";
  },
  beforeDestroy() {
    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.remove(this.classes[i]);
    }

    document.body.setAttribute("data-open", "");
    document.body.setAttribute("data-menu", "");
    document.body.setAttribute("data-menu", "");
  },
  methods: {
    away() {
      let menuClassList = document.body.classList;
      if (menuClassList.contains("menu-open")) {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },
  },
  mixins: [clickaway],
  components: {
    VNavbar,
    VSidebar
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
