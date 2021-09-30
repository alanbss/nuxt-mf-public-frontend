<template>
  <div class="content-wrapper">
    <div class="content-body">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title color-mf-laranja">
                <i class="feather icon-users mr-50 font-medium-2"></i> Defina o tipo de cliente que você atende
              </h4>
            </div>
            <div class="card-content">
              <div class="card-body">
                <p>
                  Seus produtos serão exibidos apenas para quem você marcar abaixo.
                  <br />Você pode escolher as duas opções, se for o caso.
                </p>

                <div class="vs-checkbox-con vs-checkbox-primary mt-2">
                  <input v-model="clientTypes.servesCpf" type="checkbox" value />
                  <span class="vs-checkbox">
                    <span class="vs-checkbox--check">
                      <i class="vs-icon feather icon-check"></i>
                    </span>
                  </span>
                  <span>Pessoas físicas (CPF)</span>
                </div>

                <div class="vs-checkbox-con vs-checkbox-primary mt-2">
                  <input v-model="clientTypes.servesCnpj" type="checkbox" value />
                  <span class="vs-checkbox">
                    <span class="vs-checkbox--check">
                      <i class="vs-icon feather icon-check"></i>
                    </span>
                  </span>
                  <span>Pessoas jurídicas (CNPJ)</span>
                </div>
              </div>
            </div>
            <div class="card-footer p-1 text-center">
              <button
                type="submit"
                @click.prevent="saveClientTypes"
                class="btn btn-primary waves-effect waves-light"
              >
              <b-spinner v-if="buttonLoading" small/>
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

export default {
  name: "ClientTypes",
  data() {
    return {
      clientTypes: {},
      buttonLoading: false
    };
  },
  async mounted() {
    let response = await SupplierConfigurationService.getClientTypes();

    this.clientTypes = response.data;
  },
  methods: {
    async saveClientTypes() {
      this.buttonLoading = true
        await SupplierConfigurationService.saveClientTypes(this.clientTypes);
      setTimeout(() => {
        this.buttonLoading = false
        this.$router.push({ name: "service-conditions" });
      }, 300);
      
    },
  },
};
</script>