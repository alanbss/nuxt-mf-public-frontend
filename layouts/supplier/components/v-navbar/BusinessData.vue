<template>
  <a @click="active=true" class="dropdown-item">
    <i class="feather icon-info"></i> Dados do negócio
    <vs-popup title="Dados do negócio" :active.sync="active">
      <div class="table-responsive">
        <form>
          <table class="table table-hover-animation mb-0">
            <tbody>
              <tr>
                <th scope="row">Nome fantasia:</th>
                <td>{{ name }}</td>
              </tr>
              <tr>
                <th scope="row">Razão social:</th>
                <td>{{ legalName }}</td>
              </tr>
              <tr v-if="cnpj">
                <th scope="row">CNPJ:</th>
                <td>{{ cnpj }}</td>
              </tr>
              <tr v-if="cpf">
                <th scope="row">CPF:</th>
                <td>{{ cpf }}</td>
              </tr>
              <tr>
                <th scope="row">CEP:</th>
                <td>{{ zipcode }}</td>
              </tr>
              <tr>
                <th scope="row">Endereço:</th>
                <td>{{ street + ", " + addressDetails }}</td>
              </tr>
              <tr>
                <th scope="row">Bairro:</th>
                <td>{{ neighborhood }}</td>
              </tr>
              <tr>
                <th scope="row">Município/UF:</th>
                <td>{{ city + '/' + stateUF }}</td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      <div
        v-if="$auth.user().supplierStatus == 'Liberado' || $auth.user().supplierStatus == 'Manutenção'"
        class="alert alert-warning mt-2"
        role="alert"
        style="padding-top: 1.4rem; padding-bottom: 1.6rem;"
      >
        <i class="feather icon-alert-circle mr-1 align-middle float-left" style="font-size: 2rem;"></i>
        <span class="text-dark">
          Para alterar os dados acima,
          <a href="javascript:void(0)" @click="showEdit" style="color: #007bff;">clique aqui</a> e entre em contato conosco.
        </span>
      </div>
    </vs-popup>
    <vs-popup title="Editar dados do negócio" :active.sync="editInfo">
      <loading-overlay
        :active.sync="isLoading"
        :is-full-page="fullPage"
        :loader="loader"
        :color="color"
        :background-color="backgroundColor"
        :opacity="opacity"
        :width="width"
        :height="height"
      />
      <div class="table-responsive">
        <p>
          Dificilmente os dados sobre um negócio mudam, mas às vezes isso acontece.<br>
          Nos informe o que deve mudar no seu cadastro.
        </p>
        <form @submit.enter.prevent="submit">
          <table class="table table-hover-animation mb-0">
            <tbody>
              <tr>
                <th scope="row">Nome fantasia:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="name"
                    v-model="name"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Razão social:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="legalName"
                    v-model="legalName"
                    required
                  />
                </td>
              </tr>
              <tr v-if="cnpj">
                <th scope="row">CNPJ:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="cpnj"
                    v-mask="'##.###.###/####-##'"
                    v-validate="{required: true, length: 14}"
                    v-model="cnpj"
                    required
                  />
                </td>
              </tr>
              <tr v-if="cpf">
                <th scope="row">CPF:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="cpf"
                    v-mask="'###.###.###-##'"
                    v-validate="{required: true, length: 11}"
                    v-model="cpf"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">CEP:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="zipcode"
                    v-mask="'#####-###'"
                    v-validate="{required: true, length: 9}"
                    v-model="zipcode"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Endereço:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="street"
                    v-model="street"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Complemento:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="addressDetails"
                    v-model="addressDetails"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Bairro:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="neighborhood"
                    v-model="neighborhood"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Município:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="city"
                    v-model="city"
                    required
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">UF:</th>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    name="stateUF"
                    v-model="stateUF"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="col-md-12">
            <button
              type="submit"
              class="btn btn-outline-primary mr-1 mb-1 waves-effect waves-light float-right"
            >Solicitar</button>
            <button
              type="button"
              @click="closePopup"
              class="btn btn-outline-light mr-1 mb-1 waves-effect waves-light float-right"
            >Cancelar</button>
          </div>
        </form>
      </div>
    </vs-popup>
    <vs-popup title="Solicitação enviada!" :active.sync="success">
      <p>Recebemos sua solicitação. Faremos as alterações assim que possível. Se tivermos alguma dúvida, entraremos em contato.</p>
    </vs-popup>
  </a>
</template>

<script>
import { mask } from "vue-the-mask";
import DataService from '@/resources/users/services/DataService'

export default {
  name: "BusinessData",
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      active: false,
      editInfo: false,
      success: false,
      error: undefined,
      isLoading: false,
      user: {},
      newData: {},
    };
  },
  mounted() {
    this.user = JSON.parse(JSON.stringify(this.$auth.user()))
  },
  computed: {
    name: {
      get () {
       return this.user.name;
      },
      set (value){
       this.newData.name = value
      }
    },
    legalName: {
      get () {
       return this.user.legalName;
      },
      set (value){
       this.newData.legalName = value;
      }
    },
    cnpj: {
      get () {
        if(this.user.cnpj)
          return this.user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5')
        else
          return null
      },
      set (value){
        this.newData.cnpj = value;
      }
    },
    cpf: {
      get () {
        if(this.user.cpf)
          return this.user.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')
        else
          return null
      },
      set (value){
        this.newData.cpf = value;
      }
    },
    zipcode: {
      get () {
       return this.user.zipcode
      },
      set (value){
       this.newData.zipcode = value;
      }
    },
    street: {
      get () {
       return this.user.street;
      },
      set (value){
       this.newData.street = value;
      }
    },
    addressDetails: {
      get () {
       return this.user.addressDetails;
      },
      set (value){
       this.newData.addressDetails = value;
      }
    },
    neighborhood: {
      get () {
       return this.user.neighborhood;
      },
      set (value){
       this.newData.neighborhood = value;
      }
    },
    city: {
      get () {
       return this.user.city;
      },
      set (value){
       this.newData.city = value;
      }
    },
    stateUF: {
      get () {
       return this.user.stateUf;
      },
      set (value){
       this.newData.stateUf = value;
      }
    },
    infoMessage() {
      return `Solicitação de Alteração Realizada!`;
    },
  },
  methods: {
    showEdit() {
      this.active = false
      this.editInfo = true
    },
    closePopup() {
      this.editInfo = false
    },
    async submit() {
      this.isLoading = true
      this.newData.email = this.user.email
      DataService.changeData(this.newData).then((response) => {
        this.editInfo = false
        this.isLoading = false;
        this.success = true;
      })
      .catch((error) => {
        this.editInfo = false
        this.isLoading = false;
        const { errors } = error.response.data;
        this.error = errors
          ? errors
          : ["Não foi possível se conectar ao Meu Fornecedor."];
      })
    },
  },
  directives: {
    mask,
  },
};
</script>
