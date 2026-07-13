# 部署与手机测试

这个项目没有后端、数据库或登录依赖。问题答案只保存在当前页面的 React state 中，刷新页面会重新开始。

## 部署前个性化

打开 `data/invitation.ts`，把 `RECIPIENT_NAME` 的 `XXX` 改成邀请对象的名字。

## 当前 Sites 部署

项目保留了 vinext 构建，可以继续部署到 Sites：

```bash
pnpm install --frozen-lockfile
pnpm build
```

Sites 自动提供 HTTPS。当前私人预览可能带有工作区访问限制；如果希望把链接直接发给不在同一工作区的同学，建议使用下面的 Vercel 部署。

## 部署到 Vercel

1. 把项目上传到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 选择 **Add New → Project**，导入仓库。
3. Framework Preset 选择 **Next.js**，Root Directory 保持项目根目录。
4. 项目已经提供 `vercel.json`，Vercel 会使用 `pnpm run build:vercel`。
5. 点击 Deploy。Vercel 会自动提供 HTTPS 和可分享域名。
6. 首次部署完成后，可在 Vercel 的 Environment Variables 中添加：

```text
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

重新部署一次后，分享预览图和 canonical 地址会使用正式域名。除此之外不需要环境变量。

本地验证 Vercel 构建：

```bash
pnpm run build:vercel
```

## 手机测试方法

### iPhone Safari

1. 用真实分享链接打开网页，检查首次 loading 是否很快消失。
2. 从欢迎页完成四个轻松问题，确认返回上一页后选择仍然保留。
3. 在 7 月日历选择日期，再选择时间，确认“继续”立即可用。
4. 滚动到页面底部，确认底部按钮没有被 Safari 工具栏或安全区域遮挡。
5. 完成晚餐风格和见面方式，检查邀请卡上的日期、时间和风格。
6. 等待 3 秒，确认 P.S. 和低调说明淡入。
7. 点击 **Save this moment**，确认 PNG 可以保存或打开。
8. 开启“减少动态效果”后再走一次流程，确认没有长等待和明显位移动画。

### Android Chrome

1. 在 360px 左右宽度的安卓手机打开链接。
2. 快速点选日期、时间和答案，确认没有误触或明显卡顿。
3. 检查页面不存在左右拖动或横向滚动。
4. 点击返回、重新编辑，确认答案没有丢失。
5. 点击 **Save this moment**，确认下载文件为 PNG。

### 通用检查

- 分别测试 320、360、375、390 和 430px 宽度。
- 所有文字放大到 200%，仍应能滚动到操作按钮。
- 页面不应请求音频，也不会自动播放音乐。
- `html2canvas` 只会在保存邀请卡时加载，不影响首次打开速度。
- 分享链接时应出现 `A Little Birthday Evening` 的米白金色预览卡。
