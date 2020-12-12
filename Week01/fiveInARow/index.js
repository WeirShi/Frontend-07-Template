const width = 450; // 宽
const height = 450; // 高
const startX = 15; // x点距离
const startY = 15; // y点距离
const row = 15; // 行数
const column = 15; // 列数
const distance = 30; // 间距

const win = false; // 判断是否有一方获胜
const winNum = 5; // 获取需要的条件
const pattern = []; // 棋盘数据
let color = 1; // 1 是白旗 2 是黑棋 0为空

// canvas 实例
const board = document.getElementById("chessBoard") ;//获取canvas
const ctx = board.getContext("2d");
ctx.strokeStyle = "#757575" ; //画笔的颜色

function clone(pattern) {
    return Object.create(pattern);
}

// 初始化棋盘数据
function initData(pattern) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            pattern[i * row + j] = 0;
        }
    }
}

// 绘制棋盘
function drawBoard() {
    for (let i = 0; i < row; i++) {
        // 横线
        ctx.moveTo(startX, startX + i * distance);
        ctx.lineTo(width - startX, startX + i * distance);
        ctx.stroke();

        // 竖线
        ctx.moveTo(startY + i * 30, startY);
        ctx.lineTo(startY + i * 30, height - startY);
        ctx.stroke();
    }
}

board.addEventListener('click', (e) => {
    if (win) { return; }
    userMove(e);
});

// 落子
function userMove({ offsetX, offsetY }) {
    if(checkWin(pattern, color)) {
        win = true;
        alert(color === 2 ? 'black is winner' : 'white is winner');
    }
    // 点击获取x,y坐标点的值[15, 15] ~ [435, 435]
    // point 点位的坐标[0, 0] ~ [15, 15]
    const x = Math.floor(offsetX / distance); // 向下取整
    const y = Math.floor(offsetY / distance); // 向下取整
    if (pattern[y * row + x] !== 0) {
        return;
    }
    drawChessPieces(x, y, color);
    pattern[y * row + x] = color;
    color = 3 - color;
}

// 绘制棋子
function drawChessPieces(x, y, color) {
    ctx.beginPath();
	ctx.arc(startX + x * distance, startY + y * distance, 13, 0, 2 * Math.PI);
	ctx.closePath();
	var gradient = ctx.createRadialGradient(startX + x * distance + 2, 15 + y * distance - 2, 13, startX + x * distance + 2, startY + y * distance - 2, 0);
	if(color === 2){
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}	
	ctx.fillStyle = gradient;
	ctx.fill();
}

// 检查是否获胜
function checkWin(pattern, color) {

    // 检查行
    {
    
    }
    // 检查列
    {

    }

    // 检查斜线
    {

    }

    return false;
}

// 检查是否即将获胜
function willWin(pattern, color) {
    
}

// 电脑落子
function computerMove() {
    
}

initData(pattern);
drawBoard();
