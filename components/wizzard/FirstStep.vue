<template>
  <form data-vv-scope="step-1">
    <fieldset class="p-0">
      <div class="row">
        <div class="col-12" v-if="showRadios">
          <label class="label-cadastrar">Me cadastrar como:</label>

          <div class="form-group form-check-radio">
            <vs-radio
              class="radio-choice"
              color="primary"
              v-model="isCnpjRadio"
              vs-value="true"
              >Pessoa Jurídica</vs-radio
            >
          </div>
          <div class="form-group form-check-radio">
            <vs-radio
              v-align="right"
              class="radio-choice"
              color="primary"
              v-model="isCnpjRadio"
              vs-value="false"
              >Pessoa Física</vs-radio
            >
          </div>
        </div>

        <div v-if="isCnpj()" class="col-12">
          <div>
            <div class="form-group">
              <label>Nome fantasia do seu negócio</label>
              <input
                v-model="user.name"
                v-validate="'required'"
                data-vv-name="name"
                type="text"
                class="form-control required"
                placeholder="Nome conhecido da sua empresa"
              />
              <label v-show="errors.has('step-1.name')" class="danger">{{
                errors.first("step-1.name")
              }}</label>
            </div>
          </div>

          <div >
            <div class="form-group">
              <label>Razão Social</label>
              <input
                v-model="user.legalName"
                v-validate="'required'"
                data-vv-name="legal_name"
                type="text"
                class="form-control required"
                placeholder="Nome formal do seu negócio"
              />
              <label v-show="errors.has('step-1.legal_name')" class="danger">{{
                errors.first("step-1.legal_name")
              }}</label>
            </div>
          </div>

          <div >
            <div v-if="usedCNPJ" class="alert" style="background-color: #e3e1fc;">
              <p>
                <b>
                  Esse CNPJ já possui usuário.
                </b>
                <login-dropdown linkText="Fazer login" />
              </p>

            </div>
            <div class="form-group">
              <label>CNPJ</label>
              <input
                v-model="user.cnpj"
                v-validate="cnpjRules"
                data-vv-name="cnpj"
                v-mask="'##############'"
                type="text"
                class="form-control"
                placeholder="Apenas os números"
                @input="checkExistingCNPJ"
              />
              <label v-show="errors.has('step-1.cnpj')" class="danger">{{
                errors.first("step-1.cnpj")
              }}</label>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="col-12">
            <div v-if="usedCPF" class="alert" style="background-color: #e3e1fc;">
              <p>
                <b>
                  Esse CPF já possui usuário.
                </b>
                <login-dropdown linkText="Fazer login" />
              </p>

            </div>
            <div class="form-group">
              <label>CPF</label>
              <input
                type="text"
                v-model="user.cpf"
                v-validate="cpfRules"
                data-vv-name="cpf"
                v-mask="'###########'"
                class="form-control"
                placeholder="Apenas os números"
                @input="checkExistingCPF"
              />
              <label v-show="errors.has('step-1.cpf')" class="danger">{{
                errors.first("step-1.cpf")
              }}</label>
            </div>

          </div>
        </div>
      </div>
      <div class="mb-2" style="margin: 0;
                  display: flex;
                  flex-direction: column;
                  flex-wrap: nowrap;
                  align-content: flex-start;
                  justify-content: center;
                  align-items: start;
              ">
          <vs-checkbox v-model="user.asSupplier" style="white-space: nowrap;">Me cadastrar como distribuidora</vs-checkbox>
          <small style="padding-left: 30px; white-space: nowrap;">Eu vendo para restaurante e similares</small>
      </div>
    </fieldset>
    <sign-up-modal :openPopup="openModal" />
  </form>
</template>

<script>
import { mask } from "vue-the-mask";
import { mapGetters } from "vuex";
import { cpf } from 'cpf-cnpj-validator';
import { cnpj } from 'cpf-cnpj-validator';

import stepValidation from "@/mixins/stepValidation";
import ClientService from '~/components/clients/services/clients.services'
import LoginDropdown from "~/components/login/LoginDropdown";
import SignUpModal from "~/components/wizzard/SignUpModal";

export default {
  data() {
    return {
      isCnpjRadio: "true",
      physicalPerson: false,
      usedCNPJ: false,
      usedCPF: false,
      canUseCNPJ: null,
      canUseCPF: null,
      openModal: false,
    };
  },
  created() {
    this.params.serves_type == "PF" ? this.isCnpjRadio = "false" : this.isCnpjRadio = "true"
    this.$validator.extend('validCNPJ', {
      getMessage(field, args) {
        return 'CNPJ inválido.'
      },
      validate(value, args) {
        return cnpj.isValid(value)
      }
    })
    this.$validator.extend('validCPF', {
      getMessage(field, args) {
        return 'CPF inválido.'
      },
      validate(value, args) {
        return cpf.isValid(value)
      }
    })

  },
  mounted() {
    this.openModal = true
  },
  methods: {
    isCnpj() {
      if (this.isCnpjRadio.toLowerCase() === "true") return true;
      if (this.isCnpjRadio.toLowerCase() === "false") return false;
    },
    checkExistingCNPJ() {
      if(this.user.cnpj.length == 14) {
        this.canUseCNPJ = this.user.cnpj
        ClientService.checkCNPJ(this.user.cnpj).then((response) => {
          if(response.data['available'] && response.data['available'] == 'no') {
            this.usedCNPJ = true
            this.canUseCNPJ = null
          }
          else {
            this.usedCNPJ = false
            this.canUseCNPJ = this.user.cnpj
          }
        })
      }
    },
    checkExistingCPF() {
      if(this.user.cpf.length == 11) {
        this.canUseCPF = this.user.cpf
        ClientService.checkCPF(this.user.cpf).then((response) => {
          if(response.data['available'] && response.data['available'] == 'no') {
            this.usedCPF = true
            this.canUseCPF = null
          }
          else {
            this.usedCPF = false
            this.canUseCPF = this.user.cpf
          }
        })
      }
    },
  },
  computed: {
    ...mapGetters("navigationFilters", ["params"]),
    showRadios() {
      if(this.params.serves_type)
        return false
      else
        return true
    },
    cnpjRules() {
      const cnpjRules = {
        required: true,
        length: 14,
        is: this.canUseCNPJ,
        validCNPJ: true
      };
      return cnpjRules;
    },
    cpfRules() {
      const cpfRules = {
        required: true,
        length: 11,
        is: this.canUseCPF,
        validCPF: true
      };
      return cpfRules;
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  directives: {
    mask,
  },
  components: {
    LoginDropdown,
    SignUpModal
  },
  mixins: [stepValidation],
};
</script>
