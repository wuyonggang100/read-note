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

> 指定当前构建阶段的基础镜像

- `FROM`指令开始一个新的构建阶段，设置后续构建依赖的基础镜像，`Dockerfile`必须以`FROM`开始（**除了 ARG 指令**）。镜像可以是任意有效镜像。

- **多阶段构建**：FROM可以在一个Dockerfile中出现多次，以创建多个镜像或者将当前构建作为另一个构建的依赖。通过向FROM指令添加AS name，可以选择为新生成阶段指定名称。该名称可以在后续的FROM和COPY --FROM=<name>指令中使用，以引用在此阶段中构建的镜像。

  ```sh
  # 给阶段命名
  FROM node:14-alpine as builder 
  
  WORKDIR /code
  
  # 单独分离 package.json，是为了安装依赖可最大限度利用缓存
  ADD package.json yarn.lock /code/
  RUN yarn
  
  ADD . /code
  RUN npm run build
  
  FROM nginx:alpine
  # 使用上一阶段的镜像，将其工作目录中的某些文件进行复制
  COPY --from=builder code/build /usr/share/nginx/html
  ```

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


### 2、ENV

> 设置环境变量，

- 格式有两种，如下

  - `ENV <key> <value>`

  - `ENV <key1>=<value1> <key2>=<value2>...`

    ```sh
    ENV NODE_VERSION 7.2.0 
    # 或
    ENV VERSION=1.0 DEBUG=on \
        NAME="Happy Feet"
    ```

- 下列指令可以支持环境变量展开： `ADD`、`COPY`、`ENV`、`EXPOSE`、`FROM`、`LABEL`、`USER`、`WORKDIR`、`VOLUME`、`STOPSIGNAL`、`ONBUILD`、`RUN`。

  可以从这个指令列表里感觉到，环境变量可以使用的地方很多，很强大。通过环境变量，我们可以让一份 `Dockerfile` 制作更多的镜像，只需使用不同的环境变量即可。

  ```sh
  # 使用就直接用 $变量  即可，不需要其他的符号包裹
  ENV NODE_VERSION 7.2.0
  
  RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" 
  ```

### 3、ARG

> 构建参数，和 ENV 的效果一样，都是设置环境变量，`ARG` 所设置的构建环境的环境变量，在将来容器运行时是不会存在这些环境变量的。但是不要因此就使用 `ARG` 保存密码之类的信息，因为 `docker history` 还是可以看到所有值的。

- `ARG` 指令是定义参数名称，以及定义其默认值。该默认值可以在构建命令 `docker build` 中用 `--build-arg <参数名>=<值>` 来覆盖。

- ARG 指令有生效范围，如果在 `FROM` 指令之前指定，那么只能用于 `FROM` 指令中，FROM 指令支持由出现在第一个 FROM 之前的任何 ARG 指令声明的变量，在 FROM 之前声明的 ARG 在构建阶段之外，因此不能直接在 FROM 之后的任何指令中使用

  ```sh
  ARG  CODE_VERSION=latest # 只在 FROM指令中生效
  FROM base:${CODE_VERSION}
  CMD  /code/run-app
  
  FROM extras:${CODE_VERSION} # 支持此参数
  CMD  /code/run-extras
  RUN set -x ; echo ${CODE_VERSION} # 不支持此参数，需要在此行前重新指定
  ```

- 要使用在第一个 FROM 之前声明的 ARG 的默认值，要在同一个构建阶段内重新声明一次没有值的 ARG 指令，对于在各个阶段中使用的变量都必须在每个阶段分别指定：

  ```sh
  ARG VERSION=latest
  FROM busybox:$VERSION # FROM 中可以直接使用
  ARG VERSION # 重新声明才能使用
  RUN echo $VERSION > image_version
  ```

- 灵活的使用 `ARG` 指令，能够在不修改 Dockerfile 的情况下，构建出不同的镜像。

  ```sh
  ARG DOCKER_USERNAME=library
  FROM ${DOCKER_USERNAME}/alpine
  RUN set -x ; echo ${DOCKER_USERNAME} #无法直接使用
  ```

