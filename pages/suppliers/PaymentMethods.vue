<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <form @submit.prevent="sendPaymentMethods">
              <div class="card-header">
                <h4 class="card-title color-mf-laranja">
                  <i class="feather icon-dollar-sign mr-50 font-medium-2"></i> Defina suas condições de pagamento
                </h4>
              </div>
              <div class="card-content">
                <div class="card-body">
                  <p>Descreva todas as diferentes formas de pagamento que você oferece para seus clientes</p>
                  <p
                    class="font-weight-bold text-title"
                  >Toda vez que estiver respondendo uma cotação você pode selecionar quais destas opções ficarão disponíveis para o cliente</p>
                  <b-alert class='justify-background-alert' variant="warning" show>
                    <p class="alert-body font-weight-bold">
                      O cliente não paga através do Meu Fornecedor, isto é direto com você. Estas opções servem para agilizar a comunicação entre vocês.
                    </p>
                 </b-alert>
                  <div class="alert alert-light p-1 mb-0">
                    <p class="text-dark">Exemplo de preenchimento:</p>
                    <p
                      class="font-small-3 text-dark"
                    >À vista no dinheiro, boleto para 7 dias, boleto para 14 dias, cartão de crédito...</p>
                  </div>

                  <payment-method
                    :paymentMethod="paymentMethod"
                    :optionNumber="parseInt(index + 1)"
                    v-for="(paymentMethod, index) in paymentMethods"
                    :key="index"
                  />

                  <div class="mt-2 pl-5">
                    <vs-button
                      @click.prevent="addPaymentMethod({ paymentMethod: '' })"
                      class="ml-2 font-weight-bold"
                      color="#0391D1"
                      type="flat"
                    >Adicionar opção</vs-button>
                  </div>
                </div>
              </div>
              <div class="card-footer p-1 text-center">
                <button type="submit" class="btn btn-primary waves-effect waves-light">
                  <b-spinner v-if="buttonLoading" small />
                  <span v-else>Salvar e sair</span>
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentMethod from "@/resources/suppliers/components/PaymentMethod";
import { mapActions, mapState } from "vuex";

export default {
  name: "PaymentMethods",
  data() {
    return {
      buttonLoading: false
    }
  },
  mounted() {
    this.getPaymentMethods();
  },
  beforeUpdate() {
    if (this.supplierWithoutPaymentMethods) {
      this.addPaymentMethod({ paymentMethod: "" });
    }
  },
  computed: {
    ...mapState("suppliers", ["paymentMethods"]),

    supplierWithoutPaymentMethods() {
      return !this.paymentMethods.length;
    },
  },
  methods: {
    ...mapActions("suppliers", [
      "getPaymentMethods",
      "addPaymentMethod",
      "savePaymentMethods",
      "createPaymentMethods",
      "updatePaymentMethods",
      "destroyPaymentMethods"
    ]),
    sendPaymentMethods() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.savePaymentMethods()
      }, 300);
      // let answer1 = await this.createPaymentMethods()
      // let answer2 = await this.updatePaymentMethods()
      // let answer3 = await this.destroyPaymentMethods()
    }
  },
  components: {
    PaymentMethod,
  },
};
</script>

<style scoped>
.text-title {
  color: #d11b6d;
}
</style>
