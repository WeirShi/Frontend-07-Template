学习笔记

## 广度优先(BFS)
一次性访问当前顶点的所有未访问状态相邻顶点，并依次对每个相邻顶点执行同样处理。因为要依次对每个相邻顶点执行同样的广度优先访问操作，所以需要借助队列结构来存储当前顶点的相邻顶点.\
类似波纹放大半径扩散来进行搜索.\

## 深度优先(DFS)
深度优先，首先访问一个相邻顶点，并继续访问该相邻顶点的一个相邻顶点，重复执行直到当前正在被访问的顶点出度为零，或者不存在未访问状态的相邻顶点，则回退到上一个顶点继续按照该深度优先方式访问.\

## 二叉堆
即为完全二叉树

## 异步(event-loop)
JS中通过这种运行机制来处理单线程带来的问题. (浏览器中和NodeJS中的event-loop机制有差异)\
1. 宏任务：MacroTask. 一些异步任务会依次进入到这个队列中.\
    - setTimeout
    - setInterval
    - setImmediate(NodeJS)
    - requeseAnimationFrame(Browser)
    - I/O(NodeJS)
    - UI rendering(Browser)
2. 微任务：MicroTask. 另外一些异步任务会依次进入到这个队列中.\
    - process.nextTick(NodeJS)
    - Promise
    - Object.observe
    - MutationObserver
3. 调用顺序.\
在同一个执行环境中，同步任务最先执行.\
全局Script代码执行完毕后，清空调用栈.\
执行微任务调用栈，先进先出.\
执行宏任务调用栈，先进先出.\


