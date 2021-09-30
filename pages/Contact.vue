<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-12 mb-2">
        <div class="row breadcrumbs-top">
          <div class="col-12">
            <h4 class="content-header-title mb-0">Precisa falar conosco?</h4>
            <button
              @click="callOnWhatsApp()"
              class="btn btn-primary mr-1 mt-1 mb-4 waves-effect waves-light"
              style="width: 230px"
            >
              <b-spinner v-if="buttonLoading" small />
              <span v-else>
                <i class="fa fa-whatsapp" aria-hidden="true"></i> Chamar no Whatsapp
              </span>
            </button>

            <h4 class="content-header-title mb-0">Ou use este formulário</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <section class="card">
        <div class="card-content">
          <div class="card-body">
            <div class="col-md-6 col-12">
              <div class="card-body">
                <form
                  class="form form-horizontal"
                  @submit.enter.prevent="sendForm()"
                >
                  <div class="form-body">
                    <div class="row">
                      <div class="col-12">
                        <div class="form-group row">
                          <div class="col-md-4">
                            <span>Seu nome</span>
                          </div>
                          <div class="col-md-8">
                            <input
                              type="text"
                              id
                              class="form-control"
                              name
                              placeholder="Nome do resposável pela compra"
                              v-model="contactName"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <div class="col-md-4">
                            <span>Sua empresa</span>
                          </div>
                          <div class="col-md-8">
                            <input
                              type="text"
                              id
                              class="form-control"
                              name
                              placeholder="Sua empresa"
                              v-model="name"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <div class="col-md-4">
                            <span>Seu email</span>
                          </div>
                          <div class="col-md-8">
                            <input
                              type="text"
                              id
                              class="form-control"
                              name
                              placeholder="Seu email"
                              v-model="email"
                              v-validate="emailRules"
                              data-vv-name="email"
                              required
                            />
                            <label
                              v-show="errors.has('email')"
                              class="danger"
                            >{{ errors.first('email') }}</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <div class="col-md-4">
                            <span>Seu Whatsapp ou telefone</span>
                          </div>
                          <div class="col-md-8">
                            <input
                              class="form-control"
                              type="text"
                              id
                              name
                              placeholder="Seu WhatsApp ou telefone"
                              v-mask="['(##) ####-####', '(##) #####-####']"
                              v-model="phone"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-group row">
                          <div class="col-md-4">
                            <span>Mensagem</span>
                          </div>
                          <div class="col-md-8">
                            <textarea
                              class="form-control"
                              id
                              rows="4"
                              v-model="message"
                              placeholder="Mensagem"
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-8 offset-md-4">
                        <button
                          type="submit"
                          class="btn btn-primary mr-1 mb-1 waves-effect waves-light"
                        >
                        <b-spinner v-if="submitLoading" small />
                        <span v-else>Enviar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <vs-popup title="Mensagem enviada!" :active.sync="open">
      <div class="row m-0 pb-2 d-flex justify-content-center">
        <i class="feather icon-check-circle" style="font-size: 7em; color: #0cb695;"></i>
      </div>
      <div class="row m-0 pb-0 d-flex justify-content-center">
        <h6>Muito obrigado.</h6>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <h6>O quanto antes vamos ler sua mensagem.</h6>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import { mapState, mapActions } from "vuex";

export default {
  name: "Contact",
  data() {
    return {
      contactName: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      client: false,
      open: false,
      buttonLoading: false,
      submitLoading: false
    };
  },
  mounted() {
    if (this.$auth.check()) {
      this.contactName = this.$auth.user().contactName
      this.name = this.$auth.user().name
      this.email = this.$auth.user().email
      this.phone = this.$auth.user().phone
      this.message = this.$auth.user().message
      this.client = true
    }
  },
  computed: {
    ...mapState("users/contact", ["contact"]),
    emailRules() {
      const emailRules = {
        required: true,
        email: true
      };
      return emailRules;
    },
  },
  watch: {
    open(newValue, oldValue) {
      if(newValue == false && oldValue == true)
        window.location.replace("/");
    }
  },
  methods: {
    ...mapActions("users/contact", [
      "sendMail"
    ]),
    sendMessage(data) {
      if(!this.errors.has('email')) {
        this.sendMail(data).then(() => {
          this.open = true
        })
      }
    },
    callOnWhatsApp() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        var url = "https://api.whatsapp.com/send?phone="
                  + "5585989213161"
        window.open(url, '_blank')
      }, 300);

    },
    sendForm(){
      this.submitLoading = true
      setTimeout(() => {
        this.submitLoading = false
        this.sendMessage({
          contactName: this.contactName,
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.message
        })
      }, 300)
    }
  },
  directives: {
    mask,
  }
}

</script>
