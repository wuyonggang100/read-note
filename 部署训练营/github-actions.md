# github-actions 

中文文档  https://docs.github.com/cn/actions

通过查看 [官方 Actions](https://link.juejin.cn/?target=https://github.com/marketplace?type=actions) 和 [awesome-actions](https://link.juejin.cn/?target=https://github.com/sdras/awesome-actions)，找到所需的 Actions:



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
          # 此此项目的 main 为源码分支，当此分支被 push 时 ，就触发 action deploy
          branches:
            - main
      jobs:
        build-and-deploy:
          # 使用 ubuntu 服务器
          runs-on: ubuntu-latest
          steps:
            # 拉取代码
            - name: Checkout
              # 使用已有的action
              uses: actions/checkout@v2.3.1
              with:
                persist-credentials: false
            - name: Cache
              # cache 在这里主要用于缓存 npm，提升构建速率
              # https://github.com/actions/cache
              uses: actions/cache@v2
              # npm 缓存的路径可查看 https://docs.npmjs.com/cli/cache#cache
              # 由于这里 runs-on 是 ubuntu-latest，因此配置 ~/.npm
              with:
                path: ~/.npm
                key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
                restore-keys: |
                  ${{ runner.os }}-node-
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
      
                # 将本仓库的 gh-pages 分支作为静态部署分支，前提是此仓库为公开仓库，私有仓库会收费，
                BRANCH: gh-pages
                FOLDER: docs/.vuepress/dist
      
      ```

   3. 进入此项目的 actions ，可以看到 action 流程，进一步可以看到详细信息。部署成功后，访问 username.github.io/xxx 就可以看到部署的静态站点页面了；

      > username 是 github 账号，xxx 是项目仓库名

## 二、定时任务



## 三、基础概念与术语

> 持续集成由很多操作组成，比如拉取代码、执行测试用例、登录远程服务器，发布到第三方服务等等，GitHub 把这些操作就称为 actions。

- workflow（工作流程）：持续集成一次运行的过程，就是一个 workflow。
- job（任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
- step（步骤）：每个 job 由多个 step 构成，一步步完成。
- action（动作）：每个 step 可以依次执行一个或多个命令（action）。
- workflow 文件：GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的 .github/workflows 目录。

```sh
workflow 文件采用 YAML 格式，文件名可以任意取，但是后缀名统一为 .yml，比如 deploy.yml。一个库可以有多个 workflow 文件。GitHub 只要发现 .github/workflows 目录里面有 .yml 文件，就会自动运行该文件。
```

workflow 文件的配置字段非常多，这里列举一些基本字段。

- name : name 字段是 workflow 的名称。如果省略该字段，默认为当前 workflow 的文件名。

  ```sh
  name: deploy for feature_dev
  ```

- on：on 字段指定触发 workflow 的条件，通常是 push、pull_request。指定触发事件时，可以限定分支或标签。

  ```sh
  on:
    push:
      branches:
        - mian
  ```

  上面代码指定，只有 main 分支发生 push 事件时，才会触发 workflow。

- jobs：jobs 字段，表示要执行的一项或多项任务。其中的 runs-on 字段指定运行所需要的虚拟机环境。

  ```SH
  runs-on: ubuntu-latest
  ```

- steps：steps 字段指定每个 job 的运行步骤，可以包含一个或多个步骤。每个步骤都可以指定以下三个字段。
  - jobs.<job_id>.steps.name：步骤名称。
  - jobs.<job_id>.steps.run：该步骤运行的命令或者 action。
  - jobs.<job_id>.steps.env：该步骤所需的环境变量。



## 分支的合并策略 (主分支保护规则)

**生产环境的代码必须通过 CI 检测才能上线**，但这也需要我们进行手动设置。

一般而言，我们会设置以下策略加强代码的质量管理。

1. 主分支禁止直接 PUSH 代码
2. 代码都必须通过 PR 才能合并到主分支
3. **分支必须 CI 成功才能合并到主分支**
4. 代码必须经过 Code Review (关于该 PR 下的所有 Review 必须解决)
5. 代码必须两个人同意才能合并到主分支

















































