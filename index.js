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
const T = HEIGHT / 30

// 元画像canvas
const originCanvas = document.getElementById('origin')
originCanvas.width  = WIDTH
originCanvas.height = HEIGHT
const originCtx = originCanvas.getContext('2d')

// buffer用canvas
// const VCanvas = document.getElementById('buffV')
const VCanvas = document.createElement('canvas')
VCanvas.width  = WIDTH
VCanvas.height = HEIGHT
const VCtx = VCanvas.getContext('2d')

// buffer用canvas
// const HCanvas = document.getElementById('buffH')
const HCanvas = document.createElement('canvas')
HCanvas.width  = WIDTH
HCanvas.height = HEIGHT
const HCtx = HCanvas.getContext('2d')

// 出力用のcanvas
const canvas = document.getElementById('canvas')
canvas.width  = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d')


let linePic
let animationFlag = false
let loop = (linePic, t) => {
  if (!animationFlag) t = 0
  animationFlag = true
  linePic.animation(t)
  if (t > linePic.Varray.length && t > linePic.Harray.length) animationFlag = false
  if (animationFlag) {
    t += 160
    setTimeout(() => {loop(linePic, t)}, 1)
  }
}

let main = async (image) => {
  console.log(image.files[0])
  await loadImage(image.files[0])
  let imageDataV = originCtx.getImageData(0, 0, WIDTH, HEIGHT)
  let imageDataH = originCtx.getImageData(0, 0, WIDTH, HEIGHT)
  let imageData = ctx.createImageData(WIDTH, HEIGHT)
  for(let i = 0; i < imageData.data.length; i++) imageData.data[i] = 255
  ctx.putImageData(imageData, 0, 0)
  gray(imageDataV.data)
  gray(imageDataH.data)

  // ------------------------------------< V >------------------------------------
  sobelV(imageDataV.data)
  lineFilterV(imageDataV.data, N)
  threshold(imageDataV.data, 20)

  // VCtx.globalAlpha = 1
  // VCtx.putImageData(imageDataV, 0, 0)  // 画像データを出力用のcanvasに
  // VCtx.restore()
  // VCtx.save()

  // ------------------------------------< H >------------------------------------
  sobelH(imageDataH.data)
  lineFilterH(imageDataH.data, N)
  threshold(imageDataH.data, 20)

  // HCtx.globalAlpha = 1
  // HCtx.putImageData(imageDataH, 0, 0)  // 画像データを出力用のcanvasに
  // HCtx.restore()
  // HCtx.save()

  // ------------------------------------< result >------------------------------------
  linePicData = makeLinePicData(imageDataH.data, imageDataV.data)
  Harray = linePicData.Harray
  Varray = linePicData.Varray
  console.log(Harray.length * (2 * N + 1) * (2 * N + 1) / imageData.data.length)
  console.log(Varray.length * (2 * N + 1) * (2 * N + 1) / imageData.data.length)

  linePic = new LinePic(Harray, Varray, ctx)
}

document.getElementById("resetBtn").onclick = () => {
  if (!animationFlag) loop(linePic, 0)
  else animationFlag = false
  console.log(animationFlag)
}
