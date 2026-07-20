---
name: Li Xiaoran Personal File
description: A monochrome editorial profile built from resume-like typography and structured evidence.
colors:
  paper: "#F5F5F4"
  surface: "#FDFDFD"
  ink: "#171717"
  ink-soft: "#525252"
  muted: "#7D7D7D"
  line: "#BFBFBF"
  wash: "#D9DBDF"
  wash-strong: "#C2C6CE"
  focus: "#315C98"
typography:
  display:
    fontFamily: "Arial Narrow, Aptos Narrow, Noto Sans SC, PingFang SC, sans-serif"
    fontSize: "clamp(3.4rem, 8vw, 6rem)"
    fontWeight: 850
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Aptos, Noto Sans SC, PingFang SC, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.06em"
rounded:
  square: "0px"
spacing:
  compact: "12px"
  standard: "24px"
  section: "clamp(74px, 10vw, 126px)"
components:
  content-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "20px 0 28px clamp(18px, 3vw, 32px)"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "7px 10px 6px 0"
---

# Design System: Li Xiaoran Personal File

## 1. Overview

**Creative North Star: "The Personal Dossier"**

页面像一份经过平面设计师编排的个人档案：黑色信息、冷灰结构、白色阅读面。超大英文不是标签堆砌，而是给长页面建立空间坐标；细线、方形起点和不对称栏位承担分组。

系统拒绝通用 SaaS 卡片墙，也拒绝只模仿杂志表面的装饰性编辑风。内容始终是主角，视觉负责让它更容易被记住和检索。

**Key Characteristics:**

- 黑白灰限制色盘
- 方正、无阴影的平面层级
- 中英文粗体标题与等宽小字对照
- 档案式细线、编号感和超大背景字
- 桌面不对称、移动端自然收束
- 页面背景铺满视口，内容靠内部留白而非外部边距呼吸
- 首屏仅在左上与右下使用纵向档案文字，以深灰主线和浅灰辅线连接

## 2. Colors

冷灰中性色构成全部视觉层级，唯一的蓝色只用于无障碍焦点状态。

### Primary

- **Archive Ink** (#171717): 标题、关键线条、主动状态和最强对比。

### Neutral

- **Cool Paper** (#F5F5F4): 页面外部背景。
- **Reading Surface** (#FDFDFD): 主内容阅读面。
- **Body Graphite** (#525252): 正文。
- **Metadata Gray** (#7D7D7D): 标签和辅助信息。
- **Rule Gray** (#BFBFBF): 分隔线。
- **Layout Wash** (#D9DBDF): 超大背景字与结构色块。

**The Monochrome Rule.** 内容不使用分类彩色边框；色彩不能替代层级。

## 3. Typography

**Display Font:** Arial Narrow / Aptos Narrow，中文回退 Noto Sans SC、PingFang SC
**Body Font:** Aptos，中文回退 Noto Sans SC、PingFang SC
**Label/Mono Font:** SFMono-Regular / Consolas

**Character:** 标题压缩、有海报感；正文正常字宽、舒展；元数据用等宽字形成档案与时间戳气质。

### Hierarchy

- **Display** (850, clamp(3.4rem, 8vw, 6rem), 1.08): 第一屏姓名。
- **Headline** (850, clamp(2.2rem, 5vw, 3.8rem), 1.08): 章节标题。
- **Title** (850, clamp(1.08rem, 2vw, 1.35rem), 1.08): 项目或条目标题。
- **Body** (400, 16px, 1.65): 正文最长 72ch。
- **Label** (500, 0.7rem, 0.06em): 日期、作者和元数据。

**The Contrast Rule.** 粗体负责导航，等宽小字负责定位，正文负责解释；三者不可互相替代。

## 4. Elevation

系统完全不使用阴影。深度来自色面、线条、字号和内容的先后关系；悬停只用轻微背景变化与位移反馈。

**The Flat Dossier Rule.** 不给内容容器增加浮层感，页面始终像一张可连续阅读的平面档案。

## 5. Components

### Chips

- **Style:** 无胶囊底色、无圆角，等宽小字沿细线排列。
- **State:** 仅作为关键词，不承担按钮交互。

### Cards / Containers

- **Corner Style:** 0px。
- **Background:** 默认透明，悬停使用 28% 的 Layout Wash 混合色。
- **Shadow Strategy:** 无阴影。
- **Border:** 顶部 1px 分隔线，起点为 10px 黑色方块。
- **Internal Padding:** 20px 0 28px clamp(18px, 3vw, 32px)。
- **Composition:** 桌面端相邻条目允许纵向错位，单条重点内容可以缩窄并偏向一侧；移动端全部回归单栏。

### Navigation

桌面端以左侧短横线显示长页面进度，当前章节横线变长并变黑；窄屏隐藏，保留原生滚动与章节结构。

### Hero Edge Marks

左上纵排 `PERSONAL PROFILE`，右下纵排 `SEPHIRX · 2026`。每组只使用一条深灰长线和一条浅灰短线，不加入第三组纵向装饰，避免干扰首屏主体。

### Book Rail

书封默认灰度，悬停恢复颜色并轻微上移；水平滚动使用 scroll-snap，文本信息置于粗黑线下方。

## 6. Do's and Don'ts

### Do:

- **Do** 用 #171717、#525252、#D9DBDF 建立清晰的三级视觉权重。
- **Do** 让超大英文作为章节空间坐标，并保持在内容之后。
- **Do** 在 700px 以下把双栏内容收束成单栏。
- **Do** 让章节标题、重点条目和书封沿不同水平起点排列，形成可读的不对称节奏。
- **Do** 保持正文至少 4.5:1 对比度并保留键盘焦点。

### Don't:

- **Don't** 使用通用 SaaS 落地页、彩色圆角卡片墙、渐变与玻璃拟态。
- **Don't** 给内容卡片添加圆角、软阴影或彩色粗边。
- **Don't** 让背景大字遮盖正文或在窄屏横向溢出。
- **Don't** 用大段全大写英文承载正文信息。
