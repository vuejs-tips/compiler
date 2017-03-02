import samples from './samples'
import CodeMirror from './components/CodeMirror'
import Highlight from './components/Highlight'
import compile from './components/compiler'

// Throw error message as Exception, so I can catch Vue compilation errors
console.error = function (msg) {throw msg}

var urlParam = decodeURI(location.hash.substr(1))
var input = urlParam ? samples[urlParam] || atob(urlParam) : localStorage.getItem('input') || '<div></div>'

new Vue({
  el: '#app',
  components: {CodeMirror, Highlight},

  data: {
    input: input, // restore after refresh
    error: '',
    code: '',
    vueVersion: Vue.version,
    version: process.env.VERSION,
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
