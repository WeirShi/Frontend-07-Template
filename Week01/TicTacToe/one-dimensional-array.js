{
  let pattern = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ]

  // 列
  const column = 3;
  // 行
  const row = 3
  // 是否有一方获胜
  let win = false;

  let color = 1;
  
  function show(pattern) {
    // 循环遍历二维数组 进行绘制棋盘
    const board = document.getElementById('board2');
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
          pattern[i * 3 + j] === 2 ? '❌' :
          pattern[i * 3 + j] === 1 ? '⭕️' : '';
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

  function userMove(x, y) {
    pattern[x * 3 + y] = color;
    if (check(pattern, color)) {
      win = true;
      alert(color === 2 ? '❌  win' : '⭕️  win')
    }
    color = 3 - color;
    console.log(bestChoice(pattern, color));
    show(pattern);
    computerMove();
    // 判断某一方即将获胜
    // if (willWin(pattern, color)) {
    //   console.log(
    //     color === 2 
    //       ? '❌  will win'
    //       : '⭕️  will win'
    //   )
    // }
  }


  function computerMove() {
    let choice = bestChoice(pattern, color);
    console.log('choice', choice);
    console.log(choice.point[1] * 3 + choice.point[0] + 1);
    if (choice.point) {
      pattern[choice.point[1] * 3 + choice.point[0]] = color;
    }
    if (check(pattern, color)) {
      alert(color === 2 ? '❌  win' : '⭕️  win');
    }
    color = 3 - color;
    show(pattern);
  }

  function check(pattern, color) {
    // 行
    // 判断行
    for (let i = 0; i < row; i++) {
      let isWin = true;
      for (let j = 0; j < column; j++) {
        if (pattern[i * 3 + j] !== color) {
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
        if (pattern[j * 3 + i] !== color) {
          isWin = false;
        }
      }
      if (isWin) {
        return true;
      }
    }

    // 判断斜线
    {
      // 坐标点为 0,0 1,1 2,2
      let isWin = true;
      for (let i = 0; i < row; i++) {
        if (pattern[i * 3 + i] !== color) {
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
        if (pattern[i * 3 + 2 - i] !== color) {
          isWin = false;
        }
      }
      if (isWin) {
        return true;
      }
    }

    return false;
  }



  // 创建了一个新对象，且以原有的pattern为原型，继承了原有pattern的方法和数据
  // 新的pattern生命周期要短于原有的pattern
  // 可以减少内存空间
  function clone(pattern) {
    return Object.create(pattern);
  }

  function willWin(pattern, color) {
    for (let i = 0; i < row; i++) {
      for(let j = 0; j < column; j++) {
        if (pattern[i * 3 + j] !== 0) {
          continue;
        }
        let temp = clone(pattern);
        temp[i * 3 + j] = color;
        if (check(temp, color)) {
          return [j, i]
        }
      }
    }
    return null;
  }


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
        if (pattern[i * 3 + j] !== 0) {
          continue;
        }
        let temp = clone(pattern);
        temp[i * 3 + j] = color;
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
}
