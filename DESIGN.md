# Design System: Baby Blue Reader

## Scope
正式首页采用阅读长卷，与 /prototypes/full-layout/reader/ 共用组件。
“我在做什么”、英语工作语言、“我觉得有意思的 AI 产品”、“工作流”、“实习工作系统”及相应入口按用户要求移除。
首屏不显示姓名，文案为「寻找ALPHA」，文字与快捷按钮居中，按钮不显示右上箭头；不新增装饰说明文字。其他正文、书籍、封面、联系方式与链接保留。
未删减快照由 Git 标签「文字未删减版」指向提交 7b17cbd；其他原型保留。

## Color tokens
| Role | Token | Color |
| --- | --- | --- |
| 页面底色 | paper | #DCEEF8 · Baby Blue |
| 浅色阅读面 | surface | #F0F7FB |
| 标题、正文、导航、按钮文字 | ink / ink-soft / muted / button-ink | #56616B · 灰色 |
| 分隔线 | line | transparent |
| 按钮 | button | #F3E7D5 · 浅米色 |
| 按钮悬停 | button-hover | #EFDEC8 |
| 按钮选中 | button-active | #EAD8BD |
| 键盘焦点 | focus | #285F86 |

灰字对浅蓝底色约5.31:1，对米色按钮约5.18:1。
不使用深蓝页面背景，不恢复白色文字渐变、白色分隔线、玻璃白边或按钮白色内高光。

## Composition
桌面与手机统一采用居中单列，章节标题、正文、书封、按钮和材质小物件对齐页面中轴；长段落最大阅读宽度760px。
沿用 Arial Narrow / Aptos Narrow / Noto Sans SC / PingFang SC 字体栈，提高文字字重。
书封与笔记并排；没有滚动劫持，没有强制整屏翻页。
四件原创材质插画为透明 WebP，保留小物件但不再插在白色线上。

## Navigation
正式首页与阅读长卷已移除全部浮动进度条、板块滑块及其虹彩效果。
保持原生纵向滚动、页面内快捷链接和蓝色键盘焦点。
其他原型的导航独立保留；阅读页面不再注册进度追踪滚动监听。

## Buttons and motion
联系入口与快捷按钮为浅米色；普通正文链接不变成按钮。
按钮阴影静态，按压缩放0.97 / 120ms；hover仅作用于精细指针。
章节仅一次性进入；键盘导航不触发进入动画。
减少动态效果时关闭位移和滚动动画，虹彩仅淡入淡出。
不安装额外动画框架；保持清晰蓝色键盘焦点。
