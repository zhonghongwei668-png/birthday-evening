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
pnpm lint
pnpm test
```

## 项目结构

- `app/`：页面入口、全局样式与页面 metadata
- `components/invitation/`：邀请流程、问题、计划、卡片与图片导出组件
- `data/invitation.ts`：问题、选项、晚餐风格和文案数据
- `styles/tokens.css`：纸张、文字、金色点缀与字体变量
- `tests/`：服务端渲染、内容结构与 PNG 导出约束检查
- `vercel.json`：Vercel 原生 Next.js 构建配置
- `DEPLOYMENT.md`：Sites/Vercel 部署说明与手机测试清单

## 个性化

在 `data/invitation.ts` 中修改 `RECIPIENT_NAME`，即可把页面中的 `XXX` 替换为邀请对象的名字。所有选择都保存在当前页面的 React state 中；点击“重新编辑”会保留答案并回到晚餐计划。

完整部署与手机验证方法见 `DEPLOYMENT.md`。
