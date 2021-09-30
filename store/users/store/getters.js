export default {
  isSupplier: state => state.user.isSupplier === true,
  userEmail: state => state.user ? state.user.email : null,
}
