<template>
  <form data-vv-scope="step-3">
    <fieldset class="p-0">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>CEP do negócio</label>
            <input
              v-model="user.zipcode"
              v-validate="{required: true, length: 9}"
              @keyup="searchAddress"
              data-vv-name="zipcode"
              v-mask="'#####-###'"
              type="text"
              class="form-control required"
              :disabled="zipcodeDisabled"
            />
            <label class="danger">{{ errorCep === true ? "O cep informado não existe" : "" }}</label>
            <label
              v-show="errors.has('step-3.zipcode')"
              class="danger"
            >{{ errors.first('step-3.zipcode') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Estado</label>
            <input
              v-model="user.state"
              v-validate="'required'"
              data-vv-name="state"
              type="text"
              class="form-control required"
              disabled
            />
            <label
              v-show="errors.has('step-3.state')"
              class="danger"
            >{{ errors.first('step-3.state') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Município</label>
            <input
              v-model="user.city"
              v-validate="'required'"
              data-vv-name="city"
              type="text"
              class="form-control required"
              disabled
            />
            <label
              v-show="errors.has('step-3.city')"
              class="danger"
            >{{ errors.first('step-3.city') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Bairro</label>
            <input
              v-model="user.neighborhood"
              v-validate="'required'"
              data-vv-name="neighborhood"
              type="text"
              class="form-control"
              :disabled="!neighborhoodEmpty"
            />
            <label
              v-show="errors.has('step-3.neighborhood')"
              class="danger"
            >{{ errors.first('step-3.neighborhood') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Endereço</label>
            <input
              v-model="user.street"
              v-validate="'required'"
              data-vv-name="street"
              type="text"
              class="form-control"
              :disabled="!streetEmpty"
            />
            <label
              v-show="errors.has('step-3.street')"
              class="danger"
            >{{ errors.first('step-3.street') }}</label>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Número</label>
            <input
              v-model="user.addressDetails"
              placeholder="Número e complemento"
              v-validate="'required'"
              data-vv-name="address_details"
              type="text"
              class="form-control required"
            />
            <label
              v-show="errors.has('step-3.address_details')"
              class="danger"
            >{{ errors.first('step-3.address_details') }}</label>
          </div>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mask } from "vue-the-mask";

import { mapGetters } from "vuex";

import stepValidation from "@/mixins/stepValidation";

import addressFinderService from "@/utils/address";

export default {
  data() {
    return {
      userCopy: {},
      errorCep: false
    };
  },
  mounted() {
    this.user.zipcode = this.informedZipcode
    this.searchAddress()
  },
  computed: {
    ...mapGetters("navigationFilters", ["informedZipcode"]),
    zipcodeDisabled() {
      if(this.informedZipcode)
        return true
      else
        return false
    },
    userCopyEmpty() {
      return Object.keys(this.userCopy).length === 0;
    },
    neighborhoodEmpty() {
      if (!this.userCopyEmpty) {
        return !this.userCopy.neighborhood.length > 0;
      }
      return false;
    },
    streetEmpty() {
      if (!this.userCopyEmpty) {
        return !this.userCopy.street.length > 0;
      }
      return false;
    },

    fullFilledZipcode() {
      return this.user.zipcode.length === 9;
    },
  },
  methods: {
    async searchAddress() {
      this.errorCep = false
      this.disableStreet = true;
      if (this.fullFilledZipcode) {
        let address = await addressFinderService.getInformation(
          this.user.zipcode
        );
        this.errorCep = address===null ? true : false
        this.user = Object.assign(this.user, address);
        this.userCopy = Object.assign({}, this.user);
      } else {
        this.resetAddressForm();
      }
    },

    resetAddressForm() {
      this.user.state = "";
      this.user.stateId = "";
      this.user.city = "";
      this.user.street = "";
      this.user.addressDetails = "";
      this.user.neighborhood = "";
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  directives: {
    mask,
  },
  mixins: [stepValidation],
};
</script>
