<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title color-mf-laranja">
                <i class="feather icon-dollar-sign mr-50 font-medium-2"></i> Defina o valor mínimo de pedido
              </h4>
            </div>
            <div class="card-content">
              <div class="card-body">
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="sizing-addon1">R$</span>
                  </div>

                  <money v-model="minimumOrderValue" v-bind="money" class="form-control"></money>
                </div>
                <p>Os clientes só poderão emitir pedidos de compra a você a partir deste valor.</p>

                <div class="alert alert-warning py-1 px-2 mb-0">
                  <p class="mb-50 font-weight-bold font-medium-1">
                    <i class="feather icon-alert-circle mr-50"></i> Precisa definir um valor máximo de pedido?
                  </p>
                  <p
                    class="font-small-3 text-dark"
                  >Toda vez que você atender a cotação de um cliente é possível definir um valor máximo de pedido específico para o momento.</p>
                </div>
              </div>
            </div>
            <div class="card-footer p-1 text-center">
              <button
                type="submit"
                @click.prevent="saveMinimumOrderValue"
                class="btn btn-primary waves-effect waves-light"
              >
              <b-spinner v-if="buttonLoading" small />
              <span v-else>Salvar e sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SupplierConfigurationService from "@/resources/suppliers/services/supplierConfigurations";
import { Money } from "v-money";

export default {
  name: "MinimumOrderValue",
  data() {
    return {
      minimumOrderValue: "",
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: true,
      },
      buttonLoading: false
    };
  },
  async mounted() {
    let response = await SupplierConfigurationService.getMinimumOrderValue();
    this.minimumOrderValue = parseFloat(response.data.minimumOrderValue);
  },
  computed: {
    prefixedMinimumOrderValue() {
      return `R$ ${this.minimumOrderValue}`;
    },
  },
  methods: {
    async saveMinimumOrderValue() {
      this.buttonLoading = true
      if (this.minimumOrderValue !== "0,00") {
        await SupplierConfigurationService.saveMinimumOrderValue(
          this.prefixedMinimumOrderValue
        );
        setTimeout(() => {
          this.buttonLoading = false
          this.$router.push({ name: "service-conditions" });
        }, 300);
      }
    },
  },
  components: { Money },
};
</script>