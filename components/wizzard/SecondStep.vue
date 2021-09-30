<template>
  <form data-vv-scope="step-2">
    <fieldset class="p-0">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Qual é o seu nome?</label>
            <input
              v-model="user.contactName"
              v-validate="'required'"
              data-vv-name="contact_name"
              placeholder="Como você gostaria de ser chamado?"
              type="text"
              class="form-control required"
            />
            <label
              v-show="errors.has('step-2.contact_name')"
              class="danger"
            >{{ errors.first('step-2.contact_name') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Qual seu Whatsapp / Telefone?</label>
            <input
              v-model="user.phone"
              v-validate="{ required: true, min: 14, max: 15 }"
              data-vv-name="phone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              name="phone"
              placeholder="De preferência do comprador"
              type="text"
              class="form-control required"
            />
            <label
              v-show="errors.has('step-2.phone')"
              class="danger"
            >{{ errors.first('step-2.phone') }}</label>
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mask } from "vue-the-mask";

import stepValidation from "@/mixins/stepValidation";

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  directives: {
    mask
  },
  mixins: [stepValidation]
};
</script>
