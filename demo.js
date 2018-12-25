// ============================================
// script.js
//
// Copyright (c) 2018 Nomotech
// Released under the MIT license.
// see https://opensource.org/licenses/MIT
// ============================================

const WIDTH  = 640 * 2
const HEIGHT = 480 * 2
const N = 2
const M = 6
const T = HEIGHT / 20

// 出力用のcanvas
const canvas = document.getElementById('canvas')
canvas.width  = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d')



let linePic
let animationFlag = false
let loop = (t) => {
  if (!animationFlag && t > 0) t = 0
  animationFlag = true
  linePic.animation(t)
  if (t > linePic.Varray.length && t > linePic.Harray.length) animationFlag = false
  if (animationFlag) {
    t += 200
    setTimeout(() => {loop(t)}, 1)
  }
}


let loadLinePicData = (path) => {
  return new Promise((resolve, reject) => {
    let httpObj = new XMLHttpRequest()
    httpObj.open("get", path, true)
    httpObj.overrideMimeType('json; charset=utf-8')
    httpObj.onload = () => {
      let linePicData = JSON.parse(httpObj.response)
      resolve(linePicData)
    }
    httpObj.send(null)
  })
}

let main = async () => {
  let imageData = ctx.createImageData(WIDTH, HEIGHT)
  for(let i = 0; i < imageData.data.length; i++) imageData.data[i] = 255
  ctx.putImageData(imageData, 0, 0)
}
main()

let startAnimation = async (image) => {
  let linePicData = await loadLinePicData(`./sampleData/${image}.json`)
  let Varray = linePicData.Varray
  let Harray = linePicData.Harray
  linePic = new LinePic(Harray, Varray, ctx)
  if (!animationFlag) {
    animationFlag = true
    loop(0)
  }
  else animationFlag = false
}

for (let b of document.getElementsByClassName("buttonList")) {
  b.onclick = async () => startAnimation(b.id)
}
