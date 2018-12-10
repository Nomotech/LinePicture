// ============================================
// imageprocessing.js
//
// Copyright (c) 2018 Nomotech
// Released under the MIT license.
// see https://opensource.org/licenses/MIT
// ============================================

// let buttonArea = document.getElementById('buttonArea')
// let effectsList = document.getElementById('effectsList')
// let effects = []

// -------------------------< Image processing >-------------------------
// 画像の二値化 data ... image data t ... threshold
let threshold = (data, t) => {
  for(let y = 0; y < HEIGHT; y++) {
    for(let x = 0; x < WIDTH; x++) {
        let index = (x + y * WIDTH) * 4
        let r = data[index + 0]
        let g = data[index + 1]
        let b = data[index + 2]
        let v = r * 0.298912 + g * 0.586611 + b * 0.114478
        if(v > t)    data[index + 0] = data[index + 1] = data[index + 2] = 255
        else         data[index + 0] = data[index + 1] = data[index + 2] = 0
    }
  }
}

let threshold2 = (data, t1, t2) => {
  for(let y = 0; y < HEIGHT; y++) {
    for(let x = 0; x < WIDTH; x++) {
        let index = (x + y * WIDTH) * 4
        let r = data[index + 0]
        let g = data[index + 1]
        let b = data[index + 2]
        let v = r * 0.298912 + g * 0.586611 + b * 0.114478
        data[index + 0] = data[index + 1] = data[index + 2] = 0
        if(v > t2)      data[index + 0] = 255
        else if(v > t1) data[index + 1] = 255
        else            data[index + 2] = 255
    }
  }
}

// ネガポジ反転
let reversal = (data) => {
  for(let y = 0; y < HEIGHT; y++) {
    for(let x = 0; x < WIDTH; x++) {
        let index = (x + y * WIDTH) * 4
        let r = data[index + 0]
        let g = data[index + 1]
        let b = data[index + 2]
        data[index + 0] = 255 - r
        data[index + 1] = 255 - g
        data[index + 2] = 255 - b
    }
  }
}

// グレースケール
let gray = (data) => {
  for(let i = 0; i < data.length; i += 4) {
    let r = data[i + 0]
    let g = data[i + 1]
    let b = data[i + 2]
    let v = r * 0.298912 + g * 0.586611 + b * 0.114478
    data[i] = data[i + 1] = data[i + 2] = v;
    // d[i+3]に格納されたα値は変更しない
  }
}


// 平滑化フィルタ
let smoothing = (data) => {
  for(let y = 1; y < HEIGHT - 1; y++) {
    for(let x = 1; x < WIDTH - 1; x++) {
      for (let i = 0; i < 3; i++) {
        let sum = data[((x - 1) + (y - 1) * WIDTH) * 4 + i]
                + data[((x    ) + (y - 1) * WIDTH) * 4 + i]
                + data[((x + 1) + (y - 1) * WIDTH) * 4 + i]
                + data[((x - 1) + (y    ) * WIDTH) * 4 + i]
                + data[((x    ) + (y    ) * WIDTH) * 4 + i]
                + data[((x + 1) + (y    ) * WIDTH) * 4 + i]
                + data[((x - 1) + (y + 1) * WIDTH) * 4 + i]
                + data[((x    ) + (y + 1) * WIDTH) * 4 + i]
                + data[((x + 1) + (y + 1) * WIDTH) * 4 + i]
        data[(x + y * WIDTH) * 4 + i] = sum / 9
      }
    }
  }
}


// sobelVフィルタ
// |  1 |  0 | -1 |
// |  2 |  0 | -2 |
// |  1 |  0 | -1 |
let sobelV = (data) => {
  let a = []
  for (let d of data) a.push(d)
  for(let y = 1; y < HEIGHT - 1; y++) {
    for(let x = 1; x < WIDTH - 1; x++) {
      for (let i = 0; i < 3; i++) {
        let sum = 1 * data[((x - 1) + (y - 1) * WIDTH) * 4 + i]
                + 0 * data[((x    ) + (y - 1) * WIDTH) * 4 + i]
                - 1 * data[((x + 1) + (y - 1) * WIDTH) * 4 + i]
                + 2 * data[((x - 1) + (y    ) * WIDTH) * 4 + i]
                + 0 * data[((x    ) + (y    ) * WIDTH) * 4 + i]
                - 2 * data[((x + 1) + (y    ) * WIDTH) * 4 + i]
                + 1 * data[((x - 1) + (y + 1) * WIDTH) * 4 + i]
                + 0 * data[((x    ) + (y + 1) * WIDTH) * 4 + i]
                - 1 * data[((x + 1) + (y + 1) * WIDTH) * 4 + i]
        a[(x + y * WIDTH) * 4 + i] = sum
      }
    }
  }
  for (let i = 0; i < data.length; i++) data[i] = a[i]
}

