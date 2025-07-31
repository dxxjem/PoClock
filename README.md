# 番茄时钟（Electron + Vue3 + Vite）

一个基于 Electron、Vue 3 和 Vite 的桌面番茄时钟应用，支持工作/休息自动切换、系统通知、无边框窗口、任务栏显示等特性。

## 功能特性
- 番茄工作法计时（工作/休息自动切换）
- 桌面系统通知提醒
- 无边框窗口，可拖动
- 支持 Windows 任务栏显示
- 一键打包为桌面应用
- 兼容 Windows 7 及以上系统

## 技术栈
- [Electron](https://www.electronjs.org/)（桌面端壳）
- [Vue 3](https://v3.vuejs.org/) + `<script setup>`
- [Vite](https://vitejs.dev/)（前端构建工具）
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design Vue](https://www.antdv.com/)（UI 组件）

## 安装与运行

1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发环境（热重载）：
   ```bash
   npm run dev
   ```
3. 打包生产版：
   ```bash
   npm run build
   ```

## Windows 7 兼容性说明

为了确保在 Windows 7 上正常运行，我们做了以下优化：

1. 使用 Electron v22.x 版本（最后一个支持 Windows 7 的版本）
2. 禁用硬件加速以提高兼容性
3. 添加错误处理以应对 Windows 7 上不支持的 API
4. 设置适当的渲染选项以确保在旧系统上正确显示

如果您在 Windows 7 上遇到任何问题，请尝试以下解决方案：

1. 确保已安装所有 Windows 更新
2. 安装最新的 Visual C++ 运行库
3. 如果遇到渲染问题，尝试以兼容模式运行程序

## 目录结构
```
├── electron/           # Electron 主进程代码
│   ├── main.ts
│   └── preload.ts
├── src/                # 前端源码
│   ├── App.vue
│   ├── main.ts
│   └── components/
│       └── PomodoroClock.vue
├── dist/               # 前端构建产物
├── dist-electron/      # Electron 构建产物
├── release/            # 打包输出（已被 .gitignore 忽略）
├── index.html
├── package.json
└── ...
```

## 开发建议
- 推荐使用 [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件进行 Vue 3 + TypeScript 开发。
- 若需类型检查，使用 `vue-tsc` 替代 `tsc`。

## 贡献
欢迎提交 issue 和 PR 改进本项目。

## License
MIT

## 发布日志

### v1.0.0
- 项目初始化，支持番茄工作法计时
- 自动切换工作/休息模式
- 系统通知提醒
- 无边框窗口、可拖动
- 支持 Windows 任务栏显示
- 一键打包为桌面应用
- 添加 Windows 7 兼容性支持
