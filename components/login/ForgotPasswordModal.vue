<template>
  <vs-popup title="Esqueceu a senha?" :active.sync="open">
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
    <span class="text-danger text-sm" v-if="error">
      <ul>
        <li v-for="er in error" :key="er">{{er}}</li>
      </ul>
    </span>
    <p>Reinicie ela através do seu email</p>

    <p class="pb-0"><b>Digite o email cadastrado:</b></p>
    <form @submit.prevent="submit">
      <fieldset class="form-label-group form-group position-relative has-icon-left">
        <input
          v-model="email"
          v-validate="'required|email'"
          name="forgot-email"
          type="text"
          class="form-control"
          id="forgot-email"
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
      </fieldset>
      <div
        class="alert"
        role="alert"
        style="background-color: #5ce9c6; color: #008567;"
        v-if="activeAlert"
      >
        Enviamos a instrução sobre como reiniciar sua senha.
      </div>
      <button type="submit" class="btn btn-primary float-left btn-inline text-bold-600">Solicitar</button>
    </form>

  </vs-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PasswordService from "@/resources/users/services/PasswordService";

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
      open: false,
      email: "",
      rememberMe: false,
      error: null,
      activeAlert: false,
    };
  },

  created() {

  },

  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },

  computed: {

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

  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
  },

  components: {

  }
};
</script>
