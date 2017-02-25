function compile (code) {
  code = code.replace(/\s*\n+\s*/g, ' ') // collapse whitespaces
  code = Vue.compile(code) // https://vuejs.org/v2/api/#Vue-compile
  // https://vuejs.org/v2/guide/render-function.html#Template-Compilation
  code = code.staticRenderFns.toString().replace(/^function anonymous/, 'function staticRenderFns')
       + "\n"
       + code.render.toString().replace(/^function anonymous/, 'function render')
  // http://jsbeautifier.org/
  code = js_beautify(code, {wrap_line_length: 80, break_chained_methods: true})

  return code
}

const samples = [
  {
    label: 'v-model component',
    code: '<name-input v-model="fullName"></name-input>'
  },
  {
    label: 'v-model input',
    code: '<input v-model="fullName">'
  },
  {
    label: 'v-model checkbox',
    code: '<input v-model="fullName" type="checkbox">'
  }
]

// Throw error message as Exception, so I can catch Vue compilation errors
console.error = function (msg) {throw msg}

new Vue({
  el: '#app',

  data: {
    input: localStorage.getItem('input') || '<div></div>', // restore after refresh
    error: '',
    code: '',
    version: Vue.version,
    samples
  },

  mounted () {
    // convert textarea to syntax highlight editor http://codemirror.net/
    var editor = CodeMirror(document.getElementById('code'), {
      value: this.input,
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

    editor.on('change', _.debounce(cm => this.input = cm.getValue(), 500))

    this.editor = editor
  },

  computed: {
    compiled () {
      try {
        this.code = compile(this.input)
        this.error = '' // clear error if compiled
        localStorage.setItem('input', this.input) // keep code changes after refresh
      } catch (e) {
        this.error = e.toString()
      }

      return this.code
    }
  },

  methods: {
    setCode (val) {
      this.editor.setValue(val)
    }
  },

  directives: {
    highlightjs (el, binding) {
      var codeTag = el.querySelector('code')
      codeTag.innerHTML = binding.value
      hljs.highlightBlock(codeTag)
    }
  }
})
