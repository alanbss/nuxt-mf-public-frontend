<template>
  <form data-vv-scope="step-4">
    <fieldset class="p-0">
      <div class="row">
        <div v-if="usedEmail" class="col-12 alert" style="background-color: #e3e1fc;">
          <p>
            <b>
              Esse email já possui usuário.
            </b>
            <login-dropdown linkText="Fazer login" />
          </p>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>Seu email</label>
            <input
              v-validate="emailRules"
              ref="email"
              data-vv-name="email"
              label="Seu email"
              placeholder="Seu melhor email"
              v-model="user.email"
              type="text"
              class="form-control required"
              @input="checkExistingEmail"
            />
            <label
              v-show="errors.has('step-4.email')"
              class="danger"
            >{{ errors.first('step-4.email') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Confirme seu email</label>
            <input
              v-validate="'required|confirmed:email'"
              ref="email_confirmation"
              data-vv-name="email_confirmation"
              label="Seu email"
              placeholder="Garanta ter escrito corretamente"
              v-model="emailConfirmation"
              type="text"
              class="form-control required"
            />
            <label
              v-show="errors.has('step-4.email_confirmation')"
              class="danger"
            >{{ errors.first('step-4.email_confirmation') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-dark font-small-3" role="alert">
            <p
              class="mb-0"
            >O email certo é muito importante porque você vai receber notificações nossas através dele.</p>
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script>
import stepValidation from "@/mixins/stepValidation";
import ClientService from '~/components/clients/services/clients.services'
import LoginDropdown from "~/components/login/LoginDropdown"

export default {
  data() {
    return {
      emailConfirmation: null,
      usedEmail: false,
      canUseEmail: null
    };
  },
  methods: {
    checkExistingEmail() {
      if(this.user.email.length > 0) {
        ClientService.checkEmail(this.user.email).then((response) => {
          if(response.data['available'] && response.data['available'] == 'no') {
            this.usedEmail = true
            this.canUseEmail = null
          }
          else {
            this.usedEmail = false
            this.canUseEmail = this.user.email
          }
        })
      }
    }
  },
  computed: {
    emailRules() {
      const emailRules = {
        required: true,
        email: true,
        is: this.canUseEmail
      };
      return emailRules;
    },
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    LoginDropdown
  },
  mixins: [stepValidation]
};
</script>
