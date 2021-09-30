<template>
  <div>
    <div class="input-group mt-2">
      <div class="input-group-prepend">
        <span class="input-group-text">Opção {{optionNumber}}</span>
      </div>
      <input
        :id="`payment-method-${optionNumber}`"
        type="text"
        v-model="paymentMethod.paymentMethod"
        v-validate="methodRules"
        data-vv-name="payment_method"
        class="form-control"
        placeholder="Escreva uma forma de pagamento"
        required
        @focusout="editPaymentMethod({paymentMethod: paymentMethod, optionNumber: optionNumber})"
      />
      <div v-if="moreThanOneElement" class="input-group-append">
        <span class="input-group-text">
          <a
           :id="`payment-method-delete-${optionNumber}`"
            @click.prevent="removePaymentMethod({paymentMethod: paymentMethod, optionNumber: optionNumber})"
            href="#"
            title="Excluir"
            class="text-body"
          >
            <i class="feather icon-trash-2 font-medium-2"></i>
          </a>
        </span>
      </div>
    </div>
    <div class="row mb-0">
      <p v-show="errors.has('payment_method')" class="danger font-small-2 ml-2 mb-0">{{
        errors.first("payment_method")
      }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaymentMethod",
  computed: {
    ...mapState("suppliers", ["paymentMethods"]),
    moreThanOneElement() {
      return this.optionNumber > 1;
    },
    replaceSpecialChars() {
      let existing = [...this.existingMethods]
      let noSpecial = existing.map(str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

      return noSpecial;
    },
    includeLowerCase() {
      let existing = this.existingMethods
      let allLower = existing.map(v => v.toLowerCase())
      return existing.concat(allLower)
    },
    lowerCaseAndSpecial() {
      return this.includeLowerCase.concat(this.replaceSpecialChars)
    },
    existingMethods() {
      let existing = [...this.paymentMethods]
      let index = null
      for(let i = 0; i < existing.length; i++) {
        if(existing[i] === this.paymentMethod) {
          index = i
        }
      }
      if(index != null)
        existing.splice(index, 1)
      return existing.map(method => method.paymentMethod)
    },
    methodRules() {
      const methodRules = {
        excluded: this.lowerCaseAndSpecial,
        required: true,
      };
      return methodRules;
    },
  },
  methods: {
    ...mapActions("suppliers", ["removePaymentMethod", "editPaymentMethod"]),
  },
  props: {
    paymentMethod: {
      type: Object,
      required: true,
    },
    optionNumber: {
      type: Number,
      required: true,
    },
  },
};
</script>
