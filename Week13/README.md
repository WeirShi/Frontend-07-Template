## HTML

`HTML` 是一种数据描述语言，有它自己的定义，早期的定义是继承于 `HTML` 的超集
- `SGML`（通用标准标记语言）
- `XML`（可拓展标记语言）
  1. `XML` 是 `SGML` 的子集中比较流行的一个，包含一些新的规定和改良，而早期 HTML 也是作为 `SGML` 的一个子集。
- `HTML`做过 `XML` 化的尝试，随后诞生了 `XHTML1` 和 `XHTML2`，而 `XHTML2` 由于过于严苛的规定导致社区不接受，没有流行起来，最后流产了。再往后 `HTML5` 发布了，包含一系列新的定义，使得 HTML 成为了一门独立且特别的语言。

## DTD 与 XML

DTD (Document Type Definition) - 文档类型定义
- https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
- https://www.w3.org/1999/xhtml

定义中几个需要特别注意的转义字符：
- nbsp - no-break space   
  `&nbsp;` - 空格，连接单词时虽然显示的时候中间有空格，但是实际不会把单词分开，会把两个词连成一个词
- lamdba  
  `&Lambda` - `λ` 希腊字母   
- quot   
  `&quot;` - `"` 双引号
- amp   
  `&amp;` - `&` 符号
- lt   
  `&lt;` - `<` 小于号
- gt   
  `&gt;` - `>` 大于号

## HTML 的语义
好的 HTML 语义可以让搜索引擎爬虫更好的去抓取和识别网页中的内容，也便于开发人员去编写和维护代码。

- `<article>`： 定义文章。
- `<aside>`： 定义页面内容以外的内容。
- `<details>`： 定义用户能够查看或隐藏的额外细节。
- `<figcaption>`： 定义 \<figure\> 元素的标题。
- `<figure>`： 规定自包含内容，比如图示、图表、照片、代码清单等。
- `<footer>`： 定义文档或节的页脚。
- `<header>`： 规定文档或节的页眉。
- `<main>`： 规定文档的主内容。
- `<mark>`： 定义重要的或强调的文本。
- `<nav>`： 定义导航链接。
- `<section>`： 定义文档中的节。
- `<summary>`： 定义 \<details\> 元素的可见标题。
- `<time>`： 定义日期/时间。

## HTMl 语法

### 合法元素

- Element: \<标签名\>...\</标签名\>
- Text: 文字文本
- Comment: \<!-- 注释 --\>
- DocumentType: \<!Doctype html\> 文件类型
- ProcessingInstruction: \<?processerName content?\>
  - 预处理语法，`processerName - 预处理起的名称，`content - 需要预处理的内容`
- CDATA: \<![[CDATA]]\>
  - 继承自 `XML` 的特殊语法，不需要考虑转义问题的文本节点

### 字符引用

- 数字型引用 - &#
  1. `&#161;`
- 实体型引用 - &
  1. `&amp;`
  2. `&lt;`
  3. `&quot;`

## 浏览器 API

### DOM API

`DOM API` 的内容主要为以下四个部分：

- Traveral 系列 API（废弃）
- Node - 节点类 API
  - Element - 元素节点
    - HTMLElement
    - SVGElement
  - Document - 文档根节点
  - CharacterData - 字符数据
    - Text - 文本节点
    - Comment - 注释
    - ProcessingInstruction - 预处理信息
  - DocumentFragment - 文档片段
  - DocumentType - 文档类型
- Event - 事件类 API
- Range API

#### Node - 节点类 API

- 导航类操作
  - parentNode
  - parentElement
  - childNodes
  - children
  - firstChild
  - firstElementChild
  - lastChild
  - lastElementChild
  - nextSibling
  - nextElementSibling
  - previousSibling
  - previoutsElementSibling
- 修改类操作
  - appendChild
  - insertBefore
  - removeChild
  - replaceChild
- 高级操作
  - compareDocumentPosition
    - 是一个用于比较两个节点中关系的函数
  - contains
    - 检查一个阶段是否包含另一个节点的函数
  - isEqualNode
    - 检查两个节点是否完全相同
  - isSameNode
    - 检查两个节点是否是同一个节点，实际上在 `JavaScript` 中可以使用全等符 `===` 进行比较
  - cloneNode
    - 复制一个节点，如果传入参数 `true`，则会连同自子元素做深拷贝

#### Event - 事件类 API

事件对象模型：

- 冒泡模式
- 捕获模式

```js
target.addEventListener(type, listener, [, options]);
target.addEventListener(type, listener, [, useCampture]);
target.addEventListener(type, listener, [, useCampture, wantsUntrusted]); // Gecko/Mozilla only
```

冒泡和捕获的过程，是浏览器自己去处理事件的一套机制，不论是否是通过 `addEventListener` 来绑定事件。

任何事件都有一个 *先捕获再冒泡* 的过程
- 鼠标在网页上操作时，点击了某个元素，鼠标并不能告诉浏览器点击了哪个元素，浏览器要想知道是点击了哪个元素，是需要通过计算才能得出的。
- 此时 *这个计算的过程就是捕获的过程*
  - 由外到内，一层一层的去计算，点击的是哪个元素，事件真正的触发在哪个元素上的过程。
- 而 *冒泡* 则是浏览器已经计算得到点到了哪个元素，层层的向外去触发，然后让这个元素去响应这个事件的过程

#### Range API

创建 Range：

```js
// 手动创建
let range1 = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);

// 通过 selection 获取
let range2 = document.getSelection().getRangeAt(0);
```

常用 API：

- setStartBefore
- setEndBefore
- setStartAfter
- setEndAfter
- selectNode
- selectNodeContents

#### CSSOM

对 `CSS` 文档的抽象，就是 `CSSOM`

##### CSSOM View

- window
  - innerHeight
  - innerWidth
  - outerWidth
  - outerHeight
  - devicePixelRatio
  - screen
    - width
    - height
    - availWidth
    - availHeight
- scroll 相关 API
  - Element
    - scrollTop
    - scrollLeft
    - scrollWidth
    - scrollHeight
    - scroll(x, y)
    - scrollBy(x, y)
    - scrollIntoView()
  - window
    - scrollX
    - scrollY
    - scroll(x, y)
    - scrollBy(x, y)
- layout 相关 API - 获取元素的盒
  - getClientRects()
  - getBoundingClientRect()

#### 其他 API

`API` 来源于——标准化组织：

- Khronos - 计算机图形学领域
  - WebGL
- ECMA
  - ECMAScript
- WHATWG - W3C 分支
  - HTML
- W3C
  - WebAudio
  - Group
    - WG - Working Group - 标准小组
      - CSSWG
      - SVGWG
    - CG - Community Group - 社区工作组
    - IG - Interest Group - 兴趣组