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

Vue.component('highlight', {
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
})

Vue.component('code-mirror', {
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
})
const samples = {
    'v-model component': '<name-input v-model="fullName"></name-input>',
    'v-model input': '<input v-model="fullName">',
    'v-model textarea': `<!-- same as input -->\n<textarea v-model="fullName"></textarea>`,
    'v-model checkbox': '<input v-model="fullName" type="checkbox">',
    'v-model radio': '<input v-model="fullName" type="radio">',
    'v-model select': '<select v-model="fullName"></select>',
    'v-bind': '<input v-bind:placeholder="inputMessage">',
    'v-on': '<input v-on:input="update">',
    'v-on($event)': '<input v-on:input="update($event)">',
    'v-on filter': `<!-- filters does not work with v-on -->\n<input v-on:input="update | debounce(500)">`,
    'v-bind with filter': '<a v-bind:href="url | slugify">login</a>',
    'v-show': '<a v-show="signedIn">logout</a>',
    'v-if': '<a v-if="signedIn">logout</a>',
    'v-else': `<nav>
  <a v-if="signedIn">logout</a>
  <a v-else>login</a>
</nav>
`,
    'v-for': `<ul><!-- v-for can't be the root element -->
  <li v-for="todo, index in todos">
    {{todo.label}}
  </li>
</ul>
`
}

// Throw error message as Exception, so I can catch Vue compilation errors
console.error = function (msg) {throw msg}

new Vue({
  el: '#app',

  data: {
    input: localStorage.getItem('input') || '<div></div>', // restore after refresh
    error: '',
    code: '',
    version: Vue.version,
    samples,
    showMenu: !!decodeURI(location.hash.substr(1)),
    selectedMenu: decodeURI(location.hash.substr(1))
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
    select (label) {
      this.input = samples[label]
      this.selectedMenu = label
    }
  }
})
