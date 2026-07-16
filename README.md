# A Little Birthday Evening

一份手机端优先的私人生日晚餐邀请。体验以数字邀请函的方式逐页展开：四个轻松问题、日期与时间、晚餐风格、见面方式，最后生成可保存为 PNG 的动态邀请卡。

页面使用系统字体、纯 CSS 纸张质感和轻量 transform/opacity 动画；没有音乐、照片请求或首屏阻塞字体。`html2canvas` 仅在保存卡片时按需加载。

## 本地运行

需要 Node.js `>=22.13.0` 与 pnpm。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 构建与检查

```bash
pnpm build
pnpm run build:vercel
pnpm run build:github
pnpm lint
pnpm test
```

## 一键更新 GitHub 网页

第一次启用时，在 GitHub 仓库打开 **Settings → Pages**，把 **Build and deployment → Source** 设为 **GitHub Actions**。

以后每次完成修改，只需在 Finder 中双击项目根目录的 **`发布到GitHub.command`**：

1. 程序自动检查页面和手机网页版本。
2. 输入一句本次更新说明，也可以直接按回车使用当前时间。
3. 程序把完整源文件上传到 GitHub 的 `source` 分支。
4. GitHub 自动生成并更新 <https://zhonghongwei668-png.github.io/birthday-evening/>。

程序不会强制覆盖远程文件，也不会把 GitHub 密码或 `.env` 配置上传到仓库。检查失败时，线上网页保持原样。

## 项目结构

- `app/`：页面入口、全局样式与页面 metadata
- `components/invitation/`：邀请流程、问题、计划、卡片与图片导出组件
- `data/invitation.ts`：问题、选项、晚餐风格和文案数据
- `styles/tokens.css`：纸张、文字、金色点缀与字体变量
- `tests/`：服务端渲染、内容结构与 PNG 导出约束检查
- `vercel.json`：Vercel 原生 Next.js 构建配置
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动发布配置
- `scripts/publish-github.sh`：检查、记录版本并上传源文件
- `发布到GitHub.command`：Mac 双击发布入口
- `DEPLOYMENT.md`：Sites、GitHub Pages、Vercel 部署说明与手机测试清单

## 作为通用模板使用

打开网页后，邀请人先填写被邀请者名字并选择“她”或“他”，再生成专属链接发给对方。被邀请者通过链接填写问题、选择 2026 年任意日期和晚餐安排；点击“重新编辑”会保留已经填写的答案。

完整部署与手机验证方法见 `DEPLOYMENT.md`。
