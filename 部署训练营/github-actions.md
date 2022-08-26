## github-actions 中文文档

  https://docs.github.com/cn/actions

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

























































