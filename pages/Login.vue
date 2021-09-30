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
      <div class="card-header pb-1" v-if="!completedSignUp && !completedRecovery">
        <div class="card-title">
          <h4 class="mb-0">Seja bem-vindo(a)!</h4>
        </div>
      </div>
      <div class="card rounded-1 mb-0 mt-1 pt-1 px-2" style="background-color: #f2e50e;" v-else-if="completedSignUp">
        <h4 style="font-weight: bolder;">Faça seu login</h4>
        <h6 class="mb-1">Mandamos agora mesmo a senha para seu email ({{ userEmail }})</h6>
        <p v-if="hasOrder">Assim que você entrar no sistema seu pedido será emitido automaticamente!</p>
        <p v-else>Assim que você entrar no sistema sua cotação será emitida automaticamente!</p>
      </div>

      <div class="px-2" v-if="!completedSignUp && !completedRecovery">
        <p>Crie sua conta para fazer cotações</p>

        <p>
          <button
            @click="toRegistration()"
            style="width: 170px"
            class="btn btn-outline-primary btn-inline text-bold-600"
          >
            <b-spinner variant="success" v-if="registerLoading" small  />
            <span v-else>Fazer cadastro</span>
          </button>
        </p>
      </div>

      <div class="alert alert-warning mt-2 mb-0" role="alert" v-if="completedRecovery">Senha redefinida!</div>

      <div class="divider">
        <hr />
      </div>

      <div
        v-if="validatedAccount"
        style="background: #0cb695; color:white;"
        class="mx-2 alert"
        role="alert"
      >
        <p
          class="font-weight-bold px-2 py-1"
          style="font-size: 1.22rem;"
        >Email autenticado com sucesso!</p>
      </div>

      <div class="ml-1 mr-1" v-if="showRegionAlert">
        <h5>Atenção!</h5>
        <p>
          O CEP e/ou tipo de pessoa que você definiu anteriormente é diferente no seu cadastro.
          Então, ao fazer login, você perderá a cotação que já possa ter iniciado.
        </p>
      </div>

      <p class="px-2">
        <span v-if="!completedSignUp">Já é usuário?</span> Acesse sua conta
      </p>
      <div class="card-content">
        <div class="card-body pt-1">
          <form @submit.prevent="submit">
            <fieldset v-if="!completedSignUp && !completedRecovery" class="form-label-group form-group position-relative has-icon-left">
              <input
                v-model="user.email"
                v-validate="'required|email'"
                name="email"
                type="text"
                class="form-control"
                id="user-email"
                placeholder="Email"
                @change="checkRegion"
                :readonly="completedSignUp || completedRecovery"
                required
              />

              <span
                class="text-danger text-sm"
                v-show="errors.has('email')"
              >{{ errors.first('email') }}</span>
              <div class="form-control-position">
                <i class="feather icon-mail"></i>
              </div>
              <label for="user-email">Email</label>
            </fieldset>
            <fieldset v-else class="form-label-group form-group position-relative">
              <b-input-group prepend="Username">
                <template #prepend>
                  <b-input-group-text >
                    <i class="feather icon-mail"></i>
                  </b-input-group-text>
                </template>
                <b-form-input
                  v-model="user.email"
                  v-validate="'required|email'"
                  name="email"
                  type="text"
                  class="form-control"
                  id="user-email"
                  placeholder="Email"
                  @change="checkRegion"
                  :readonly="(completedSignUp || completedRecovery) && !changeEmail"
                  required
                ></b-form-input>
                <b-input-group-append>
                  <b-button @click="allowChange()">Mudar</b-button>
                </b-input-group-append>
              </b-input-group>

              <span
                class="text-danger text-sm"
                v-show="errors.has('email')"
              >{{ errors.first('email') }}</span>

              <label for="user-email">Email</label>
            </fieldset>

            <fieldset class="form-label-group position-relative has-icon-left">
              <input
                v-model="user.password"
                v-validate="'required'"
                name="password"
                type="password"
                class="form-control"
                id="user-password"
                placeholder="Senha"
                required
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('password')"
              >{{ errors.first('password') }}</span>
              <div class="form-control-position">
                <i class="feather icon-lock"></i>
              </div>
              <label for="user-password">Senha</label>
            </fieldset>

            <span class="text-danger text-sm" v-if="error">
              <ul>
                <li v-for="er in error" :key="er">{{er}}</li>
              </ul>
            </span>

            <div class="form-group d-flex justify-content-between align-items-center">
              <!-- <div class="text-left">
                <fieldset class="checkbox">
                  <div class="vs-checkbox-con vs-checkbox-primary">
                    <input v-model="rememberMe" type="checkbox" />
                    <span class="vs-checkbox">
                      <span class="vs-checkbox--check">
                        <i class="vs-icon feather icon-check"></i>
                      </span>
                    </span>
                    <span class>Lembrar-me</span>
                  </div>
                </fieldset>
              </div> -->
              <div class="text-right">
                <a
                  href="javascript:void(0)"
                  @click="openForgotPassword"
                  class="card-link"
                >Esqueceu a senha?</a>
              </div>
            </div>
            <button type="submit" class="btn btn-primary float-left btn-inline text-bold-600" style="background: linear-gradient(45deg, rgba(3,145,209,1) 50%, rgba(5,242,240,1) 100%); font-weight:800;">
              <b-spinner v-if="buttonLoading" small />
              <span v-else>Fazer login</span>
              </button>
          </form>
        </div>
      </div>
      <div class="login-footer" v-if="!completedSignUp">
        <div class="divider">
          <hr />
        </div>
        <p>
          <span class="text-bold-600" style="color: #f57f17">Quer vender através do Meu Fornecedor?</span>
          <br />
          <small>Se você fornece produtos para restaurantes e similares, nós podemos ser seu novo canal de vendas.</small>
        </p>
        <p>
          <a
            href="#"
            data-toggle="modal"
            data-target="#contact-fornecedor"
            class="btn btn-inline btn-outline-orange mb-1 text-bold-600"
          >Seja nosso parceiro</a>
        </p>
      </div>
      <div class="login-footer" v-else>
        <p>

        </p>
      </div>
    </div>
    <forgot-password-modal :openPopup="openForgot" @update-modal="updateForgotPassword"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ClientService from '@/resources/clients/services/clients.services'
