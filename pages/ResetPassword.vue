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
    <div class="card rounded-0 mb-0 px-2 pb-2">
      <div class="card-header pb-1">
        <div class="card-title">
          <h4 class="mb-0">Redefina sua senha</h4>
        </div>
      </div>

      <div class="divider">
        <hr />
      </div>

      <span class="text-danger text-sm" v-if="error">
        <ul>
          <li v-for="er in errorMessages" :key="er">{{ er }}</li>
        </ul>
      </span>

      <p class="px-2">Digite a nova senha:</p>
      <div class="card-content">
        <div class="card-body pt-1">
          <form @submit.prevent="submit">
            <fieldset class="form-label-group position-relative has-icon-left">
              <input
                v-model="password"
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
              <label for="user-password">Nova senha</label>
            </fieldset>

            <fieldset class="form-label-group position-relative has-icon-left">
              <input
                v-model="passwordConfirmation"
                v-validate="'required'"
                name="passwordConfirmation"
                type="password"
                class="form-control"
                id="user-password-confirmation"
                placeholder="Confirme a senha"
                required
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('password')"
              >{{ errors.first('password') }}</span>
              <div class="form-control-position">
                <i class="feather icon-lock"></i>
              </div>
              <label for="user-password">Confirme a nova senha</label>
            </fieldset>

            <div class="alert alert-warning" role="alert" v-if="activeAlert">Senha redefinida!</div>
            <button type="submit" class="btn btn-primary float-left btn-inline text-bold-600">Redefinir</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PasswordService from "~/components/users/services/PasswordService";

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
      error: null,
      activeAlert: false,
      password: '',
      passwordConfirmation: ''
    };
  },
  computed: {
    validatedAccount() {
      return this.$route.query.account_confirmation_success;
    },
    errorMessages() {
      if(this.error['full_messages'])
        return Array.from(new Set(this.error['full_messages']))
      else
        return null
    }
  },
  created() {
    this.setUserEmail(this.$route.query.uid);
  },
  methods: {
    ...mapActions(["setUserEmail"]),
    submit() {
      this.isLoading = true
      PasswordService.resetPassword({
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
        accessToken: this.$route.query['access-token'],
        uid: this.$route.query.uid,
        client: this.$route.query.client
      }).then((response) => {
        this.setUserEmail(this.$route.query.uid);
        this.isLoading = false
        this.activeAlert = true
        this.$router.push({ name: 'home', query: { completedRecovery: true } })
      })
      .catch((error) => {
        this.isLoading = false;
        const { errors } = error.response.data;
        this.error = errors
          ? errors
          : ["Não foi possível se conectar ao Meu Fornecedor."];

        //this.activeAlert = true;
      });
    },

  },
  components: {

  }
};
</script>
