<template>
  <span>
    <vs-popup title="Recusar" :active.sync="open">
      <div class="row m-0 pb-2 d-flex justify-content-center">
        <i class="feather icon-info" style="font-size: 7em; color: #f8bb86;"></i>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <h6>Tem certeza que deseja recusar esta cotação?</h6>
        <h6>Não é possível desfazer esta escolha.</h6>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <vs-button class="mr-1" @click="open = false; openJustify = true;" color="danger" type="filled">Sim, recusar</vs-button>
        <vs-button @click="open = false" color="primary" type="border">Voltar</vs-button>
      </div>
    </vs-popup>

    <vs-popup title="Informe o cliente a razão da recusa" :active.sync="openJustify">
      <div class="row m-0 pb-2 d-flex justify-content-center">
        <span class="w-100 d-block mt-1 mb-1">
          <vs-checkbox v-model="justification" vs-value="Não atendemos em sua localidade">
            Não atendemos em sua localidade
          </vs-checkbox>
          <!-- <input type="checkbox" class="form-check-input" id="item-check1">
          <label class="form-check-label font-weight-bold" for="item-check1">Não atendemos em sua localidade</label> -->
        </span>
        <span class="w-100 d-block mb-1">
          <vs-checkbox v-model="justification" vs-value="Há pendências financeiras a acertarmos">
            Há pendências financeiras a acertarmos
          </vs-checkbox>
          <!-- <input type="checkbox" class="form-check-input" id="item-check2">
          <label class="form-check-label font-weight-bold" for="item-check2">Há pendências financeiras a acertarmos</label> -->
        </span>
        <span class="w-100 d-block mb-1">
          <vs-checkbox v-model="justification" vs-value="Cadastre sua empresa em nosso sistema para iniciarmos atendimento">
            Cadastre sua empresa em nosso sistema para iniciarmos atendimento
          </vs-checkbox>
          <!-- <input type="checkbox" class="form-check-input" id="item-check2">
          <label class="form-check-label font-weight-bold" for="item-check2">Há pendências financeiras a acertarmos</label> -->
        </span>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <span class="d-block w-100">
          <vs-textarea placeholder="Algum comentário a acrescentar?" v-model="comments" />
          <!-- <textarea class="form-control text-center" rows="2" placeholder="Algum comentário a acrescentar?"></textarea> -->
        </span>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <vs-button @click="sendJustification()" :disabled="isDisabled" color="primary" type="filled">Enviar</vs-button>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RefuseQuotationModal",
  data() {
    return {
      open: false,
      openJustify: false,
      justification: [],
      comments: null
    }
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-popup', this.open)
    }
  },
  computed: {
    isDisabled() {
      if(this.justification.length)
        return false
      else
        return true
    }
  },
  methods: {
    ...mapActions("quotations", [
      "refuseQuotation",
    ]),
    sendJustification() {
      this.refuseQuotation({ quotationId: this.quotationId, justification: this.justification, comments: this.comments }).then(() => {
        this.$emit('supplier-refused', this.quotationId)
      })
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    quotationId: {
      type: Number,
      required: true,
    },
  },
  components: {

  },
};
</script>
