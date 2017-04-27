export default {
    'custom': '<!-- type your html here -->',
    'sync': '<comp :foo.sync="bar"></comp>',
    'v-model': '<name-input v-model="fullName"></name-input>',
    'v-model_input': '<input v-model="fullName">',
    'v-model_textarea': `<!-- same as input -->\n<textarea v-model="fullName"></textarea>`,
    'v-model_checkbox': '<input v-model="fullName" type="checkbox">',
    'v-model_radio': '<input v-model="fullName" type="radio">',
    'v-model_select': '<select v-model="fullName"></select>',
    'v-model.trim': '<input v-model.trim="fullName">',
    'v-model.lazy': '<input v-model.lazy="fullName">',
    'v-model.number': '<input type="number" v-model.number="price">',
    'v-on': '<input v-on:input="update">',
    'v-on-event': '<input v-on:input="update($event)">',
    'v-on.prevent': '<input v-on:input.prevent="update">',
    'v-on.native': '<input v-on:input.native="update">',
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
