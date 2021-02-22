# 学习笔记

## CSS规则结构
Selector {  
  Key: Value  
}  
Selector: 选择器  
Key:
  1. 属性名 Properties    
  2. 变量: Variables  
Value: 值

## 伪类
- :any-link 匹配所有超链接
- :link:visited 匹配已经访问过的超链接
- :hover 鼠标移动到链接上
- :active 激活状态
- :focus 获取焦点状态
- :target 锚点状态
- :empty 是否有子元素
- :nth-child() 匹配该元素的第几个子元素 支持奇偶 odd even n
- :nth-last-child() 匹配该元素的第几个子元素 从最后一个开始
- :first-child() 元素的第一个子元素
- :last-child() 元素的最后一个子元素
- :only-child() 指定子元素
- :not 排除
- :where() 实验功能
- :has()  匹配指定选择器节点 例如：a:has(> img) 只会匹配直接包含 <img> 子元素的 <a> 元素

## 伪元素
- ::before 节点之前插入元素
- ::after 节点后插入元素
- ::first-line 首行
- ::first-letter 首页字符
## 思考题：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢

first-letter 是将<first-letter>a</first-letter>包裹首个字符，而first-line则不能使用这种方式，因为首行字符数是不可控的，不同屏幕尺寸或者字体大小会影响首行渲染