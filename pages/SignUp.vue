<template>
  <div>
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
    <div class="card rounded-0 mb-0 px-2">
      <div class="card-header pb-1">
        <div class="card-title">
          <h4 class="mb-0">Cadastre-se</h4>
        </div>
      </div>
      <div class="card-content">
        <div class="card-body py-0">
          <form-wizard
            color="#0391D1"
            errorColor="#EA5455"
            :title="''"
            :subtitle="''"
            transition="fade"
          >
            <tab-content :title="'Etapa 1'" :before-change="validateStep1" icon="feather icon-home">
              <first-step :user="user" ref="firstStepForm" @update="update" />
            </tab-content>

            <tab-content
              :title="'Etapa 2'"
              :before-change="validateStep2"
              icon="feather icon-phone"
            >
              <second-step :user="user" ref="secondStepForm" @update="update" />
            </tab-content>

            <tab-content
              :title="'Etapa 3'"
              :before-change="validateStep3"
              icon="feather icon-map-pin"
            >
              <third-step :user="user" ref="thirdStepForm" @update="update" />
            </tab-content>

            <tab-content :title="'Etapa 4'" :before-change="validateStep4" icon="feather icon-mail">
              <fourth-step :user="user" ref="fourthStepForm" @update="update" />

              <span class="text-danger text-sm" v-if="error">
                <ul>
                  <li v-for="er in error" :key="er">{{er}}</li>
                </ul>
              </span>
            </tab-content>
            <template slot="footer" slot-scope="props">
              <div class="wizard-footer-left">
                <wizard-button
                  v-if="props.activeTabIndex > 0"
                  @click.native="setPrevTab(props.prevTab)"
                  class="wizard-btn"
                  style="border-color: rgb(3, 145, 209); color: rgb(3, 145, 209);"
                >
                  <b-spinner v-if="prevLoading" small/>
                  <span v-else>
                     <i class="feather icon-arrow-left"></i> Voltar
                  </span>

                </wizard-button>
              </div>
              
              <div class="row">
                <div class=" col-12 col-sm-6" :class="isMobile ? 'pl-5 mb-1' : ''">
                  <div v-if="props.activeTabIndex == 0" class="text-left p">
                    <p class="mt-0 mb-0">
                    Já tem cadastro?
                    </p>
                    <div :class="isMobile ? 'pl-3' : ''" :style="isMobile ? '' : 'padding-left: 70px'">
                      <login-dropdown linkText="Entrar" />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6" :class="isMobile ? 'pr-3' : ''">
                  <div class="wizard-footer-right" >
                    <wizard-button
                      v-if="!props.isLastStep"
                      @click.native="setNextTab(props.nextTab)"
                      class="wizard-footer-right"
                      style="width: 140px"
                      :style="props.fillButtonStyle"
                    >
                      <b-spinner v-if="nextLoading" small/>
                      <span v-else>
                        Avançar <i class="feather icon-arrow-right"></i>
                      </span>

                    </wizard-button>

                    <wizard-button
                      v-else
                      @click.native="formSubmitted"
                      class="wizard-footer-right finish-button"
                      :style="props.fillButtonStyle"
                    >
                      <b-spinner v-if="buttonLoading" small/>
                      <span v-else>{{props.isLastStep ? 'Concluir' : 'Avançar'}}</span>
                    </wizard-button>
                  </div>
                </div>
              </div>
            </template>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import LoginDropdown from "~/components/login/LoginDropdown";
import FirstStep from "~/components/wizzard/FirstStep";
import SecondStep from "~/components/wizzard/SecondStep";
import ThirdStep from "~/components/wizzard/ThirdStep";
import FourthStep from "~/components/wizzard/FourthStep";
import ContactService from "@/resources/users/services/ContactService"
import { mapActions } from "vuex";

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      user: {
        name: "",
        legalName: "",
        cnpj: "",
        cpf: "",
        contactName: "",
        whatsapp: "",
        phone: "",
        zipcode: "",
        state: "",
        stateId: "",
        city: "",
        street: "",
        neighborhood: "",
        addressDetails: "",
        email: "",
        asSupplier: false,
      },
      error: null,
      activeAlert: false,
      prevLoading: false,
      nextLoading: false,
      buttonLoading: false
    };
  },
  computed: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    redirectURL() {
      if(this.$route.query.directOrder)
        return `/login?completedSignUp=true&directOrder=${this.$route.query.directOrder}&supplierSlug=${this.$route.query.supplierSlug}`
      else
        return "/login?completedSignUp=true"
    }
  },
  methods: {
    ...mapActions(["setUserEmail"]),
    async formSubmitted() {
      this.isLoading = true;
      this.buttonLoading = true
      if(!this.user.name || this.user.name == "")
        this.user.name = this.user.contactName
      setTimeout(() => {
        this.sendUserAsPartner(this.user);
        this.buttonLoading = false
         this.$auth
        .register({
          data: { user: this.user },
          fetchUser: true,
          staySignedIn: false,
          redirect: this.redirectURL,
        })
        .then(
          () => {
            this.setUserEmail(this.user.email);
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            let errorResponse = error.response;

            if (errorResponse) {
              // Erros vindos da API
              this.error = error.response.data.errors.full_messages;
            } else
              this.error = ["Não foi possível se conectar ao Meu Fornecedor."];
            this.activeAlert = true;
          }
        )
      }, 300);

    },
    update(payload) {
      this.user = payload.user;
    },

    async validateStep1() {
      return await this.$refs.firstStepForm.validateStep("step-1");
    },

    async validateStep2() {
      return await this.$refs.secondStepForm.validateStep("step-2");
    },

    async validateStep3() {
      return await this.$refs.thirdStepForm.validateStep("step-3");
    },

    async validateStep4() {
      return await this.$refs.fourthStepForm.validateStep("step-4");
    },
    setNextTab(next){
      this.nextLoading = true;
      setTimeout(() => {
        this.nextLoading = false
        next()}, 300)
    },
    setPrevTab(prev){
    this.prevLoading = true;
    setTimeout(() => {
      this.prevLoading = false
      prev()}, 300)
    },
    sendUserAsPartner(user){
      if(user.asSupplier == true){
        ContactService.userAsSupplierData(user);
      }else{
        return 0;
      }
    }
  },
  components: {
    FormWizard,
    LoginDropdown,
    TabContent,
    FirstStep,
    SecondStep,
    ThirdStep,
    FourthStep,
  },
};
</script>
