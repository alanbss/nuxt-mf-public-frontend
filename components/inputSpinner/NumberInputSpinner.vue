<template>
  <div class='vnis' >
    <span v-if="isMobile || forceBreakLine">
      <div class="row pl-0 pr-2" style="width: auto; justify-content: center;">
        <div style="width: auto">
          <button
              @click='decreaseNumber'
              :disabled="disabled"
              style="height: 100%;"
              :class='buttonClass'>-</button>
        </div>
        <div style="width: 60%; background-color: #e7e9ec;">
          <input
              v-if="integerOnly"
              type='text'
              inputMode="numeric"
              pattern="[0-9]*"
              v-bind:value='numericValue'
              @keypress='validateInput'
              @input='inputValue'
              :readonly="readOnly"
              :disabled="disabled"
              :class='inputClass'
              style="background-color: #e7e9ec; width: 70px;"
              :min='min'
              :max='max'
              debounce='500'
          />
          <input
              v-else
              type='text'
              inputMode="numeric"
              v-bind:value='numericValue'
              @keypress='validateInput'
              @input='inputValue'
              :disabled="disabled"
              :class='inputClass'
              style="background-color: #e7e9ec; min-width: 60px;"
              :min='min'
              :max='max'
              debounce='500'
          />
          <span v-if="printText && printText != 'null null null'" class="font-small-1" style="text-align: center; width: 70px; float: left; margin: 0px; background-color: #e7e9ec; padding: 0px 5px 3px 3px; color: #474747;">
            {{ printText }}
          </span>
        </div>
        <div style="width: auto">
          <button
              @click='increaseNumber'
              :disabled="disabled"
              style="height: 100%;"
              :class='buttonClass'>+</button>
            </div>
      </div>
    </span>
    <span v-else>
      <button
          @click='decreaseNumber'
          :disabled="disabled"
          :class='buttonClass'>-</button>

      <input
          v-if="integerOnly"
          type='text'
          inputMode="numeric"
          pattern="[0-9]*"
          v-bind:value='numericValue'
          @keypress='validateInput'
          @input='inputValue'
          :readonly="readOnly"
          :disabled="disabled"
          :class='inputClass'
          style="background-color: #e7e9ec;"
          :min='min'
          :max='max'
          debounce='500'
      />
      <input
          v-else
          type='text'
          inputMode="numeric"
          v-bind:value='numericValue'
          @keypress='validateInput'
          @input='inputValue'
          :disabled="disabled"
          :class='inputClass'
          style="background-color: #e7e9ec;"
          :min='min'
          :max='max'
          debounce='500'
      />
      <span v-if="printText && printText != 'null null null'" class="font-small-2" style="float: left; margin: 0px; background-color: #e7e9ec; padding: 3px 5px 3px 3px; color: #474747;">
        {{ printText }}
      </span>

      <button
          @click='increaseNumber'
          :disabled="disabled"
          :class='buttonClass'>+</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'NumberInputSpinner',
  data: function() {
    return {
      numericValue: this.value,
      timer: null,
      onMinus: false,
      onPlus: false
    };
  },
  props: {
    value: {
      type: String,
      default: '0'
    },
    min: {
      default: 0,
      type: Number
    },
    max: {
      default: 10,
      type: Number
    },
    step: {
      default: 1,
      type: Number
    },
    mouseDownSpeed: {
      default: 500,
      type: Number
    },
    inputClass: {
      default: 'vnis__input',
      type: String
    },
    buttonClass: {
      default: 'vnis__button',
      type: String
    },
    printText: {
      default: '',
      type: String
    },
    integerOnly: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    readOnly: {
      default: false,
      type: Boolean
    },
    forceBreakLine: {
      default: false,
      type: Boolean
    },
  },
  methods: {
    leftMinus() {
      this.onMinus = false
    },
    leftPlus() {
      this.onPlus = false
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    whileMouseDown(callback) {
      if (this.timer === null && (this.onPlus || this.onMinus)) {
        this.timer = setInterval(() => {
          callback();
        }, this.mouseDownSpeed);
      }
    },
    increaseNumber() {
      this.numericValue = String(Number(this.numericValue) + this.step)
    },
    decreaseNumber() {
      this.numericValue = String(Number(this.numericValue) - this.step)
    },
    isInteger(evt) {
      evt = evt ? evt : window.event;
      let key = evt.keyCode || evt.which;
      key = String.fromCharCode(key);
      const regex = /[0-9]/;
      if (!regex.test(key)) {
        evt.returnValue = false;
        if (evt.preventDefault) evt.preventDefault();
      }
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 44
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    validateInput(evt) {
      if (this.integerOnly === true) {
        this.isInteger(evt);
      } else {
        this.isNumber(evt);
      }
    },
    inputValue(evt) {
      this.numericValue = evt.target.value.replace(',', '.')
        ? evt.target.value.replace(',', '.')
        : String(this.min);
    }
  },
  computed: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    numericValue: function(val, oldVal) {
      if (parseFloat(val) <= this.min) {
        this.numericValue = String(this.min);
      }
      if (parseFloat(val) >= this.max) {
        this.numericValue = String(this.max);
      }
      if (parseFloat(val) <= this.max && parseFloat(val) >= this.min) {
        this.$emit('input', val, oldVal);
      }
    }
  }
};
</script>
