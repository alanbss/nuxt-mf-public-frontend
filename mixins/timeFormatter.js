const timeFormatter = {
  methods: {
    remainingTime(time) {
      if(time > 0) {
        var d = Number(time)

        var h = Math.floor(d / 3600)
        var m = Math.floor(d % 3600 / 60)

        return ('0' + h).slice(-2) + "h" + ('0' + m).slice(-2) + "m"
      } else {
        return null
      }
    }
  }
}

export default timeFormatter
