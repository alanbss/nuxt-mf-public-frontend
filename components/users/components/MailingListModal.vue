<template>
  <div>
    <vs-popup title="" :active.sync="open">
      <form @submit.enter.prevent="addNewEmail({ email, uf, comments })">
        <div class="row m-0 p-1">
          <img width="150" class="mb-1" :src="require(`@/assets/images/logo-horizontal-01.png`)">
          <h6 class="text-muted">
            Que pena...<br>
            Infelizmente ainda não temos fornecedores cadastrados nesta região.
          </h6>
          <h5 class="mt-1">Deixe seu email. Nós avisaremos quando sua região estiver disponível.</h5>
        </div>
        <div class="row m-0 pl-1">
          <p class="m-0">Seu email</p>
        </div>
        <div class="row m-0 pl-1">
          <div class="form-group">
            <input
              style="width: 120%;"
              v-model="email"
              type="text"
              id="email-mailing-list"
              class="form-control"
              name
              required
            >
          </div>
        </div>
        <div class="row m-0 pl-1" v-if="showError">
          <p style="color: red;">Algo deu errado. Por favor, tente de novo.</p>
        </div>
        <div class="row m-0 pl-1">
          <h5 class="mt-1" style="color: gray;">OPCIONAL</h5>
          <p style="color: gray;">
            Gostaria de ajudar? Ficaríamos muito gratos!<br>
            Se você tem sugestão de fornecedores da sua região, escreva aqui. Nós iremos providenciar a inclusão.
          </p>
        </div>
        <div class="row m-0 pl-1">
          <div class="form-group">
            <textarea
              style="width: 220%;"
              v-model="comments"
              id="comments-mailing-list"
              class="form-control"
              name
            />
          </div>
        </div>
        <div class="row m-0 pl-1">
          <button id="submit-mailing-list" type="submit" class="btn btn-primary text-bold-600">Enviar</button>
        </div>
      </form>
    </vs-popup>
    <vs-popup title="" :active.sync="openSuccess">
      <div class="row m-0 d-flex justify-content-center">
        <img width="150" class="mb-1" :src="require(`@/assets/images/logo-horizontal-01.png`)">
      </div>
      <div class="row m-0 d-flex justify-content-center">
        <h5 id="success-mailing-list">
          Obrigado!<br>
          Informaremos você assim que tivermos novidades.
        </h5>
      </div>
    </vs-popup>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import MailingListService from "@/resources/users/services/MailingListService";

export default {
  name: "MailingListModal",
  data() {
    return {
      open: false,
      name: null,
      comments: null,
      email: null,
      openSuccess: false,
      showError: false
    }
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
    addNewEmail(data) {
      MailingListService.addEmail(data).then(() => {
        this.open = false
        this.openSuccess = true
      }).catch((error) => {
        this.showError = true
      })
    }
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    uf: {
      type: String,
      required: true,
    },
  },
  components: {

  },
};
</script>
