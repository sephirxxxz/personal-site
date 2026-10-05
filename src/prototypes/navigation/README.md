# 线条与章节导航原型

预览：/prototypes/navigation/
方向：轻线胶囊 / 轴线刻度 / 角落索引。使用底部 picker 或 1–3、左右键切换，R 重置当前预览。
这是隔离探索：首页、正式 CSS 和正式交互脚本未修改。选定一个方向后才整合，随后删除原型目录及路由。

## 共同约束
- Baby Blue 底色、暖米色控件、全部原有正文与链接。
- 导航由原版约 110px 降为 56px，至少 44px 触摸区域。
- 玻璃仅用于导航与目录，不把阅读区变成玻璃卡片。
- Web CSS 模糊 / 透色 / 高光是视觉近似，不是 Apple 原生实时折射。
- 保留自然滚动，不拦截滚轮，不让静态内容响应虚假悬停。
- 目录可用键盘打开、Escape 关闭，章节可即时键盘跳转。
- 减少动态效果和减少透明度均有回退。
- 本轮比较的是分隔线结构、导航布局和密度；未修改排版内容。

## 参考
- Apple Meet Liquid Glass: https://developer.apple.com/videos/play/wwdc2025/219/
  分离导航层与内容层，保持轻量和可读性，不堆叠玻璃。
- Emil 7 Practical Animation Tips: https://emilkowal.ski/ui/7-practical-animation-tips
  按压反馈、快速 ease-out、正确的动画用途。
- Emil Great Animations: https://emilkowal.ski/ui/great-animations
  自然、快速、可中断、性能友好且可访问；高频键盘操作不动画。

## Verification
已在浏览器检查 320 / 390 / 1440px，无页面横向溢出；全部原型内容与首页对比一致。
检查了 picker URL 持久化、目录开关、键盘、章节跳转、进度、上一 / 下一章节与减少动态效果。
