# 表观遗传刷题 App (Epigenetics Practice)

这是一个纯 HTML/CSS/JS 编写的单页刷题应用，专为移动端（特别是微信内置浏览器）优化。

## 📂 项目结构
- `index.html`: 入口页，选择难度和进入错题本。
- `practice.html`: 核心刷题页，处理答题、判分、错题记录逻辑。
- `style.css`: 所有页面样式。

## 🚀 如何部署 (GitHub Pages)

由于项目使用了 `fetch` API 读取 JSON 文件，直接双击 HTML 打开（`file://` 协议）会因为跨域安全策略（CORS）导致题目无法加载。**必须使用 HTTP 服务器或部署到线上。**

### 步骤 1：上传代码
1. 在 GitHub 新建一个仓库（例如 `biology-practice`）。
2. 将上述 5 个文件上传到仓库根目录。

### 步骤 2：开启 GitHub Pages
1. 进入仓库的 **Settings** -> **Pages**。
2. 在 **Branch** 处选择 `main` (或 `master`)，文件夹选择 `/(root)`。
3. 点击 **Save**。
4. 等待几分钟，GitHub 会给出一个链接（例如 `https://yourname.github.io/biology-practice/`）。

### 步骤 3：在微信中使用
将生成的链接发送到微信文件传输助手，在手机上点击即可流畅刷题。

## ✨ 功能说明
1. **本地存储**：错题记录保存在浏览器 `localStorage` 中，关闭页面不丢失。
2. **错题机制**：
   - 答错自动加入错题本。
   - 答对（无论是在普通模式还是错题模式）会自动从错题本移除。
3. **解析折叠**：必须提交答案后，才能查看题目解析。

## ⚠️ 兼容性注意
- 针对 iOS/Android 的各种屏幕宽度做了 Flex 适配。
- 确保 `questions.json` 的 JSON 格式严格正确，否则无法加载题目。