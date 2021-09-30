export default {
  servesCNPJ: state => state.supplierServes === "PJ" ? true : false,
  abbreviation: state => (state.supplierServes === "PJ" || localStorage.serves_type === "PJ") ? "CNPJ" : "CPF",
  informedZipcode: state => state.cep ? state.cep : localStorage.cep,
  informedCity: state => state.city,
  informedUF: state => state.region.uf ? state.region.uf : localStorage.uf,
  allowEntrance: state => state.allowed ? state.allowed : localStorage.allowed,
  params: state => {
    if(state.region.id && state.supplierServes) {
      return {
        region_id: state.region.id,
        serves_type: state.supplierServes
      }
    } else {
      return {
        region_id: localStorage.region_id,
        serves_type: localStorage.serves_type
      }
    }
  }
}
