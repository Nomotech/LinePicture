// ============================================
// script.js
//
// Copyright (c) 2018 Nomotech
// Released under the MIT license.
// see https://opensource.org/licenses/MIT
// ============================================

const WIDTH  = 640 * 1.5
const HEIGHT = 480 * 1.5
const N = 2
const M = 6

// 元画像canvas
const originCanvas = document.getElementById('origin')
originCanvas.width  = WIDTH
originCanvas.height = HEIGHT
const originCtx = originCanvas.getContext('2d')

// buffer用canvas
const VCanvas = document.getElementById('buffV')
VCanvas.width  = WIDTH
VCanvas.height = HEIGHT
const VCtx = VCanvas.getContext('2d')

// buffer用canvas
const HCanvas = document.getElementById('buffH')
HCanvas.width  = WIDTH
HCanvas.height = HEIGHT
const HCtx = HCanvas.getContext('2d')

// 出力用のcanvas
const canvas = document.getElementById('canvas')
canvas.width  = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d')

let array = new Array(WIDTH * HEIGHT * 4)
for (let i = 0; i < array.length; i++) {
  array[i] = 100
}

let Varray = []
let Harray = []

// -------------------------< 画像処理をするloop処理 >-------------------------
let imageData

let loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      originCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
      resolve(img)
    }
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

let copyImage = (image, data) => {
  for (let i = 0; i < data.length; i += 1) {
    image[i] = data[i]
  }
}

let loop = (t) => {
  for(let i = 0; i < t; i += 1) {
    if (i < Varray.length) imageData.data[Varray[i]] -= 255
    if (i < Harray.length) imageData.data[Harray[i]] -= 255
  }

  ctx.globalAlpha = 1
  ctx.putImageData(imageData, 0, 0)  // 画像データを出力用のcanvasに
  ctx.restore();
  ctx.save()
  t += 40
  if (t > Varray.length && t > Harray.length) {
    // t = 0
    // for(let i = 0; i < imageData.data.length; i++) imageData.data[i] = 255
  } else {
    setTimeout(`loop(${t})`, 1)
  }
  // requestAnimationFrame(loop)
}

let sortLine = (data) => {
  data = data.sort((a, b) => {
    let x = a.len;
    let y = b.len;
    if (x > y) return -1;
    if (x < y) return 1;
    return 0;
  })
}


window.onload = async () => {
  await loadImage('chizuke.jpg')
  imageDataV = originCtx.getImageData(0, 0, WIDTH, HEIGHT)
  imageDataH = originCtx.getImageData(0, 0, WIDTH, HEIGHT)
  imageData  = originCtx.getImageData(0, 0, WIDTH, HEIGHT)
  for(let i = 0; i < imageData.data.length; i++) imageData.data[i] = 255
  gray(imageDataV.data)
  gray(imageDataH.data)

  // ------------------------------------< V >------------------------------------
  sobelV(imageDataV.data)
  lineFilterV(imageDataV.data, N, 5)
  threshold(imageDataV.data, 20)

  // VCtx.globalAlpha = 1
  // VCtx.putImageData(imageDataV, 0, 0)  // 画像データを出力用のcanvasに
  // VCtx.restore()
  // VCtx.save()

  // ------------------------------------< H >------------------------------------
  sobelH(imageDataH.data)
  lineFilterH(imageDataH.data, N, 100)
  threshold(imageDataH.data, 20)

  // HCtx.globalAlpha = 1
  // HCtx.putImageData(imageDataH, 0, 0)  // 画像データを出力用のcanvasに
  // HCtx.restore()
  // HCtx.save()

  // ------------------------------------< result >------------------------------------
  for(let i = 0; i < array.length; i += 1) {
    array[i] = imageDataV.data[i] + imageDataH.data[i]
  }
  reversal(array)


  let len = 0
  let line = { len : 0, array : [] }
  let lineList = []
  for (let y = N + 1; y < HEIGHT - 1; y += 1) {
    for (let x = N + 1; x < WIDTH - 1; x++) {
      if (imageDataH.data[((x + 1) + (y + 1) * WIDTH) * 4] > 0) {
        index = ((x + 1) + (y + 1) * WIDTH) * 4
        line.len++;
        line.array.push(index, index+1, index+2)
      } else if (line.len > 0) {
        lineList.push({len:line.len, array:line.array})
        line = {len: 0, array: []}
      }
    }
  }
  sortLine(lineList)
  for (let l of lineList) Harray = Harray.concat(l.array)

  for (let x = N + 1; x < WIDTH - 1; x+= 1) {
    for (let y = N + 1; y < HEIGHT - 1; y ++) {
      if (imageDataV.data[((x + 1) + (y + 1) * WIDTH) * 4] > 0) {
        index = ((x + 1) + (y + 1) * WIDTH) * 4
        line.len++;
        line.array.push(index, index+1, index+2)
      } else if (line.len > 0) {
        lineList.push({len:line.len, array:line.array})
        line = {len: 0, array: []}
      }
    }
  }
  sortLine(lineList)
  for (let l of lineList) Varray = Varray.concat(l.array)


  loop(0)

  // copyImage(imageData.data, array)
};
