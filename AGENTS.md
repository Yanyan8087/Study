# Study - AGENTS.md

## 项目入口

项目名称：Study
项目用途：学习
主要工作目录：C:\Users\Yan\Documents\New project 3
GitHub repo：https://github.com/Yanyan8087/Study
默认 branch：main

## Obsidian 对应笔记

Obsidian vault：D:\obsidian\yan
项目驾驶舱：Study\专案工作流程.md
收工时优先更新：Study\专案工作流程.md

> 注意：项目驾驶舱是 Obsidian vault 里的进度笔记，不是项目工作资料夹里的 Markdown 文件。

## 工作桌 + 三个家

- 工作桌：C:\Users\Yan\Documents\New project 3
- GitHub：https://github.com/Yanyan8087/Study，公开 repo，启用 GitHub Pages
- Obsidian：D:\obsidian\yan + Study\专案工作流程.md
- Firebase：study-94c9b

## 同步规则

开工时：
- 使用 `startup-sync` 流程
- 读取本文件
- 读取 Obsidian 项目驾驶舱
- 检查 Git 状态
- 不自动 pull / commit / push

收工时：
- 使用 `shutdown-sync` 流程
- 更新 Obsidian 项目驾驶舱
- 如规则、路径、项目边界改变，才更新本文件
- 检查 Git diff
- 只提交本次相关文件
- 需要时 commit + push 到 GitHub

新项目初始化时：
- 使用 `project-init-sync` 流程

## 主要文件

入口文件：
- AGENTS.md
- README.md

设定文件：
- firebase.json
- firestore.rules
- .firebaserc

部署位置：
- Firebase Hosting public：wordcloud
- GitHub Pages：https://yanyan8087.github.io/Study/

## 不要做

- 不要把每日进度写进 AGENTS.md；进度写到 Obsidian 驾驶舱
- 不要自动纳入无关 Git 变更
- 不要把 API key、token、密码、凭证写进 repo
- 不要储存学生真实姓名；正式资料只用座号、班级或代号
- 不要把本机 Codex 设定目录提交到 Git
