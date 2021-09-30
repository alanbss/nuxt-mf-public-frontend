<template>
  <a @click="active=true" class="dropdown-item">
    <i class="feather icon-user"></i> Conta de usuário
    <vs-popup title="Conta de usuário" :active.sync="active">
      <form @submit.enter.prevent="submit">
        <div class="form-body">
          <div class="row">
            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="text"
                    id="contactName"
                    class="form-control"
                    name="contactName"
                    placeholder="Nome do responsável pela compra"
                    v-model="user.contactName"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input

                    type="text"
                    id="whatsapp"
                    class="form-control"
                    name="whatsapp"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    placeholder="WhatsApp"
                    v-model="user.whatsapp"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="text"
                    id="phone"
                    class="form-control"
                    name="phone"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    placeholder="Telefone"
                    v-model="user.phone"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="email"
                    id="email"
                    class="form-control"
                    name="email"
                    placeholder="Email"
                    v-model="user.email"
                    disabled
                    required
                  />
                  <small>
                    <i>Para mudanças no email, contate nossa equipe</i>
                  </small>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <hr class="mt-0" />
                  <p class="m-0 mt-2 font-weight-bold">
                    Quer mudar a senha?
                    <a
                      @click.prevent="collapse = !collapse"
                      style="color: #007bff;"
                    >Clique aqui</a>
                  </p>
                </div>
              </div>
            </div>

            <div v-if="collapse" class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="password"
                    id="newPassword"
                    class="form-control"
                    name="newPassword"
                    placeholder="Cadastre uma nova senha"
                    v-model="newPassword"
                  />
                </div>
              </div>
            </div>

            <div v-if="collapse" class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="password"
                    id="confirmNewPassword"
                    class="form-control"
                    name="confirmNewPassword"
                    placeholder="Confirme a nova senha"
                    v-model="confirmNewPassword"
                  />
                  <label class="danger">{{ passMsg() }}</label>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <hr class="mt-0" />
                  <p class="m-0 mt-2 font-weight-bold">Confirme as modificações digitando sua senha</p>
                  <label class="danger">{{ passwordIncorrect }}</label>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <input
                    type="password"
                    id="currentPassword"
                    class="form-control"
                    name
                    placeholder="Confirme sua senha atual"
                    v-model="user.currentPassword"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-md-12">
              <button
                type="submit"
                class="btn btn-primary mr-1 mb-1 waves-effect waves-light"
                :disabled="!passMatch()"
              >Salvar</button>
            </div>
          </div>
        </div>
      </form>
    </vs-popup>
  </a>
</template>


<script>
import { mapActions } from "vuex";
import { mask } from "vue-the-mask";

export default {
  name: "Account",
  data() {
    return {
      user: {},
      passwordIncorrect: "",
      newPassword: "",
      confirmNewPassword: "",
      active: false,
      collapse: false,
    };
  },
  mounted() {
    this.user = JSON.parse(JSON.stringify(this.$auth.user()));
    Object.assign(this.user, { password: "", currentPassword: "" });
  },
  computed: {
    infoMessage() {
      return `Atualização de dados Bem Sucedida!`;
    },
  },
  methods: {
    passMatch() {
      return this.newPassword === this.confirmNewPassword;
    },
    passMsg() {
      if (
        !this.passMatch() &&
        this.newPassword.length < 5 &&
        this.newPassword.length > 0
      )
        return "suas senhas não estão iguais e não possuem o tamanho mínimo";
      else if (this.newPassword.length < 5 && this.newPassword.length > 0)
        return "sua senha não possuem o tamanho mínimo";
      else if (!this.passMatch()) return "suas senhas não estão iguais";
      else return "";
    },
    async submit() {
      try {
        this.newPassword.length > 5
          ? (this.user.password = this.newPassword)
          : "",
        await this.$http.put("/user_auth", { user: this.user });
        this.active = false;
        this.$auth.user().contactName = this.user.contactName;
        this.$auth.user().whatsapp = this.user.whatsapp
        this.$auth.user().phone = this.user.phone
        this.notifyInfo(this.infoMessage, "feather icon-check-circle");
      } catch (error) {
        if (error.response.status === 422)
          this.passwordIncorrect = "A senha informada está incorreta!";
      }
    },

    ...mapActions("users", ["setUser"]),
  },
    directives: {
    mask
  },
};
</script>