import ForgotPasswordModal from "~/components/login/ForgotPasswordModal";

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
        email: "",
        password: "",
      },
      rememberMe: true,
      error: null,
      activeAlert: false,
      openForgot: false,
      showRegionAlert: false,
      changeEmail: false,
      buttonLoading: false,
      registerLoading: false
    };
  },
  computed: {
    ...mapGetters('navigationFilters', ['params']),
    ...mapState(["userEmail"]),
    validatedAccount() {
      return this.$route.query.account_confirmation_success;
    },
    completedSignUp() {
      if(this.$route.query.completedSignUp)
        return true
      else
        return false
    },
    completedRecovery() {
      if(this.$route.query.completedRecovery)
        return true
      else
        return false
    },
    hasOrder() {
      return this.$route.query.directOrder
    }
  },
  created() {
    if(this.completedSignUp || this.completedRecovery) {
      this.user.email = this.userEmail
    }
  },
  // mounted() {
  //   if(this.completedSignUp) {
  //     this.user.email = this.userEmail
  //   }
  // },
  methods: {
    ...mapActions("users/products", [
      "clearQuoteCart",
    ]),
    allowChange() {
      this.changeEmail = true
    },
    checkRegion() {
      ClientService.getTypeAndRegion(this.user.email).then((response) => {
        this.showRegionAlert = false
        if(this.params.region_id && (response.data.region_id != this.params.region_id))
          this.showRegionAlert = true

        if(this.params.serves_type && (response.data.serves_type != this.params.serves_type))
          this.showRegionAlert = true
      })
    },
    submit() {
      this.isLoading = true;
      this.buttonLoading = true
      setTimeout(() => {
        this.$validator.validateAll().then((result) => {
          this.buttonLoading = false
          if (result) {
            if(this.showRegionAlert)
              this.clearQuoteCart()

            let redirectUrl = '/'
            if(this.completedSignUp && !this.hasOrder)
              redirectUrl = '/revisar-cotacao?autoOpen=true'
            else if(this.completedSignUp && this.hasOrder)
              redirectUrl = `/loja/${this.$route.query.supplierSlug}/revisar-compra/${this.hasOrder}?autoOpen=true`
            this.$auth
              .login({
                data: this.user,
                fetchUser: true,
                staySignedIn: true,
                remember: this.rememberMe,
                redirect: redirectUrl
              })
              .then((response) => {
                this.isLoading = false
                this.clearFilterParams()
                this.setUser(response.data.data)
              })
              .catch((error) => {
                this.isLoading = false;
                const { errors } = error.response.data;
                this.error = errors
                  ? errors
                  : ["Não foi possível se conectar ao Meu Fornecedor."];

                this.activeAlert = true;
             });
          }
        });
      }, 300);

    },
    openForgotPassword() {
      this.openForgot = true
    },
    updateForgotPassword(value) {
      this.openForgot = value
    },
    toRegistration(){
      this.registerLoading = true
      setTimeout(() => {
        this.registerLoading = false
        this.$router.push({name: 'sign-up' })
      }, 300);
    },
    ...mapActions("users", ["setUser"]),
    ...mapActions("navigationFilters", ["clearFilterParams"]),
  },
  components: {
    ForgotPasswordModal
  }
};
</script>
