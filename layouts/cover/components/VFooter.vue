<template>
  <span>
    <footer id="footer">
      <div class="container">
        <div class="row d-flex align-items-center">
          <div class="col-lg-7">
            <div class="copyright">
              <a href="javascript:void(0);" @click="scrollToTop()">
                <img :src="require(`@/assets/images/logo.png`)" alt="" class="float-left mr-4 my-1 d-none d-md-inline">
              </a>
              Meu Fornecedor Plataforma Digital LTDA <br>
              CNPJ 28.766.904/0001-41 (Fortaleza/CE) <br>
              &copy; Todos os direitos reservados
            </div>
          </div>
          <div class="col-lg-5 text-lg-right text-center pt-4 pt-lg-0">
            <p class="social-link-footer">
              <a href="https://www.facebook.com/meufornecedoroficial" class="social-link_facebook" title=""><i class="bx-fw bx bxl-facebook bx-sm mx-1"></i></a>
              <a href="https://www.youtube.com/channel/UCYZzfEXhqIyFVZ3d1sAwgZA" class="social-link_youtube" title=""><i class="bx-fw bx bxl-youtube bx-sm mx-1"></i></a>
              <a href="https://www.instagram.com/meufornecedoroficial" class="social-link_instagram" title=""><i class="bx-fw bx bxl-instagram bx-sm mx-1"></i></a>
            </p>
            <nav class="footer-links pt-2 pt-lg-0">
              <a href="/contato" title="">Contato</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
    <a ref="backToTop" href="javascript:void(0);" @click="scrollToTop()" class="back-to-top"><i class="feather icon-chevron-up"></i></a>
  </span>
</template>

<style scoped src="@/assets/css/cover.css">
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "VFooter",
  data() {
    return {

    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {

  },
  methods: {
    scrollToTop() {
      window.scrollTo(0,0)
    },
    handleScroll() {
      if (window.scrollY > 100) {
        this.$refs.backToTop.style.display = "inline"
      } else {
        this.$refs.backToTop.style.display = "none"
      }
    },
  },
  components: {

  },
};
</script>
