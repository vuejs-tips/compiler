export default function compile (code) {
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
