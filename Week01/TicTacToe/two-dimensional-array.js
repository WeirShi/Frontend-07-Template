// TicTacToe 3行3列棋盘数组
let pattern = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

// 列
const column = 3;
// 行
const row = 3
// 是否有一方获胜
let win = false;

// 当前点击落子为 ⭕️ = 1 ❌ = 2  空 = 0
// Tips: 使用对称运算  3-1 = 2、3-2=1
let color = 1;
const tips = document.getElementById('tips');

// 绘制棋盘
function show(pattern) {
  // 循环遍历二维数组 进行绘制棋盘
  const board = document.getElementById('board');
  // 每一次的绘制将board置为空
  board.innerHTML = '';
  // 遍历行
  for (let i = 0; i < row; i++) {
    // 遍历列
    for (let j = 0; j < column; j++) {
      // 创建每个格子
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.innerText =
        pattern[i][j] === 2 ? '❌' :
        pattern[i][j] === 1 ? '⭕️' : '';
      cell.addEventListener('click', () => {
        if (win) { return; }
        userMove(i, j);
      });
      board.appendChild(cell);
    }
    // 每行进行一个换行
    board.appendChild(document.createElement('br'));
  }
}


// 每个格子的点击事件 x 横坐标 y 纵坐标
function userMove(x, y) {
  pattern[x][y] = color;
  // 判断是否赢得游戏
  if (check(pattern, color)) {
    win = true;
    tips.innerText = color === 2 ? '❌  is winner' : '⭕️  is winner';
  }
  color = 3 - color;
  console.log(bestChoice(pattern, color));
  // 重新绘制
  show(pattern);
  // 判断某一方即将获胜
  // if (willWin(pattern, color)) {
  //   console.log(
  //     color === 2 
  //       ? '❌  will win'
  //       : '⭕️  will win'
  //   )
  // }

  computerMove();
}

function computerMove() {
  let choice = bestChoice(pattern, color);
  if (choice.point) {
    pattern[choice.point[1]][choice.point[0]] = color;
  }
  if (check(pattern, color)) {
    win = true;
    tips.innerText = color === 2 ? '❌  is winner' : '⭕️  is winner';
  }
  color = 3 - color;
  show(pattern);
}

/* 
 * 获胜规则
 * 某一行/某一列中所有格子的都为❌ / ⭕️ 
 * 某一斜线中所有格子的都为❌ / ⭕️ 
 */ 
function check (pattern, color) {
  // 判断行
  for (let i = 0; i < row; i++) {
    let isWin = true;
    for (let j = 0; j < column; j++) {
      if (pattern[i][j] !== color) {
        isWin = false;
      }
    }
    
    if (isWin) {
      return true;
    }
  }

  // 判断列
  for (let i = 0; i < row; i++) {
    let isWin = true;
    for (let j = 0; j < column; j++) {
      if (pattern[j][i] !== color) {
        isWin = false;
      }
    }
    if (isWin) {
      return true;
    }
  }

  // 判断斜线
  // Tips: 这里为了能够使用isWin作为局部作用域变量使用了es6中 {} 的块级作用域
  {
    // 坐标点为 0,0 1,1 2,2
    let isWin = true;
    for (let i = 0; i < row; i++) {
      if (pattern[i][i] !== color) {
        isWin = false;
      }
    }
    if (isWin) {
      return true;
    }
  }
  
  {
     // 坐标点为 0,2 1,1 2,0
     let isWin = true;
     for (let i = 0; i < row; i++) {
       if (pattern[i][2-i] !== color) {
         isWin = false;
       }
     }
     if (isWin) {
       return true;
     }
  }

  return false
}

// 克隆函数 - JSON.parse JSON.stringify clone方法
function clone(pattern) {
  return JSON.parse(JSON.stringify(pattern));
}

function willWin (pattern, color) {
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (pattern[i][j] !== 0) {
        continue;
      }
      // 当前位置为空的情况下，给当前位置一个点，并进行判断是否会胜出 返回坐标
      let temp = clone(pattern);
      temp[i][j] = color;
      if (check(temp, color)) {
        return [j, i];
      }
    }
  }
  // 若完成遍历后都没有 return null
  return null;
}

/*
 * 
 * return {
 *  point, 坐标点
 *  result 输 -1， 赢 1，和 0
 * }
 */
function bestChoice(pattern, color) {
  let point = willWin(pattern, color);
  
  if (point) {
    return {
      point,
      result: 1
    }
  }
  let result = -1;
  outer: for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (pattern[i][j] !== 0) {
        continue;
      }
      let temp = clone(pattern);
      temp[i][j] = color;
      let op = bestChoice(temp, 3 - color);
      if (-op.result >= result) {
        point = [j, i];
        result = -op.result;
      }

      if (result === 1) {
        break outer;
      }
    }
  }
  return {
    point,
    result: point ? result : 0
  }
}


show(pattern);

