<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title color-mf-laranja">
                <i class="feather icon-truck mr-50 font-medium-2"></i> Defina suas condições de entrega
              </h4>
            </div>
            <form @submit.prevent="saveDeliveries">
              <div class="card-content">
                <div class="card-body">
                  <div class="vs-checkbox-con vs-checkbox-primary mt-1 mb-1">
                    <input v-model="deliveryConditions.noDeliveries" type="checkbox" value />
                    <span class="vs-checkbox">
                      <span class="vs-checkbox--check">
                        <i class="vs-icon feather icon-check"></i>
                      </span>
                    </span>
                    <span>Eu não faço entrega</span>
                  </div>

                  <div v-if="!deliveryConditions.noDeliveries">
                    <p class="mb-50 font-weight-bold">Qual seu prazo padrão de entrega?</p>
                    <p
                      class="font-small-3"
                    >Descreva com clareza para não haver dúvidas para seus clientes.</p>
                    <textarea
                      v-model="deliveryConditions.deliveryEstimate"
                      :required="!deliveryConditions.deliveryEstimate"
                      class="form-control"
                      id="delivery-estimate"
                      rows="3"
                      placeholder="Exemplo: entregamos em 24 horas na capital, em 72 horas no interior."
                    ></textarea>

                    <hr class="my-2" />

                    <p class="mb-50 font-weight-bold">Qual sua rota (intinerário) de entrega?</p>
                    <p class="font-small-3">Caso você tenha, descreva com clareza.</p>
                    <textarea
                      v-model="deliveryConditions.deliveryRoute"
                      :required="!deliveryConditions.noDeliveries"
                      class="form-control"
                      id="delivery-route"
                      rows="3"
                      placeholder="Exemplo: Na capital: seg., qua., sex., entregamos na zona sul. Terças no centro e região norte. No interior: apenas quintas e sextas."
                    ></textarea>
                  </div>

                  <div v-if="!deliveryConditions.noDeliveries" class="alert alert-warning py-1 px-2 mb-0 mt-2">
                    <p class="mb-50 font-weight-bold font-medium-1">
                      <i class="feather icon-alert-circle mr-50"></i> Você cobra taxa de frete?
                    </p>
                    <p
                      class="font-small-3 text-dark"
                    >Toda vez que você atender a cotação de um cliente é possível definir o valor de frete ao pedido específico do momento.</p>
                  </div>
                </div>
              </div>
              <div class="card-footer p-1 text-center">
                <button type="submit" class="btn btn-primary waves-effect waves-light">
                  <b-spinner v-if="buttonLoading" small/>
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
import SupplierConfigurationService from "~/components/suppliers/services/supplierConfigurations";

export default {
  name: "DeliveryConditions",
  data() {
    return {
      deliveryConditions: {},
      buttonLoading: false
    };
  },
  async mounted() {
    let response = await SupplierConfigurationService.getDeliveryConditions();

    this.deliveryConditions = response.data;
  },
  methods: {
    async saveDeliveries() {
      this.buttonLoading = true
          let response = await SupplierConfigurationService.saveDeliveryConditions(
            this.deliveriesFormattedByConditions()
          );
      setTimeout(() => {
          this.buttonLoading = false
          if (response.data) {
            this.$router.push({ name: "service-conditions" });
        } 
      }, 300);
    },
    deliveriesFormattedByConditions() {
      let deliveryConditions = this.deliveryConditions;

      if (deliveryConditions.noDeliveries === null) {
        deliveryConditions.noDeliveries = false;
      }

      if (
        (deliveryConditions.deliveryEstimate === null &&
          deliveryConditions.deliveryRoute === null) ||
        deliveryConditions.noDeliveries === true
      ) {
        deliveryConditions.deliveryEstimate = "";
        deliveryConditions.deliveryRoute = "";
      }

      return deliveryConditions;
    },
  },
};
</script>