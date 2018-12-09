// ============================================
// uimanagement.js
//
// Copyright (c) 2018 Nomotech
// Released under the MIT license.
// see https://opensource.org/licenses/MIT
// ============================================

let addButton = (str, element, callback) => {
  let btn = document.createElement('button')
  btn.textContent = str
  btn.classList.add('btn', 'btn-outline-info')
  btn.setAttribute('id', str)
  element.appendChild(btn)
  btn.onclick = callback
}

// str     : 表示文字列
// element : 追加する element
// num     : effectの番号
let addEffect = (str, element, num) => {
  let eff = document.createElement('div')
  let btn = document.createElement('button')
  btn.textContent = '✕'
  btn.classList.add('close')
  btn.setAttribute('id', str)
  btn.setAttribute('aria-hidden', 'true')
  element.appendChild(btn)
  btn.onclick = () => {
    effects = effects.filter((a) => a.num !== num)
    eff.parentNode.removeChild(eff)
  }

  eff.textContent = str
  eff.classList.add('effect', 'alert', 'alert-info', 'alert-dismissible', 'show')
  eff.setAttribute('role', 'alert')
  eff.setAttribute('id', str)
  eff.appendChild(btn)
  element.appendChild(eff)
}
