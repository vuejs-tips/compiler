export default {
  template: '<div></div>',
  props: ['value'],
  mounted () {
    // convert textarea to syntax highlight editor http://codemirror.net/
    var editor = CodeMirror(this.$el, {
      value: this.value,
      mode: "text/html", // https://github.com/codemirror/CodeMirror/blob/5.24.0/mode/xml/index.html#L41
      theme: 'material', // https://codemirror.net/demo/theme.html#material
      tabSize: 2 // http://codemirror.net/doc/manual.html#config
    })

    // fix cursor position after google font family has loaded
    // https://github.com/codemirror/CodeMirror/issues/3764#issuecomment-171560662
    window.addEventListener('load', function () {
      editor.getWrapperElement().style.fontSize = '16px'
      editor.refresh()
    })

    editor.on('change', cm => this.$emit('input', cm.getValue()))
    this.editor = editor
  },
  watch: {
    value (val) {
      if (val === this.editor.getValue()) return // changed from inside
      this.editor.setValue(val)
    }
  }
}
