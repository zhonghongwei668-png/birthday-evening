# 部署与手机测试

这个项目没有后端、数据库或登录依赖。填写中的答案会暂存在当前设备的浏览器中，刷新后可以继续；只有被邀请者主动点击分享或复制，答案才会发送给邀请人。

## 使用前生成邀请链接

打开网页后，由邀请人填写被邀请者名字并选择“她”或“他”，再复制生成的专属邀请链接发给对方。不需要为了更换邀请对象修改源代码。

## 当前 Sites 部署

项目保留了 vinext 构建，可以继续部署到 Sites：

```bash
pnpm install --frozen-lockfile
pnpm build
```

Sites 自动提供 HTTPS。当前私人预览可能带有工作区访问限制；如果希望把链接直接发给不在同一工作区的同学，建议使用下面的 Vercel 部署。

## GitHub Pages 一键自动更新（推荐）

项目已经包含 GitHub Pages 自动发布配置，适合绕开 `chatgpt.site` 的 Cloudflare 访问拦截。现有网页地址保持不变：

<https://zhonghongwei668-png.github.io/birthday-evening/>

### 第一次启用

1. 打开 GitHub 仓库 <https://github.com/zhonghongwei668-png/birthday-evening>。
2. 点击 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 回到 Mac 的项目文件夹，双击 **`发布到GitHub.command`**。
5. 第一次上传如果系统要求登录 GitHub，按窗口提示完成一次登录。程序不会在项目里保存密码。

源码会保存在独立的 `source` 分支，之前手动上传到 `main` 的文件不会被覆盖。

### 以后每次更新

1. 完成网页修改并保存。
2. 双击 **`发布到GitHub.command`**。
3. 输入一句更新说明，例如“优化邀请卡文案”；直接按回车也可以。
4. 等待窗口显示“发布完成”。
5. 打开仓库的 **Actions** 页面，最新任务变为绿色后，线上网页通常会在几分钟内更新。

发布程序会依次检查代码、测试邀请流程、生成 GitHub Pages 版本、记录版本并上传完整源文件。任何检查失败都会停止发布，不影响当前线上网页；程序也不会强制覆盖 GitHub 上的新改动。

也可以在项目终端中运行：

```bash
pnpm run publish:github
```

### 首次创建其他 GitHub Pages 仓库

如果以后把模板复制到另一个 GitHub 仓库，可按下面步骤配置：

1. 在 GitHub 新建一个公开仓库，例如 `birthday-evening`。不要直接覆盖已有的 `用户名.github.io` 主站，除非这个仓库本来就是专门放邀请页的。
2. 把本项目推送到仓库的 `source` 分支，并相应修改发布脚本中的仓库地址和网页地址。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
5. 打开 **Actions**，等待 **Deploy birthday invitation to GitHub Pages** 变为绿色。
6. 普通仓库的地址通常为：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名本身是 `你的用户名.github.io`，地址则为 `https://你的用户名.github.io/`。构建流程会自动处理这两种路径，不需要手动修改代码。

如果已经有独立域名，可在 **Settings → Pages → Custom domain** 中绑定；证书生成后开启 **Enforce HTTPS**。如果域名 DNS 使用 Cloudflare，为避免再次触发同类拦截，建议先使用 **DNS only**，不要开启代理。

本地模拟普通项目仓库的 GitHub Pages 构建：

```bash
GITHUB_REPOSITORY=你的用户名/birthday-evening \
GITHUB_REPOSITORY_OWNER=你的用户名 \
NEXT_PUBLIC_BASE_PATH=/birthday-evening \
NEXT_PUBLIC_SITE_URL=https://你的用户名.github.io/birthday-evening \
pnpm run build:github
```

静态文件会输出到 `out/`。GitHub Pages 是公开静态网站；页面虽然设置了 `noindex`，但任何拿到链接的人仍然可以访问。

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
3. 在未来 18 个月的日历中选择日期，再选择时间，确认过去日期不可选且“继续”立即可用。
4. 滚动到页面底部，确认底部按钮没有被 Safari 工具栏或安全区域遮挡。
5. 完成晚餐风格和见面方式，检查邀请卡上的日期、时间和风格。
6. 等待 3 秒，确认 P.S. 和低调说明淡入。
7. 点击“把我的选择发给邀请人”，确认手机分享菜单可用；不支持时应复制完整文字。
8. 点击 **Save this moment**，确认 PNG 可以保存或打开。
9. 刷新页面，确认之前填写的答案仍然存在。
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
- GitHub Pages 地址第一次分享前，先直接在微信里打开一次，确认没有 Cloudflare 拦截页。
