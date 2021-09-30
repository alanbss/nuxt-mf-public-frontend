<template>
  <vs-popup title="Cadastre grátis sua distribuidora" :active.sync="open">
    <form @submit.enter.prevent="sendMessage({ contactName, name, phone })">
        <div class="modal-body">
            <p class="font-small-3">
                Você fornece para restaurantes, hotéis, padarias, minimercados e similares? Nós podemos ser seu canal de vendas!<br><br>
                Preencha o formulário ( não demora nem 2 minutos) e nós entraremos em contato.<br><br>
                Desde já agradecemos o interesse pela parceria.
            </p><br>

        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button type="submit" class="btn btn-primary text-bold-600"><a style="color: white;" href="https://forms.gle/3s5PoNhKuqJEm6P77" target="blank">Preencher formulário</a></button>
        </div>
    </form>
  </vs-popup>
</template>

<script>

import { mask } from "vue-the-mask";

export default {
  name: "PartnerModal",
  data() {
    return {
      open: false,
    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {

  },
  methods: {
    
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
  },
  components: {

  },
  directives: {
    mask,
  }
};
</script>
