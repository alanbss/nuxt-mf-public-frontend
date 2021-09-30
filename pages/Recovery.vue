<template>
  <div>
    <div class="card rounded-0 mb-0 px-2 pb-2">
      <div class="card-header pb-1">
        <div class="card-title">
          <h4 class="mb-0">Recupere sua senha</h4>
        </div>
      </div>

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
        >Enviamos um email com as instruções.</p>
      </div>

      <p class="px-2">Informe seu email cadastrado:</p>
      <div class="card-content">
        <div class="card-body pt-1">
          <form @submit.prevent="submit">
            <fieldset class="form-label-group form-group position-relative has-icon-left">
              <input
                v-model="email"
                v-validate="'required|email'"
                name="email"
                type="text"
                class="form-control"
                id="user-email"
                placeholder="Email"
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

            <span class="text-danger text-sm" v-if="error">
              <ul>
                <li v-for="er in error" :key="er">{{er}}</li>
              </ul>
            </span>

            <button type="submit" class="btn btn-primary float-left btn-inline text-bold-600">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PasswordService from "@/resources/users/services/PasswordService";

export default {
  data() {
    return {
      isLoading: false,
      email: "",
      rememberMe: false,
      error: null,
      activeAlert: false,
    };
  },
  computed: {
    validatedAccount() {
      return this.$route.query.account_confirmation_success;
    },
  },
  methods: {
    submit() {
      this.isLoading = true
      PasswordService.startResetPassword(this.email).then((response) => {
          this.isLoading = false;
          this.activeAlert = true;
        })
      .catch((error) => {
        this.isLoading = false;
        const { errors } = error.response.data;
        this.error = errors
          ? errors
          : ["Não foi possível se conectar ao Meu Fornecedor."];


      })
    },

  },
  components: {

  }
};
</script>