- ARG 可通过 `docker build --build-arg` 抑或 `docker-compose` 进行传入。如下的三个变量就是就收外部传入的环境变量。可以在 linux 宿主机中设置环境变量，然后通过 docker-compose 中的 build.args 将环境变量传递给 Dockerfile ；

  - 宿主机中设置变量

    ```sh
    export ACCESS_KEY_ID=LTshanyueoworlJEdoPhello
    export ACCESS_KEY_SECRET=bhZHelloShanzOxsHelloshanIyueM
    ```

  - docker-compose 传递

    ```sh
    version: "3"
    services:
      oss:
        build:
          context: .
          dockerfile: xxx.Dockerfile
          args:
            - ACCESS_KEY_ID
            - ACCESS_KEY_SECRET
        ports:
          - 8000:80
    ```

  - dockerfile 接收并声明

    ```sh
    ARG ACCESS_KEY_ID
    ARG ACCESS_KEY_SECRET
    ARG ENDPOINT
    ```

### 4、MAINTAINER

> 维护者信息

```sh
MAINTAINER Buger@qq.com
MAINTAINER Buger <Buger@qq.com>
```

### 5、LABEL

用来给镜像以键值对的形式添加一些元数据（metadata），还可以用一些标签来申明镜像的作者、文档地址等。

```sh
LABEL org.opencontainers.image.authors="yeasy"
LABEL org.opencontainers.image.documentation="https://yeasy.gitbooks.io"
```

### 6、WORKDIR 

指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，`WORKDIR` 会帮你建立目录。如果需要改变以后各层的工作目录的位置，应该使用 `WORKDIR` 指令;

如果你的 `WORKDIR` 指令使用的相对路径，那么所切换的路径与之前的 `WORKDIR` 有关：

```sh
# RUN pwd 的工作目录为 /a/b/c
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```

指定工作目录后，后续执行的 RUN ，ADD 等操作都在指定的目录中执行；

### 7、ADD

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

1. 源路径可以是一个 url ，docker引擎胡试图下载这个文件。下载后的文件权限自动设置为 `600`，如果这并不是想要的权限，那么还需要增加额外的一层 `RUN` 进行权限调整，另外，如果下载的是个压缩包，需要解压缩，也一样还需要额外的一层 `RUN` 指令进行解压缩。所以不如直接使用 `RUN` 指令，然后使用 `wget` 或者 `curl` 工具下载，处理权限、解压缩、然后清理无用文件更合理。因此，这个功能其实并不实用，而且不推荐使用**URL**方式。

2. 如果 `<源路径>` 为一个 `tar` 压缩文件的话，压缩格式为 `gzip`, `bzip2` 以及 `xz` 的情况下，`ADD` 指令将会自动解压缩这个压缩文件到 `<目标路径>` 去。

   ```SH
   FROM scratch
   ADD ubuntu-xenial-core-cloudimg-amd64-root.tar.gz /
   ...
   ```

3. 在某些情况下，如果我们真的是希望复制个压缩文件进去，而不解压缩，这时就不可以使用 `ADD` 命令,要使用 copy 命令；`ADD` 指令会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢；

4. 在 `COPY` 和 `ADD` 指令中选择的时候，可以遵循这样的原则，所有的文件复制均使用 `COPY` 指令，仅在需要自动解压缩的场合使用 `ADD`。

5. 在使用该指令的时候还可以加上 `--chown=<user>:<group>` 选项来改变文件的所属用户及所属组。

   ```sh
   ADD --chown=55:mygroup files* /mydir/
   ADD --chown=bin files* /mydir/
   ADD --chown=1 files* /mydir/
   ADD --chown=10:11 files* /mydir/
   ```

### 8、COPY

1. 格式
   - `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`
   - `COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]`

2. `COPY` 指令将从构建上下文目录中 `<源路径>` 的文件/目录复制到新的一层的镜像内的 `<目标路径>` 位置。`<目标路径>` 可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 `WORKDIR` 指令来指定）。目标路径不需要事先创建，指令会自行创建。如果源路径为文件夹，复制的时候不是直接复制该文件夹，而是将文件夹中的内容复制到目标路径

3. 使用 `COPY` 指令，源文件的各种元数据都会保留。比如读、写、执行权限、文件变更时间等。这个特性对于镜像定制很有用。特别是构建相关文件都在使用 Git 进行管理的时候。

4. 使用该指令的时候还可以加上 `--chown=<user>:<group>` 选项来改变文件的所属用户及所属组；

   ```dockerfile
   COPY --chown=55:mygroup files* /mydir/
   COPY --chown=bin files* /mydir/
   COPY --chown=1 files* /mydir/
   COPY --chown=10:11 files* /mydir/
   ```

### 9、EXPOSE

指定暴露镜像的端口供主机做映射， 可以提供在 docker-compose.yaml  中使用；

> 格式为 `EXPOSE <端口1> [<端口2>...]`

