# Paragon Gateway (A-24-10) 3D 空间与室内风格决策 SaaS 平台

> **专为马来西亚柔佛新山 Paragon Gateway Tower A 24楼 A-24-10 单元（Type B 右向户型，648 sq ft / 60.22 ㎡）量身打造的高交互 3D BIM 空间推演、多风格横向决策、Aqara 智能家居模拟与新山本地装修造价核算系统。**

🌐 **线上生产环境访问地址 (Live Demo)**: [https://brave-meitner.vercel.app](https://brave-meitner.vercel.app)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌟 核心功能特性

### 1. 3D / 2.5D 空间与 BIM 交互推演引擎 (`Spatial3DViewer`)
* **9 大功能分区毫米级空间建模**：入户玄关、开放式厨房、中岛吧台、客厅影音区、南向阳台 (SSE 165°)、极客工作站 (1+1)、主卧深睡区、卫浴、生活阳台。
* **多维度图层实时叠加切换**：
  * 📐 **尺寸图层 (Dimensions)**：开间进深、净高 (Clear Height 2.70m)、梁下高度；
  * ⚡ **交标机电底账 (MEP Baseline)**：DB配电箱、12开关、11插座、3组空调点、光纤与给排水；
  * 🤖 **Aqara 智能点位 (Smart Home)**：人体存在雷达、智能锁、电动窗帘、扫地机基站；
  * ☀️ **南向微气候流场 (Microclimate)**：SSE 165° 日照轨迹（零西晒）、季风穿堂风流向动效。
* **5 大预设漫游视角**：3D 俯瞰全景、客厅主视角、极客工位视角、主卧深睡视角、24楼阳台视野。

### 2. 4 大室内设计风格横向决策舱 (`StyleComparisonMatrix`)
* **4 款完整美学体系全覆盖**：
  1. **现代极简科技风** (Modern Tech Minimalist) · 德系冷暖平衡 · 空间通透
  2. **意式暗调高级黑** (Italian Dark Luxury) · 黑胡桃沉稳质感 · 私密奢雅
  3. **温暖治愈原木** (Japandi & Warm Natural) · 日式侘寂 · 白橡原木温润
  4. **硬核工业未来感** (Industrial Cyber & Futurism) · 微水泥原灰 · 不锈钢金属
* **分屏滑块视觉比对 (Split-Screen Slider)**：交互拖动中缝滑块，在同一视角下直接比对两种风格的质感差异。
* **六维综合雷达评分**：空间通透度、耐脏低打理、造价性价比、极客工位契合、睡眠舒缓感、资产保值率。
* **AI 自定义偏好加权推荐算法**：拖动个人偏好权重滑块，实时计算个性化排名得分。

### 3. 全屋空间渲染画廊与材质情绪板 (`VisualGallery`)
* 16 组高清空间渲染参考图景与材质规格说明；
* 支持按风格及按空间（客厅中岛、极客工位、主卧深睡、卫浴阳台）快速过滤与大图查看。

### 4. Aqara / 米家全屋智能自动化模拟器 (`SmartHomeSimulator`)
* 内置 5 大极客生活自动化情景模拟：
  * 🚀 **沉浸编程模式 (Deep Code & Focus)**
  * 🎬 **沉浸影音模式 (Cinema & AV Time)**
  * 🌙 **深度睡眠模式 (Deep Sleep & Rest)**
  * ☀️ **晨起自然唤醒 (Morning Sunrise Wakeup)**
  * 🚪 **一键离家巡航 (Away & Auto Clean)**
* 动态展示传感器触发逻辑、灯光色温、电动窗帘与机电自动化响应链。

### 5. 新山本地装修造价与工程量核算器 (`BudgetCalculator`)
* **马币（MYR / RM）本土化行情精算**；
* 3 档预设配置一键切换：基础质感精装 (~RM 45k)、极客科技高配 (~RM 68k ★推荐)、顶级旗舰高定 (~RM 95k)；
* 细化到拆改移门、全屋定制木作、智能家居、灯光洁具与软装家具；
* 动态计算总价、单平米造价（RM/sqft）、SPA 房价比与分期月供。

### 6. 决策终审报告与导出 (`DecisionModal`)
* 一键生成包含物业参数、选定风格、材质工艺、智能方案与预算清单的终审报告；
* 支持直接打印或导出为 PDF。

---

## 🚀 快速本地运行与 Vercel 部署

### 本地启动

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run dev

# 浏览器访问
http://localhost:3000
```

### 生产打包测试

```bash
npm run build
npm run start
```

### Vercel 线上部署

1. 将代码推送到 GitHub 仓库；
2. 登录 [Vercel](https://vercel.com)；
3. 点击 **Add New Project**，导入该 GitHub 仓库；
4. 构建命令保持默认（`npm run build`），Framework Preset 选择 `Next.js`；
5. 点击 **Deploy**，几秒后即可生成线上专属 SaaS 访问链接。

---

## 🛠️ 技术栈

* **核心框架**: Next.js 14 (App Router) + React 18 + TypeScript
* **样式系统**: Tailwind CSS + Glassmorphism 毛玻璃科技主题
* **3D 引擎**: Three.js + WebGL 交互渲染
* **图标库**: Lucide React
* **部署平台**: Vercel Ready (零外部数据库依赖，纯前端高性能秒开)
