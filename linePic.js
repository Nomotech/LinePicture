// ============================================
// script.js
//
// Copyright (c) 2018 Nomotech
// Released under the MIT license.
// see https://opensource.org/licenses/MIT
// ============================================



// -------------------------< 画像処理をするloop処理 >-------------------------
let loadImage = (file) => {
  return new Promise((resolve, reject) => {
    let fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = (evt) => {
      console.log(evt)
      let img = new Image();
      img.src = evt.target.result
      img.onload = () => {
        originCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
        resolve(img)
      }
      img.onerror = (e) => reject(e)
    }
  })
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


let makeLinePicData = (Hdata, Vdata) => {
  let Varray = []
  let Harray = []
  let len = 0
  let line = { len : 0, array : [] }
  let lineList = []
  for (let y = N + 2; y < HEIGHT - 2; y += 1) {
    for (let x = N + 2; x < WIDTH - 2; x++) {
      if (Hdata[((x + 1) + (y + 1) * WIDTH) * 4] > 0) {
        index = ((x + 1) + (y + 1) * WIDTH) * 4
        line.len++;
        line.array.push(index, index+1, index+2)
      } else if (line.len > 0) {
        lineList.push({len:line.len, array:line.array})
        line = {len: 0, array: []}
      }
    }
  }
  // sortLine(lineList)
  for (let l of lineList) if (l.len > T)  Harray = Harray.concat(l.array)
  for (let l of lineList) if (l.len <= T) Harray = Harray.concat(l.array)
  lineList = []


  for (let x = N + 2; x < WIDTH - 2; x+= 1) {
    for (let y = N + 2; y < HEIGHT - 2; y ++) {
      if (Vdata[((x + 1) + (y + 1) * WIDTH) * 4] > 0) {
        index = ((x + 1) + (y + 1) * WIDTH) * 4
        line.len++;
        line.array.push(index, index+1, index+2)
      } else if (line.len > 0) {
        lineList.push({len:line.len, array:line.array})
        line = {len: 0, array: []}
      }
    }
  }
  // sortLine(lineList)
  for (let l of lineList) if (l.len > T * 2)  Varray = Varray.concat(l.array)
  for (let l of lineList) if (l.len < T * 2 && l.len > T)  Varray = Varray.concat(l.array)
  for (let l of lineList) if (l.len <= T) Varray = Varray.concat(l.array)

  return {Harray : Harray, Varray : Varray}
}


class LinePic{
  constructor(Harray, Varray, ctx){
    this.Harray = Harray
    this.Varray = Varray
    this.ctx = ctx
    this.imageData  = ctx.getImageData(0, 0, WIDTH, HEIGHT)
  }

  animation(t) {
    for(let i = 0; i < this.imageData.data.length; i++) this.imageData.data[i] = 255
    for(let i = 0; i < t; i += 1) {
      if (i < this.Varray.length) this.imageData.data[this.Varray[i]] -= 255
      if (i < this.Harray.length) this.imageData.data[this.Harray[i]] -= 255
    }

    this.ctx.globalAlpha = 1
    this.ctx.putImageData(this.imageData, 0, 0)  // 画像データを出力用のcanvasに
    this.ctx.restore();
    this.ctx.save()

    // requestAnimationFrame(loop)
  }
}