// sobelフィルタ
// |  1 |  2 |  1 |
// |  0 |  0 |  0 |
// | -1 | -2 | -1 |
let sobelH = (data) => {
  let a = []
  for (let d of data) a.push(d)
  for(let y = 1; y < HEIGHT - 1; y++) {
    for(let x = 1; x < WIDTH - 1; x++) {
      for (let i = 0; i < 3; i++) {
        let sum = 1 * data[((x - 1) + (y - 1) * WIDTH) * 4 + i]
                + 2 * data[((x    ) + (y - 1) * WIDTH) * 4 + i]
                + 1 * data[((x + 1) + (y - 1) * WIDTH) * 4 + i]
                + 0 * data[((x - 1) + (y    ) * WIDTH) * 4 + i]
                + 0 * data[((x    ) + (y    ) * WIDTH) * 4 + i]
                + 0 * data[((x + 1) + (y    ) * WIDTH) * 4 + i]
                - 1 * data[((x - 1) + (y + 1) * WIDTH) * 4 + i]
                - 2 * data[((x    ) + (y + 1) * WIDTH) * 4 + i]
                - 1 * data[((x + 1) + (y + 1) * WIDTH) * 4 + i]
        a[(x + y * WIDTH) * 4 + i] = sum
      }
    }
  }
  for (let i = 0; i < data.length; i++) data[i] = a[i]
}

let lineFilterV = (data, N, threshold) => {
  let a = []
  for(let i = 0; i < data.length; i += 4) a.push(0, 0, 0, 255)
  for (let y = N; y < HEIGHT - N; y += N * 2 + 1) {
    for (let x = N; x < WIDTH - N; x += N * 2 + 1) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        for (let i = 0; i <= N; i++) {
          sum += data[((x + i) + (y + 0) * WIDTH) * 4 + c]
          sum += data[((x - i) + (y + 0) * WIDTH) * 4 + c]
          sum += data[((x + 0) + (y + i) * WIDTH) * 4 + c]
          sum += data[((x + 0) + (y - i) * WIDTH) * 4 + c]
        }
        for (let i = 1; i <= N; i++) {
          for (let j = 1; j <= N; j++) {
            sum += data[((x + i) + (y + j) * WIDTH) * 4 + c]
            sum += data[((x + i) + (y - j) * WIDTH) * 4 + c]
            sum += data[((x - i) + (y + j) * WIDTH) * 4 + c]
            sum += data[((x - i) + (y - j) * WIDTH) * 4 + c]
          }
        }
        // console.log(sum)
        sum /= ((N * 2 + 1) * (N * 2 + 1) + 1)
        value = (sum > threshold)? 0 : 255
        value = sum
        for (let j = 0; j <= N; j++) {
          a[((x + 0) + (y + j) * WIDTH) * 4 + c] = value
          a[((x + 0) + (y - j) * WIDTH) * 4 + c] = value
        }
      }
    }
  }
  for (let i = 0; i < data.length; i++) data[i] = a[i]
}

let lineFilterH = (data, N, threshold) => {
  let a = []
  for(let i = 0; i < data.length; i += 4) a.push(0, 0, 0, 255)
  for (let y = N; y < HEIGHT - N; y += N * 2 + 1) {
    for (let x = N; x < WIDTH - N; x += N * 2 + 1) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        for (let i = 0; i <= N; i++) {
          sum += data[((x + i) + (y + 0) * WIDTH) * 4 + c]
          sum += data[((x - i) + (y + 0) * WIDTH) * 4 + c]
          sum += data[((x + 0) + (y + i) * WIDTH) * 4 + c]
          sum += data[((x + 0) + (y - i) * WIDTH) * 4 + c]
        }
        for (let i = 1; i <= N; i++) {
          for (let j = 1; j <= N; j++) {
            sum += data[((x + i) + (y + j) * WIDTH) * 4 + c]
            sum += data[((x + i) + (y - j) * WIDTH) * 4 + c]
            sum += data[((x - i) + (y + j) * WIDTH) * 4 + c]
            sum += data[((x - i) + (y - j) * WIDTH) * 4 + c]
          }
        }
        sum /= ((N * 2 + 1) * (N * 2 + 1) + 1)
        value = (sum > threshold)? 0 : 255
        value = sum
        for (let i = 0; i <= N; i++) {
          a[((x + i) + (y + 0) * WIDTH) * 4 + c] = value
          a[((x - i) + (y - 0) * WIDTH) * 4 + c] = value
        }
      }
    }
  }
  for (let i = 0; i < data.length; i++) data[i] = a[i]
}
