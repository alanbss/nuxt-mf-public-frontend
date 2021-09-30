<template>
  <footer class="footer footer-static footer-light">
    <vs-divider/>
    <div class="clearfix blue-grey lighten-2 mb-0">
      <partner-modal :openPopup="openPartner" @update-modal="closePopup" />
      <div v-if="!this.mobileBrowser" class="desktop-footer-custom ">
        <div style="display: flex; flex-direction: column;" >
          <img src="~/assets/images/logo-horizontal-01.png" height="60px">
        </div>
          <div style="display: flex; flex-direction: column;" >
            <a style="color: black;" href="javascript:void(0);"> <small>Meu Fornecedor Plataforma Digital LTDA</small></a>
            <a style="color: black;" href="javascript:void(0);"> <small>CNPJ 28.766.904/0001-41 (Fortaleza/CE)</small></a>
            <a style="color: black;" href="javascript:void(0);"> <small>© Todos os direitos reservados</small></a>
          </div>
          <div style="display: flex; flex-direction: column;" >
            <a style="color: black;" href="javascript:void(0);" @click="openPartner = true"> <small>Cadastre grátis sua distribuidora</small></a>
            <a style="color: black;" href="/contato"> <small>Entre em contato</small></a>
            <a style="color: black;" href="/quem-somos"> <small>Quem somos</small></a>
          </div>
          <div>
            <a style="color:black;" href="https://www.facebook.com/meufornecedoroficial/" target="_blank"><i class="p-1 feather icon-facebook"></i></a>
            <a style="color:black;" href="https://www.youtube.com/channel/UCYZzfEXhqIyFVZ3d1sAwgZA" target="_blank"><i class="p-1 feather icon-youtube"></i></a>
            <a style="color:black;" href="https://www.instagram.com/meufornecedoroficial/" target="_blank"><i class="p-1 feather icon-instagram"></i></a>
          </div>
      </div>
      <div v-else class="mobile-footer-custom">
        <div style="display: flex; flex-direction: column;" >
          <img src="~/assets/images/logo-horizontal-01.png" height="60px">
        </div>
          <div>
            <div style="display: flex; flex-direction: column; padding-bottom:10px" >
            <a style="color: black; white-space: nowrap;" href="javascript:void(0);"> <small>Meu Fornecedor Plataforma Digital LTDA</small></a>
            <a style="color: black;" href="javascript:void(0);"> <small>CNPJ 28.766.904/0001-41 (Fortaleza/CE)</small></a>
            <a style="color: black;" href="javascript:void(0);"> <small>© Todos os direitos reservados</small></a>
          </div>
          <div style="display: flex; flex-direction: column; padding-bottom:10px" >
            <a style="color: black;" href="javascript:void(0);" @click="openPartner = true"> <small>Cadastre grátis sua distribuidora</small></a>
            <a style="color: black;" href="/contato"> <small>Entre em contato</small></a>
            <a style="color: black;" href="/quem-somos"> <small>Quem somos</small></a>
          </div>
          <div style="align-self: center;">
            <a style="color:black;" href="https://www.facebook.com/meufornecedoroficial/" target="_blank"><i class=" feather icon-facebook"></i></a>
            <a style="color:black;" href="https://www.youtube.com/channel/UCYZzfEXhqIyFVZ3d1sAwgZA" target="_blank"><i class=" feather icon-youtube"></i></a>
            <a style="color:black;" href="https://www.instagram.com/meufornecedoroficial/" target="_blank"><i class=" feather icon-instagram"></i></a>
          </div>
          </div>
      </div>
    </div>
  </footer>
</template>

<script>
import PartnerModal from "~/components/users/components/PartnerModal";
export default {
  name: "VFooter",
  data() {
    return {
      openPartner: false,
      mobileBrowser: false
    };
  },
  created(){
    this.isMobile()
  },
  methods:{
    closePopup(value) {
      this.openPartner = value
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
  components: {
    PartnerModal
  },
}

</script>
<style>
  .mobile-footer-custom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
  .desktop-footer-custom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
</style>