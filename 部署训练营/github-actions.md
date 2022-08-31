# github-actions 

中文文档  https://docs.github.com/cn/actions

## 一、giuthub pages

### 概述

任意 github 仓库都可以使用 github pages 部署，公开仓库是免费的，私有仓库需要升级后收费才可以；

### 实战

1. github 上新建 xxx 公开仓库；

2. 选择指定分支作为部署源；

   > - 依次进入此仓库的 settings ---> 左侧 pages --> Build and deployment --> 选择分支作为部署源(deploy from a branch) ---> 选择指定分支 (branch) ---> save ; 
   > - 如果没有目标分支，可以先走后面的步骤，等到 deploy 后会创建一个新分支，此时再选择部署分支也可以；

3. 编写 github action 配置文件。

   1. 在项目根目录下创建 .github/workflows/xxx.yml ; 

      > xxx 可以自定义

   2. 加入以下代码

      > 简单描述下就是：当此项目的 main 分支被 push 时，就会触发部署，会将编译后的代码推送到 gh-pages 分支，此分支名可以自定义；

      ```yml
      name: 'github actions build and deploy vue-press'
      on:
        push:
          # 项目的 main 为源码分支，当此分支被 push 时 ，就触发 action deploy
          branches:
            - main
      jobs:
        build-and-deploy:
          # 使用 ubuntu 服务器
          runs-on: ubuntu-latest
          steps:
            # 拉取代码
            - name: Checkout
              uses: actions/checkout@v2.3.1
              with:
                persist-credentials: false
            - name: install and build
              run: |
                npm install
                npm run build
      
            - name: Deploy
              # 使用别人写好的 action 部署
              uses: JamesIves/github-pages-deploy-action@releases/v3
              with:
                # ACCESS_TOKEN 需要到 github 上去增加一个secrets，并命名为 ACCESS_TOKEN
                ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
      
                # GITHUB_TOKEN 为内置变量，无需在secrets手动添加
                # GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
                # 将本仓库的 gh-pages 分支作为静态部署分支，前提是此仓库为分私有仓库，
                BRANCH: gh-pages
                FOLDER: docs/.vuepress/dist
      ```

   3. 进入此项目的 actions ，可以看到 action 流程，进一步可以看到详细信息。部署成功后，访问 username.github.io/xxx 就可以看到部署的静态站点页面了；

      > username 是 github 账号，xxx 是项目仓库名

## 二、定时任务



## 基础概念与术语

每一家 CICD 产品，都有各自的配置方式，但是总体上用法差不多。我们了解下 CICD 的基本术语

- `Runner`: 用来执行 CI/CD 的构建服务器
- `workflow/pipeline`: CI/CD 的工作流。(在大部分 CI，如 Gitlab 中为 Pipeline，而 Github 中为 Workflow，但二者实际上还是略有不同)
- `job`: 任务，比如构建，测试和部署。每个 `workflow`/`pipeline` 由多个 `job` 组成。、





## 分支的合并策略 (主分支保护规则)

**生产环境的代码必须通过 CI 检测才能上线**，但这也需要我们进行手动设置。

一般而言，我们会设置以下策略加强代码的质量管理。

1. 主分支禁止直接 PUSH 代码
2. 代码都必须通过 PR 才能合并到主分支
3. **分支必须 CI 成功才能合并到主分支**
4. 代码必须经过 Code Review (关于该 PR 下的所有 Review 必须解决)
5. 代码必须两个人同意才能合并到主分支

















