- 要将 `EXPOSE` 和在运行时使用 `-p <宿主端口>:<容器端口>` 区分开来。`-p`，是映射宿主端口和容器端口，换句话说，就是将容器的对应端口服务公开给外界访问，而 `EXPOSE` 仅仅是声明容器打算使用什么端口而已，并不会自动在宿主进行端口映射。

### 10、VOLUME

添加卷，用于指定持久化目录，将本地目录与容器目录对应关联映射起来。主要作用是避免重要数据因容器重启而丢失，避免容器不断变大；格式如下：

```sh
VOLUME <path>
VOLUME ["<path1>", "<path2>", ...]
```

- 容器运行时应该尽量保持容器存储层不发生写操作，对于数据库类需要保存动态数据的应用，其数据库文件应该保存于卷(volume)中；

- 为了防止运行时用户忘记将动态文件所保存目录挂载为卷，在 `Dockerfile` 中，我们可以事先指定某些目录挂载为匿名卷，这样在运行时如果用户不指定挂载，其应用也可以正常运行，不会向容器存储层写入大量数据。

  ```sh
  VOLUME /data
  ```

  这里的 `/data` 目录就会在容器运行时自动挂载为匿名卷，任何向 `/data` 中写入的信息都不会记录进容器存储层，从而保证了容器存储层的无状态化。当然，运行容器时可以覆盖这个挂载设置。比如：

  ```sh
  docker run -d -v mydata:/data xxxx
  ```

  在这行命令中，就使用了 `mydata` 这个命名卷挂载到了 `/data` 这个位置，替代了 `Dockerfile` 中定义的匿名卷的挂载配置。

### 11、USER

切换到指定用户，这个用户必须是事先建立好的，否则无法切换；格式：`USER <用户名>[:<用户组>]`

- 会改变环境状态并影响以后的层。`WORKDIR` 是改变工作目录，`USER` 则是改变之后层的执行 `RUN`, `CMD` 以及 `ENTRYPOINT` 这类命令的身份；
- 如果以 `root` 执行的脚本，在执行期间希望改变身份，比如希望以某个已经建立好的用户来运行某个服务进程，不要使用 `su` 或者 `sudo`，这些都需要比较麻烦的配置，而且在 TTY 缺失的环境下经常出错。建议使用 [`gosu`](https://github.com/tianon/gosu)

### 12、ONBUILD

当A 镜像的 dockerfile 构建的镜像被别的 dockerfile 使用时，就会执行A 的 dokerfile 里的 ONBUILD 指令；可以实现镜像的复用；

如 A ，构建得到的镜像名为 my-node；

```sh
FROM node:slim
RUN mkdir /app
WORKDIR /app
ONBUILD COPY ./package.json /app
ONBUILD RUN [ "npm", "install" ]
ONBUILD COPY . /app/
CMD [ "npm", "start" ]
```

B，C，D 等都以 A 为基础镜像，只需要改变 A 就可以复用，当 B,C,D 的镜像构建时，就会执行 A 中的 ONBUILD 指令，并成功的将B,C,D项目的代码复制进镜像、并且针对各自项目执行 `npm install`，生成应用镜像。

```sh
FROM my-node
```

### 13、CMD

- 指定默认的容器主进程的启动命令，有 exec 和 shell 两种方式；
  - `shell` 格式：`CMD <命令>`

    ```sh
    CMD npm start # 启动
    ```

    

  - `exec` 格式：`CMD ["可执行文件", "参数1", "参数2"...]`

  - 参数列表格式：`CMD ["参数1", "参数2"...]`。在指定了 `ENTRYPOINT` 指令后，用 `CMD` 指定具体的参数。

  - 使用 shell 格式时，实际命令会被包装成``sh -c 的参数形式来执行``

    ```sh
    CMD echo $HOME 
    # 执行时会变更为 
    CMD [ "sh", "-c", "echo $HOME" ] 
    ```

- 在运行时可以指定新的命令来替代镜像设置中的这个默认 CMD 命令;

  > 如`ubuntu` 镜像默认的 `CMD` 是 `/bin/bash`，如果我们直接 `docker run -it ubuntu` 的话，会直接进入 `bash`。我们也可以在运行时指定运行别的命令，如 `docker run -it ubuntu cat /etc/os-release`。这就是用 `cat /etc/os-release` 命令替换了默认的 `/bin/bash` 命令了，输出了系统版本信息。

### 14、RUN

### 15、ENTRYPOINT

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

