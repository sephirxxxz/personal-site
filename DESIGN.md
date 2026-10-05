# Design System: Baby Blue Personal File

## Scope

基于「个人网站设计 v1.0.0」调整 UI。正文、项目、书单、联系方式、链接与图片保持不变。
用户的新配色和顶部玻璃导航要求取代旧版黑白灰 / 红金配色及禁止所有玻璃效果的规则。

## Color tokens

| Role | Token | Color |
| --- | --- | --- |
| 页面底色 | paper | #DCEEF8 · Baby Blue |
| 浅色阅读面 | surface | #F0F7FB |
| 标题 / 结构 | ink | #233B50 · 深蓝灰 |
| 正文 | ink-soft | #3C5365 |
| 元数据 | muted | #536A7B |
| 分隔线 | line | #ABC4D4 |
| 浅色强调 | wash | #C9E1EF |
| 结构强调 | wash-strong | #B5D5E8 |
| 进度 / 冷色强调 | accent-blue | #477B9D |
| 按钮 | button | #F3E7D5 · 暖米色 |
| 按钮悬停 | button-hover | #EAD8BD |
| 按钮选中 / 按下 | button-active | #DFC7A5 |
| 按钮文字 | button-ink | #514333 |
| 暖色结构强调 | accent-gold | #8A7050 |
| 键盘焦点 | focus | #285F86 |

保留旧 section accent 类与变量别名，映射到新色盘，不再显示红色。
正文在底色上的对比度约 6.74:1，元数据约 4.74:1，按钮文字约 7.82:1。

## Composition and typography

保留个人档案式结构：压缩粗体标题、等宽元数据、不对称章节、平面阅读条目。
沿用 Arial Narrow / Aptos Narrow / Noto Sans SC / PingFang SC 字体栈。
页面主体不使用大面积 backdrop-filter，Baby Blue 本身承担底色。
桌面内容最大宽度 1440px，700px 以下自然单栏。
手机端首屏装饰文字横向排列，避免覆盖姓名。

## Glass chapter progress navigation

顶部固定的浮动导航是唯一玻璃区域：
- 70% 浅蓝白背景，16px 背景模糊，135% 饱和度。
- 白色内高光、细边框和轻柔蓝灰阴影。
- 章节入口均为暖米色，选中态使用更深的米色与 aria-current。
- 上方显示当前章节和阅读百分比，下方显示连续阅读进度。
- 13 个章节完整保留；窄屏可横向滚动导航，不隐藏章节。
- 支持鼠标、触摸、键盘与原生 URL 锚点。
- 点击及原生锚点均预留顶部空间，不把标题遮在导航下。
- 自动追踪只移动导航自身，不移动页面或抢夺键盘焦点。
- 不支持背景模糊或偏好减少透明度时，使用实色浅蓝白底。

## Buttons and links

导航、联系入口、返回首页和其他按钮使用统一暖米色体系。
正文内的普通链接保留下划线，不把每个文本链接都变成按钮。
点击区域至少 44px；所有入口都有清晰键盘焦点。
米色不用于低对比度正文文字。

## Motion — emil-design-eng

- 静态内容行不再悬停位移，避免误导读者以为整行可点击。
- 按钮按下缩放为 0.97，120ms 自定义 ease-out，仅过渡 transform。
- hover 效果限定在支持悬停的精细指针设备。
- 书封轻微上移 3px，160ms；恢复颜色不使用持续滤镜动画。
- 指针点击章节允许平滑滚动，键盘保留原生即时导航。
- prefers-reduced-motion 下关闭按压缩放、书封位移与平滑滚动。
- 不劫持滚轮、不强制整屏翻页、不引入动画框架。
- 进度通过被动滚动监听与 requestAnimationFrame 更新，仅改变填充条 transform。
