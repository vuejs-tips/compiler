export default function (el) {
  ['focus', 'mouseup', 'keyup'].map(type => {
    el.addEventListener(type, evt => {
      evt.target.select()
      evt.preventDefault()
    })
  })
}
