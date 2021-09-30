const stepValidation = {
  methods: {
    validateStep(stepName) {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll(stepName).then(result => {
          if (result) {
            this.$emit('update', { user: this.user })
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    }
  }
}

export default stepValidation