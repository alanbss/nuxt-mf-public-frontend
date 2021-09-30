<template>
  <header id="header" ref="header" class="fixed-top d-flex align-items-center">
    <div class="container d-flex align-items-center">
      <div class="logo mr-auto">
        <a href="javascript:void(0);" @click="scrollToTop()" title="">
          <img :src="require(`~/assets/images/logo-cover.png`)" alt="Meu Fornecedor" class="img-fluid">
        </a>
      </div>
      <nav class="nav-menu">
        
      </nav>
    </div>
    <partner-modal :openPopup="openPartner" @update-modal="closePopup" />
  </header>
</template>

<style scoped src="~/assets/css/cover.css">
</style>

<script>
import { mapState } from "vuex";
import PartnerModal from "~/components/users/components/PartnerModal";

// import ProfileDropdown from "./v-navbar/ProfileDropdown";
// import VQuotationButton from "./v-navbar/VQuotationButton";

export default {
  name: "VNavbar",
  data() {
    return {
      openPartner: false
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    btnStyle() {
      return 'background: #f2e50e; color: black; border-radius: 4px; margin: 0 0 0 30px; padding: 10px 25px; display: block; position: relative; font-family: "Open Sans", sans-serif;'
    }
  },
  methods: {
    scrollToTop() {
      if(this.$route.name == 'about')
        this.$router.push({ name: 'home' })
      else
        window.scrollTo(0,0)
    },
    handleScroll() {
      if (window.scrollY > 50) {
        this.$refs.header.classList.add("header-scrolled")
      } else {
        this.$refs.header.classList.remove("header-scrolled")
      }
    },
    closePopup(value) {
      this.openPartner = value
    },
  },
  components: {
    PartnerModal
  },
};
</script>
