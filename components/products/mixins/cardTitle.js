const cardTitle = {
  computed: {
    productCardTitle() {
      return `${this.productBrandName}${this.productLineName}${this.productLineExtensionName}`;
    },
    productCardTitleWithBreaks() {
      return `${this.productBrandName}${this.productLineName}${this.productLineExtensionName}`;
    },
    productBrandName() {
      return this.product.brandName || "(marca não def.)";
    },
    productLineName() {
      return this.extractPropertyName(this.product.productLineName);
    },
    productLineExtensionName() {
      return this.extractPropertyName(this.product.productLineExtensionName);
    },
  },
  methods: {
    extractPropertyName(name) {
      return name ? `, ${name}` : "";
    },
    quantifiers(limitUnit = false) {
      let packagingName = this.product.packagingName;

      var unitText = 'und'

      if(limitUnit)
        unitText = 'u'

      if (packagingName) {
        if(packagingName == 'Und.' && this.product.quantity == 1)
          return `${this.product.unitsOfMeasurementName}`;
        else if(this.product.packageQuantity && this.product.packageQuantity > 1)
          return `${this.product.packagingName} ${this.product.quantity} ${this.product.unitsOfMeasurementName} (${this.product.packageQuantity} ${unitText})`;
        else
          return `${this.product.packagingName} ${this.product.quantity} ${this.product.unitsOfMeasurementName}`;
      } else {
        return `${this.product.unitsOfMeasurementName}`;
      }
    },
  },
}

export default cardTitle;
