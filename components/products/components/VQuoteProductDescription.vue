<template>
  <span class="font-small-2" ref="secondaryCharacteristics" style="color: #333; margin-top: 10px;">
    <div ref="heightTest" style="visibility: hidden;">a</div>
    <div
      v-for="(char, index) in secondary"
      :key="char + index"
      :ref="'char' + index"
      class="div-char"
      style="margin-bottom: 5px;"
    >
      <span class="char-name" v-if="index <= lastElem">{{ char }}</span>
      <span ref="seeMore" class="see-more" v-if="printSeeMore(index)">
        <a v-if="!mobileBrowser" href="javascript:void(0)"> Ver mais</a>
        <a v-else href="javascript:void(0)"> Mais</a>
      </span>
    </div>

  </span>
</template>

<script>
import VPopoverProductCard from "@/resources/products/components/VPopoverProductCard";
import VClamp from "vue-clamp";

export default {
  name: "VQuoteProductDescription",
  data() {
    return {
      maxLines: 3,
      lastElem: 5,
      secondary: [],
      heightSize: 0,
      showSeeMore: false,
      printedLines: 0,
      charsPerLine: 20,
      overflow: false,
      overFlowedLines: 0,
      mobileBrowser: false,
    }
  },
  created() {
    this.isMobile()
    this.secondary = [...this.product.secondaryCharacteristics]
    //this.secondary.sort()
  },
  mounted() {
    this.heightSize = this.$refs.heightTest.offsetHeight
    this.$refs.heightTest.style.display = 'none'

    setTimeout(() => {
      var totalHeight = this.$refs.secondaryCharacteristics.getBoundingClientRect().height
      var lines = 0
      var elems = this.$refs.secondaryCharacteristics.getElementsByClassName('div-char')
      for(var i = 0; i < elems.length; i++) {
        var elemLines = elems[i].offsetHeight / this.heightSize
        this.printedLines += elemLines
        if(this.printedLines > this.maxLines) {
          if(elemLines > 1) {
            this.lastElem = i
            this.overFlowedLines = elemLines - 1
          }
          else
            this.lastElem = i - 1
          this.overflow = true
          break
        } else if (this.printedLines == this.maxLines) {
          this.lastElem = i
          if(i < (elems.length - 1))
            this.overflow = true
          break
        }
      }
      if(totalHeight)
        lines = totalHeight / this.heightSize
      this.manageLines(this.lastElem, this.overflow)
    }, 400)

  },
  computed: {
    seeMoreText() {
      if(this.mobileBrowser)
        return '... Mais'
      else
        return '... Ver mais'
    }
  },
  watch: {

  },
  methods: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    manageLines(last, overflow) {
      var name = 'char' + last

      if(this.$refs[name] && this.$refs[name][0].offsetHeight > this.heightSize) {
        var text = this.$refs[name][0].getElementsByClassName('char-name')[0].innerText
        var sliceFromEnd = (this.overFlowedLines * this.charsPerLine)

        if(this.overFlowedLines) {
          this.reduceLine(name, this.overFlowedLines)
        }
        else
          this.reduceString(name)
        // if(((text.length % this.charsPerLine) > (this.charsPerLine - 10)))
        //   this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = text.slice(0, -12) + '... '
      } else if(this.$refs[name]) {
        this.reduceString(name)
      }
    },
    reduceString(name) {
      var text = this.$refs[name][0].getElementsByClassName('char-name')[0].innerText
      var heightBefore = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
      this.$refs[name][0].getElementsByClassName('char-name')[0].innerText += this.seeMoreText
      var heightAfter = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
      this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = text
      var textBefore = text
      var i = 0
      while(heightAfter > heightBefore && this.overflow && i < 15) {
        this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = textBefore.slice(0, -2)
        heightBefore = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
        this.$refs[name][0].getElementsByClassName('char-name')[0].innerText += this.seeMoreText
        heightAfter = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
        textBefore = this.$refs[name][0].getElementsByClassName('char-name')[0].innerText.slice(0, -12)
        i++
      }
      if(this.overflow)
        this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = textBefore + '...'
    },
    reduceLine(name, lines) {
      var i = 0
      while(i < lines) {
        var textBefore = this.$refs[name][0].getElementsByClassName('char-name')[0].innerText
        var heightBefore = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
        this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = textBefore.slice(0, -2)
        var heightAfter = this.$refs[name][0].getElementsByClassName('char-name')[0].offsetHeight
        if(heightAfter < heightBefore)
          i++
      }
      this.$refs[name][0].getElementsByClassName('char-name')[0].innerText = this.$refs[name][0].getElementsByClassName('char-name')[0].innerText.slice(0, 2) + '... '
    },
    printSeeMore(index) {
      if (index == (this.lastElem) && this.overflow)
        return true
      else
        return false
    }
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    showComments: {
      type: Boolean,
    },
  },
  components: {
    // VClamp,
    // VPopoverProductCard,
  },
};
</script>
