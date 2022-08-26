# 命令总览

```sh
FROM				# 每一个构建阶段的开始，设置后续构建依赖的基础镜像，可以有多个阶段
MAINTAINER			# 镜像是谁写的， 姓名+邮箱
RUN				# 镜像构建的时候需要运行的命令
ADD				# 步骤，tomcat镜像，这个tomcat压缩包！添加内容 添加同目录
WORKDIR				# 镜像的工作目录
VOLUME				# 挂载的目录
EXPOSE				# 保留端口配置
CMD				# 指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代。
ENTRYPOINT			# 指定这个容器启动的时候要运行的命令，可以追加命令
ONBUILD				# 当构建一个被继承 DockerFile 这个时候就会运行ONBUILD的指令，触发指令。
COPY				# 类似ADD，将我们文件拷贝到镜像中
ENV				# 构建的时候设置环境变量！
```



Dockerfile 执行 build 命令时，是从上到下依次执行的，Dockerfile 的基本组成部分如下。

| 主要部分           | 代表性命令                                                   |
| :----------------- | :----------------------------------------------------------- |
| 基础镜像信息       | FROM                                                         |
| 维护者信息         | MAINTAINER                                                   |
| 镜像操作指令       | RUN、COPY、ADD、EXPOSE、WORKDIR、ONBUILD、USER、VOLUME、ENV等 |
| 容器启动时执行指令 | CMD、ENTRYPOINT                                              |



### 1、FROM

- `FROM`指令开始一个新的构建阶段，设置后续构建依赖的基础镜像，`Dockerfile`必须以`FROM`开始（**除了 ARG 指令**）。镜像可以是任意有效镜像。

- FROM可以在一个Dockerfile中出现多次，以创建多个镜像或者将当前构建作为另一个构建的依赖。

- 通过向FROM指令添加AS name，可以选择为新生成阶段指定名称。该名称可以在后续的FROM和COPY --FROM=<name>指令中使用，以引用在此阶段中构建的镜像。

- `tag`或者`digest`的值是可选的。如果省略其中任何一个，则默认情况下，构建器使用`latest`作为默认值。如果找不到`tag`的值，则构建器返回错误。

  ```sh
  # 语法
  FROM [--platform=<platform>] <image> [AS <name>]
  FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
  FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
  # 示例
  FROM nginx AS firstNginx
  # 错误方式，tag 不存在
  FROM nginx:109  
  ```

  

### 2、ARG

- FROM 指令支持由出现在第一个 FROM 之前的任何 ARG 指令声明的变量

  ```sh
  ARG  CODE_VERSION=latest
  FROM base:${CODE_VERSION}
  CMD  /code/run-app
  
  FROM extras:${CODE_VERSION}
  CMD  /code/run-extras
  ```

- 在 FROM 之前声明的 ARG 在构建阶段之外，因此不能直接在 FROM 之后的任何指令中使用

- 要使用在第一个 FROM 之前声明的 ARG 的默认值，要在构建阶段内重新声明一次没有值的 ARG 指令

  ```sh
  ARG VERSION=latest
  FROM busybox:$VERSION # FROM 中可以直接使用
  ARG VERSION # 重新声明才能使用
  RUN echo $VERSION > image_version
  ```

### 3、MAINTAINER

> 维护者信息

```sh
MAINTAINER Buger@qq.com
MAINTAINER Buger <Buger@qq.com>
```

### 4、LABEL

### 5、WORKDIR 

### 6、ADD

将本地文件添加到容器中，tar 类型文件会自动解压；可以访问网络资源，类似 wget；如果目的位置不存在，Docker 会自动创建所需要的目录；

```sh
格式：
    ADD <src>... <dest>
    ADD ["<src>",... "<dest>"] 用于支持包含空格的路径
示例：
    ADD hom* /mydir/          # 添加所有以"hom"开头的文件
    ADD hom?.txt /mydir/      # ? 替代一个单字符,例如："home.txt"
    ADD test relativeDir/     # 添加 "test" 到 `WORKDIR`/relativeDir/
    ADD test /absoluteDir/    # 添加 "test" 到 /absoluteDir/
```

### 7、COPY

### 8、EXPOSE

指定暴露镜像的端口供主机做映射， 可以提供在 docker-compose.yaml  中使用；

### 9、VOLUME

添加卷，用于指定持久化目录

### 10、USER

### 11、ONBUILD

12、CMD

13、RUN

14、ENTRYPOINT

示例说明

```sh
# 第一构建阶段:将仅用于生成 requirements.txt 文件
FROM tiangolo/uvicorn-gunicorn:python3.9 as requirements-stage

# 将当前工作目录设置为 /tmp
WORKDIR /tmp

# 生成 requirements.txt
RUN touch requirements.txt

# 第二构建阶段，在这往后的任何内容都将保留在最终容器映像中
FROM python:3.9

# 将当前工作目录设置为 /code
WORKDIR /code

# 复制 requirements.txt;这个文件只存在于前一个 Docker 阶段，这就是使用 --from-requirements-stage 复制它的原因
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

# 运行命令
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 复制
COPY ./app /code/app
```

