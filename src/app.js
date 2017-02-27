function compile (code) {
  code = code.replace(/\s*\n+\s*/g, ' ') // collapse whitespaces
  code = code.replace(/>\s+/g, '>').replace(/\s+</g, '<') // collapse whitespaces between close/open tags
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
var samples = {
    'custom': '<!-- type your html here -->',
    'v-model': '<name-input v-model="fullName"></name-input>',
    'v-model_input': '<input v-model="fullName">',
    'v-model_textarea': `<!-- same as input -->\n<textarea v-model="fullName"></textarea>`,
    'v-model_checkbox': '<input v-model="fullName" type="checkbox">',
    'v-model_radio': '<input v-model="fullName" type="radio">',
    'v-model_select': '<select v-model="fullName"></select>',
    'v-on': '<input v-on:input="update">',
    'v-on-event': '<input v-on:input="update($event)">',
    'v-on_filter': `<!-- filters does not work with v-on -->\n<input v-on:input="update | debounce(500)">`,
    'v-bind_filter': '<textarea v-bind:value="message | truncate(140)"></textarea>',
    'v-bind': '<input v-bind:placeholder="inputMessage">',
    'v-pre': `<textarea v-pre>{{noCompilation}}</textarea>`,
    'v-cloak': `<div v-cloak></div>`,
    'v-once': `<div v-once></div>`,
    'v-text': `<span v-text="msg"></span>`,
    'v-html': `<div v-html="html"></div>`,
    'v-show': '<a v-show="signedIn">logout</a>',
    'v-if': '<a v-if="signedIn">logout</a>',
    'v-else': `<nav>
  <a v-if="signedIn">logout</a>
  <a v-else>login</a>
</nav>
`,

  'v-else-if': `<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>`,

'v-for': `<ul><!-- v-for can't be the root element -->
  <li v-for="todo, index in todos">
    {{todo.label}}
  </li>
</ul>
`,

  'slot': `<div>
  <slot>
    content
  </slot>
  <slot name="footer">
    copyright
  </slot>
</div>`,

  'slot-scoped': `<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>`,

  'inline-template': `<my-component inline-template>
  <div>
    content
  </div>
</my-component>`,

  'component-is': `<component is="OtherComponent"></component>`
}

// Throw error message as Exception, so I can catch Vue compilation errors
console.error = function (msg) {throw msg}

var urlParam = decodeURI(location.hash.substr(1))
var input = urlParam ? samples[urlParam] || atob(urlParam) : localStorage.getItem('input') || '<div></div>'

new Vue({
  el: '#app',

  data: {
    input: input, // restore after refresh
    error: '',
    code: '',
    version: Vue.version,
    samples,
    showMenu: !!samples[urlParam],
    selectedMenu: urlParam
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
    },

    url () {
      return location.protocol + '//' + location.host + location.pathname
    },

    shareUrl () {
      return this.url + '#' + btoa(this.input)
    }
  },

  methods: {
    select (label) {
      this.input = samples[label]
      this.selectedMenu = label
    }
  }
})
