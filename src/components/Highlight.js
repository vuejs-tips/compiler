export default {
  template: '<pre><code class="javascript"></code></pre>',
  props: ['code'],
  mounted () {
    this.refresh()
  },
  watch: {
    code () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      var codeTag = this.$el.querySelector('code')
      codeTag.innerHTML = this.code
      hljs.highlightBlock(codeTag)
    }
  }
}
