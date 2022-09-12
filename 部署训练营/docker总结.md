# 一、概念

## 1、三大概念

### 1.1 镜像

- **Docker 镜像** 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像 **不包含** 任何动态数据，其内容在构建之后也不会被改变。

- 因为镜像包含操作系统完整的 `root` 文件系统，其体积往往是庞大的，因此在 Docker 设计时，就充分利用 [Union FS (opens new window)](https://en.wikipedia.org/wiki/Union_mount)的技术，将其设计为分层存储的架构。所以严格来说，镜像并非是像一个 `ISO` 那样的打包文件，镜像只是一个虚拟的概念，其实际体现并非由一个文件组成，而是由一组文件系统组成，或者说，由多层文件系统联合组成。

  镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。

  分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。



### 1.2 容器

镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 [命名空间 (opens new window)](https://en.wikipedia.org/wiki/Linux_namespaces)。因此容器可以拥有自己的 `root` 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。也因为这种隔离的特性，很多人初学 Docker 时常常会混淆容器和虚拟机。

前面讲过镜像使用的是分层存储，容器也是如此。每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为 **容器存储层**。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。

按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用 [数据卷（Volume）](https://vuepress.mirror.docker-practice.com/data_management/volume.html)、或者 [绑定宿主目录](https://vuepress.mirror.docker-practice.com/data_management/bind-mounts.html)，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失。

### 1.3 仓库

镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务， [Docker Registry](https://vuepress.mirror.docker-practice.com/repository/registry.html) 就是这样的服务。

一个 **Docker Registry** 中可以包含多个 **仓库**（`Repository`）；每个仓库可以包含多个 **标签**（`Tag`）；每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 `<仓库名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest` 作为默认标签。

以 [Ubuntu 镜像 (opens new window)](https://hub.docker.com/_/ubuntu)为例，`ubuntu` 是仓库的名字，其内包含有不同的版本标签，如，`16.04`, `18.04`。我们可以通过 `ubuntu:16.04`，或者 `ubuntu:18.04` 来具体指定所需哪个版本的镜像。如果忽略了标签，比如 `ubuntu`，那将视为 `ubuntu:latest`。

仓库名经常以 *两段式路径* 形式出现，比如 `jwilder/nginx-proxy`，前者往往意味着 Docker Registry 多用户环境下的用户名，后者则往往是对应的软件名。但这并非绝对，取决于所使用的具体 Docker Registry 的软件或服务。

分为 公开服务和私有服务

# 二、docker 的使用

2.1 安装和卸载

```sh
# 卸载旧版本
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
# 安装yum工具
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2 --skip-broken
# 设置docker镜像源为阿里云
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 安装 docker 社区版，免费
sudo yum install -y docker-ce docker-ce-cli containerd.io # 完整安装
yum install -y docker-ce # 非完整安装
# 启动docker
systemctl start docker
# 配置镜像加速
sudo mkdir -p /etc/docker

# 在文件夹内新建一个daemon.json文件
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://akchsmlh.mirror.aliyuncs.com"]
}
EOF

# 重新加载文件
sudo systemctl daemon-reload
# 重启docker
sudo systemctl restart docker
```



2.2 启动 

```sh
systemctl start docker
```

2.3 停止

```sh
systemctl stop docker
```

2.4 重启

```sh
systemctl restart docker
```

2.5 查看状态

```sh
systemctl status docker
```

2.6 设置开机启动

```sh
systemctl enable docker
# 或者
systemctl enable docker.service
# 关闭开机启动
systemctl disable docker.service
```

2.7 查看版本信息，概要

```sh
docker version
docker -v
docker info
```

# 三、镜像仓库的使用

1. 给Docker守护进程配置加速器

   通过配置文件启动Docker,修改/etc/docker/daemon.json 文件并添加上 registry-mirrors 键值。

   ```
   vim /etc/docker/daemon.json
   {
     "registry-mirrors”:["http://hub-mirror.c.163.com", "https://registry.docker-cn.com"]
   }
   ```

2. 修改 docker 镜像源以加速下载

   > 网易镜像 http://hub-mirror.c.163.com
   >
   > Docker 官方中国区      [ https://registry.docker-cn.com](https://link.jianshu.com/?t=https%3A%2F%2Fregistry.docker-cn.com%2F)
   >
   > 中国科技大学    [https://docker.mirrors.ustc.edu.cn](https://link.jianshu.com/?t=https%3A%2F%2Fdocker.mirrors.ustc.edu.cn%2F)
   >
   > 阿里云     [https://pee6w651.mirror.aliyuncs.com](https://link.jianshu.com/?t=https%3A%2F%2Fpee6w651.mirror.aliyuncs.com%2F)

   

   ```sh
   # 运行如下命令
   cat > /etc/docker/daemon.json << EOF
   {
    "registry-mirrors": ["http://hub-mirror.c.163.com",  "https://b9pmyelo.mirror.aliyuncs.com"]
   }
   EOF
   
   # 或者使用 vim 方式修改
   vim /etc/docker/daemon.json
   
   {
   “registry-mirrors”:["http://hub-mirror.c.163.com", "https://registry.docker-cn.com"]
   }
   ```

   重启服务：

   ```sh
   systemctl restart docker
   ```

   查看镜像源

   ```sh
   cat /etc/docker/daemon.json
   # 或者使用
   docker info 也可以看到镜像源地址
   ```

   

# 四、镜像的使用

1. 从仓库拉取镜像, 默认仓库是 dockerhub 即 docker.io

   ```sh
   docker pull tomcat:8
   docker pull hub.c.163.com/public/ubuntu:18.04 # 指定镜像源拉取
   ```

2. 运行镜像

   > docker run [选项] image

   ```sh
   docker run -i -t docker.io/mysql /bin/bash  # 进入交互式
   ```

   

   ```sh
   docker run -itd --privileged=true --name test --hostname test --restart unless-stopped --net=host  --cpus=1 -m 512M  \
   -v /tmp:/tmp -w /opt -p 80:80  -e MYSQL_IP=192.168.1.1 --device=/dev/uhid docker.io/nginx:latest bash
   ```

   options 选项参数如下

   --rm 退出容器后，容器会被删除，常用于测试

   --host xxx  设置容器里面的主机名为xxx，登陆到容器里面可以看到

   --restart   **容器退出时的重启策略（4种）**  

   > **更改已运行容器的重启策略**     docker update --restart=always test

   - no，默认策略，在容器退出时不重启容器、
   - on-failure，在容器非正常退出时（退出状态非0），才重启容器
     on-failure:3，在容器非正常退出时重启容器，最多重启3次
   - always，在容器退出时总是重启容器，包含开机启动
   - unless-stopped，在容器退出时总是重启容器，如果容器正常stopped，然后机器重启或docker服务重启，容器将不会被restart

   --itd    就是 -it 和 -d 的组合， -it 是进入交互式操作并且进入终端命令行，-d 是 --detach 的简写  是在后台运行器，非后台运行时会跟踪打印日志；

   -v 是容器卷，:前面是宿主机路径，后面是容器里面的路径

   -w 是指定容器的工作目录，

   -p 是端口映射，: 前面是宿主机端口，后面是容器端口，实现方式为iptables；

   -e  给声明环境变量， --env 的简写，在容器内部可以通过export查看

   --device  增加主机的一个设备到容器，也就是让容器拥有访问这个设备的权限

   --dns   手动指定容器内部的DNS

   --cpus=1 -m 512M   设置容器CPU和内存的使用上限

   --network  指定容器的网络

   > 标准Docker支持4种网络模式

   - bridge 		使用docker daemon指定的网桥，默认为docker0；使用--net=bridge指定，为默认设置
   - host 		容器使用主机的网络
   - container:NAME_or_ID >		使用其他容器的网络，共享IP和PORT等网络资源
   - none 		容器使用自己的网络,使用--net=none指定

   bash  放在镜像名后面，使用交互式 shell

3. 查看镜像

   > 中间层镜像：无标签的镜像很多都是中间层镜像，是其它镜像所依赖的镜像。这些无标签镜像不应该删除，否则会导致上层镜像因为依赖丢失而出错。删除依赖镜像后，被依赖的中间层镜像也会被删除；

   ```sh
   docker image ls # 加 -a 会显示包含中间层镜像在内的所有镜像， 不加就只显示顶层镜像
   docker images -a  # 不加 -a 就是查看运行中的镜像
   ```

4. 查看虚悬镜像，也就是 <none> 镜像，一般是同版本新的镜像替代旧的镜像后，旧镜像名被新镜像拥有，然后旧镜像就变成 <none>

   ```sh
   docker image ls -f dangling=true
   ```

   一般来说，虚悬镜像已经失去了存在的价值，是可以随意删除的，可以用下面的命令删除

   ```sh
   docker image prune
   ```

5. 获取镜像列表

   ```sh
   docker search mysql
   ```

6. 删除本地镜像

   ```sh
   docker image rm $(docker image ls -q redis)  # 删除所有仓库名为 redis 的镜像
   docker image rm $(docker image ls -q -f before=mongo:3.2)  # 删除所有在 mongo:3.2 之前的镜像
   docker rmi xxx # 删除指定镜像，可以是镜像名或 id
   docker image rm centos # 删除指定容器
   ```

# 五、容器的使用

```sh
https://www.dandelioncloud.cn/article/details/1458248553532579842
1、新建并启动容器
2、列出当前所有正在运行的容器
3、退出容器
4、启动已经停止的容器
5、重启容器
6、停止容器
7、删除容器
8、启动守护式容器
9、查看容器日志
10、查看容器内运行的进程
11、查看容器内部细节
12、进入正在运行的容器并以命令行交互
13、从容器内拷贝文件到主机上


14. 开机启动 启动时加上 --restart=always
如果已经启动的项目，则使用update更新：
docker update --restart=always isaler_v0.0.11
```



### 1、新建并启动容器

1. docker run [OPTIONS] IMAGE [COMMAND] [ARG…]

   当利用 `docker run` 来创建容器时，Docker 在后台运行的标准操作包括：

   - 检查本地是否存在指定的镜像，不存在就从 [registry](https://vuepress.mirror.docker-practice.com/repository/) 下载
   - 利用镜像创建并启动一个容器
   - 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
   - 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
   - 从地址池配置一个 ip 地址给容器
   - 执行用户指定的应用程序
   - 执行完毕后容器被终止；

2. OPTIONS说明（常用）：
   3. --name=”容器新名字”: 为容器指定一个名称；
   2. -d: 后台运行容器，并返回容器ID，也即启动守护式容器；
   3. -i：以交互模式运行容器，通常与 -t 同时使用；
   4. -t：为容器重新分配一个伪输入终端，通常与 -i 同时使用；
   5. -P: 随机端口映射；
   6. -p: 指定端口映射，有以下四种格式
      - ip![:hostPort:]
      - ip::containerPort
      - hostPort:containerPort
      - containerPort

**如：**docker run -it -v **宿主机目录:docker容器内目录** centos /bin/bash

-v：表示启动容器时挂载宿主机内的目录

### 2、列出当前所有正在运行的容器

- docker ps ：查看正在运行的容器
- docker ps -a ：查看正在运行和已经停止的容器

### 3、退出容器

- exit：停止容器并且退出
- ctrl+P+Q：退出容器单不停止容器  ctrl+P+Q , 然后再来一次 ctrl+Q

### 4、启动已经停止的容器

docker start 容器ID或者容器名

### 5、重启容器

docker restart 容器ID或者容器名

### 6、停止容器

- docker stop 容器ID或者容器名：正常停止指定容器
- docker kill 容器ID或者容器名：强制停止容器
- sudo docker stop $(sudo docker ps -aq)  停止全部容器

### 7、删除容器

- docker rm 容器ID：删除一个
- docker rm -f $(docker ps -a -q)：删除多个
- **docker ps -a -q | xargs docker rm：删除多个容器（有些时候上面命令删除不掉，可以用这个，具体原理待研究）**

### 8、启动守护式容器

（1）docker run -d 容器名

（2）使用镜像 centos:latest 以后台模式启动一个容器：docker run -d centos

（3）问题：然后docker ps -a 进行查看, 会发现容器已经退出

（4）很重要的要说明的一点: ***Docker容器后台运行,就必须有一个前台进程。\***容器运行的命令如果不是那些一直挂起的命令（比如运行 top，tail），就是会自动退出的。这个是docker的机制问题,比如你的 web 容器,我们以 nginx 为例，正常情况下,我们配置启动服务只需要启动响应的 service 即可。

（5）例如 service nginx start

但是,这样做,nginx为后台进程模式运行,就导致docker前台没有运行的应用,这样的容器后台启动后,会立即自杀因为他觉得他没事可做了.***所以，最佳的解决方案是,将你要运行的程序以前台进程的形式运行\***

### 9、查看容器日志

- docker logs -f -t —tail 容器ID
- \* -t 是加入时间戳
- \* -f 跟随最新的日志打印
- \* —tail 数字 显示最后多少条

### 10、查看容器内运行的进程

docker top 容器ID

### 11、查看容器内部细节

docker inspect 容器ID

### 12、进入正在运行的容器并以命令行交互

> 然后就可以运行 linux 命令在 容器中操作，一般最好是在容器卷中操作

```sh
docker exec -it 容器ID/容器名 bash
docker diff webserver # 修改了容器内部以后，可以查看具体的改动点
```

exec 是在容器中打开新的终端，并且可以启动新的进程

- docker attach 容器ID  也可以进入容器，但是 exit 退出时会停止容器；

直接进入容器启动命令的终端，不会启动新的进程

### 13、从容器内拷贝文件到主机上

docker cp 容器ID:容器内路径 目的主机路径

### 14、清理所有处于终止状态的容器

```sh
docker container prune
```

### 15、docker系统修剪

```sh
docker system prune
```

这个`docker system prune`清除了以下内容：

- 所有停止的容器
- 没有被任何容器使用的网络，可以 docker network ls 查看
- 所有悬空的图像
- 所有悬空的构建缓存

此清除命令将节省大量硬盘空间。

Terminal

```bash
$ sudo docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache
```



# 六、镜像与容器之间的关联关系

1. 用 docker run 将一个镜像运行起来就会生成一个容器服务

   ```sh
   docker run --name webserver -d -p 80:80 nginx
   ```

2. 将容器保存为镜像，然后可以运行镜像，**此命令慎用**

   ```sh
   # 将 webserver 容器制作为镜像，镜像名为 nginx:v2
   docker commit \
       --author "zhangsan <zhsan2218@gmail.com>" \
       --message "修改了默认网页" \
       webserver \
       nginx:v2
       
   docker run --name web2 -d -p 81:80 nginx:v2 # 将上面制成的镜像运行
   ```

   

# 七、DockerFile

1. docker build 命令

   使用 docker build 命令和 dockerFile 文件可以构建生成镜像，当使用`Dockerfile`构建镜像时，所在的目录一定要使用一个干净的目录（最好新建一个），以免目录下有其他文件（构建会加载当前目录下所有文件，导致磁盘爆满）

   `docker build` 命令构建镜像，其实并非在本地构建，而是在服务端，也就是 Docker 引擎中构建的。当构建的时候，用户会指定构建镜像上下文的路径，`docker build` 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎。这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件。

   `COPY` 这类指令中的源文件的路径都是*相对路径*，一般来说，应该会将 `Dockerfile` 置于一个空目录下，或者项目根目录下。如果该目录下没有所需文件，那么应该把所需文件复制一份过来。如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 `.gitignore` 一样的语法写一个 `.dockerignore`，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。观察 `docker build` 输出，可以看到了发送上下文的过程：

   ```sh
   $ docker build -t nginx:v3 .
   Sending build context to Docker daemon 2.048 kB # 发送上下文的过程
   ```

   

   ```sh
   docker build -t xxx:v1.1 dir -f yyy.Dockerfile
   ```

   - -t 为构建的镜像打上 tag，可以在一次构建中为一个镜像设置多个tag
   - xxx 是给构建的镜像起个名字叫 xxx
   - v1.1 是给镜像的 tag名
   - dir 是 dockerfile 文件所在目录，默认会找 Dockerfile文件。

   - -c：控制 CPU 使用
   - -f：指定构建文件
   - -m：设置构建内存上限
   - -q：不显示构建过程的信息，默认显示。–quiet 的简写
   - –build-arg，设置构建时的环境变量
   - –no-cache，默认false。设置该选项，将不使用Build Cache构建镜像
   - –pull，默认false。设置该选项，总是尝试pull镜像的最新版本
   - –compress，默认false。设置该选项，将使用gzip压缩构建的上下文
   - –disable-content-trust，默认true。设置该选项，将对镜像进行验证
   - –isolation，默认–isolation=“default”，即Linux命名空间；其他还有process或hyperv
   - –label，为生成的镜像设置metadata
   - –squash，默认false。设置该选项，将新构建出的多个层压缩为一个新层，但是将无法在多个镜像之间共享新层；设置该选项，实际上是创建了新image，同时保留原有image。
   - –network，默认default。设置网络模式，四种。

   

2. Dockerfile 每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

3. Dockerfile 支持 Shell 类的行尾添加 `\` 的命令换行方式，以及行首 `#` 进行注释的格式。

4. 指令

   - FROM 指定基础镜像，`Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令。

     > Docker 还存在一个特殊的镜像，名为 `scratch`。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。以 `scratch` 为基础镜像的话，意味着不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在。对于 Linux 下静态编译的程序来说，并不需要有操作系统提供运行时支持，所需的一切库都已经在可执行文件里了，因此直接 `FROM scratch` 会让镜像体积更加小巧。

   - RUN  执行命令行命令，`RUN` 指令在定制镜像时是最常用的指令之一。其格式有两种：

     - *shell* 格式

       ```sh
       RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
       ```

     - *exec* 格式，RUN ["可执行文件", "参数1", "参数2"]

       1. 每一个 `RUN` 的行为，就会新建立一层，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。因此要尽量减少 RUN 的次数，以减少镜像的大小，

       2. 镜像是多层存储，每一层的东西并不会在下一层被删除，会一直跟随着镜像。因此镜像构建时，一定要确保每一层只添加真正需要添加的东西，任何无关的东西都应该清理掉。

       ```sh
       RUN mkdir -p /usr/src/redis
       RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
       ```

5. 多阶段构建

   一个 dockerfile 中有多个 FROM 指令时，就是多阶段构建；可以使用 as 给阶段命名，然后在其他阶段中使用；

   可以只构建其中的一个阶段镜像；

   ```sh
   FROM golang:alpine as builder
   ```

   ```sh
   docker build --target builder -t username/imagename:tag .
   ```

   构建时从其他镜像复制文件

   ```sh
   # 从上一阶段镜像中复制
   COPY --from=0 /go/src/github.com/go/helloworld/app .
   # 从任意指定的镜像中复制
   COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
   ```

   



# 八、docker-compose

完整配置解释见 [完整配置](https://deepzz.com/post/docker-compose-file.html#toc_31)

# 九、docker network

详见 [简书](https://www.jianshu.com/p/3004fbce4d37?u_atoken=7e5eba42-1461-4424-b80d-0b3afc9110f7&u_asession=01VvzYaV_gHsrNjhLE1Su1GAfzk6LJv2mhgtQApNYZIFxL14G2rBZrQE7vxx7NDh_dX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K8nD5cfoNoTK_6GA3wyon3mCvvWHyhA8I9G3hxoTho1LGBkFo3NEHBv0PZUm6pbxQU&u_asig=05qqfmDpV5jnzQ3zaOR-kKvo9GIyPSEU9bw8mlVlMVGppZ9pJxMONfYVqMxov9SKyxJiyccUUyR3518TpSIGyIwgwM6toykM2wPEZonwQg5YNHdY_SbRZxvoGKF3gNR6FYRi54SlC2WoHrOabV4aW_IeoqMN8dtl6KGO3T8OB_mdz9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzUrY0QhB-Ma-EqxeO6vNS5HipymZkD-PpMAPXZfii-1IChTz2MQxpCmDDGYlh3aZze3h9VXwMyh6PgyDIVSG1W9HRCuSkoPezGK-B_JV3Q83S0gA-YCVD9qXtlq4leRItDdgzKzNqrrWi9_-2TUYxFyUe5pNRJDtrRTZ4ViTRkgFmWspDxyAEEo4kbsryBKb9Q&u_aref=QNV%2BNasOaPsJ%2ByEz0C1U11jPt0o%3D)

详见 [博客](http://www.zzvips.com/article/145198.html)

> 在 docker-compose 配置中使用同一个网络的容器服务可以互相访问，类似于这些服务在一个小的局域网中，可以使用 127.0.0.1 访问；不同名的网络服务不能互相访问；

- **1. 未显式声明网络环境的docker-compose.yml**

  - 例如在目录`app`下创建docker-compose.yml，使用`docker-compose up`启动容器后，这些容器都会被加入`app_default`网络中。使用`docker network ls`可以查看网络列表，`docker network inspect <container id>`可以查看对应网络的配置，默认网络名为  "目录名_default"；

- **2. networks关键字指定自定义网络**

  例如下面的docker-compose.yml文件，定义了front和back网络，实现了网络隔离。其中proxy和db之间只能通过app来实现通信。其中，`custom-driver-1`并不能直接使用，你应该替换为`host, bridge, overlay`等选项中的一种。

  这里定义了back和front两个网络，似乎它们的名字就定义成了back和font，但是你使用`docker network ls`命令并不能找到它们。假如你是在`myApp`目录下运行的`docker-compose up`命令，那么这两个网络应该分别对应`myApp_back`和`myApp_front`

  ```sh
  version: '3'
   
  services:
   proxy:
    build: ./proxy
    networks:
     - front
   app:
    build: ./app
    networks:
     - front
     - back
   db:
    image: postgres
    networks:
     - back
   
  networks:
   front:
    # Use a custom driver
    driver: custom-driver-1
   back:
    # Use a custom driver which takes special options
    driver: custom-driver-2
    driver_opts:
     foo: "1"
     bar: "2"123456789101112131415161718192021222324252627
  ```

- ##### 3.配置默认网络

  不指定网络时，默认的网络也是可以配置的。不配置的话，默认是使用：`brige`，也可以修改为其他的；

  ```sh
  version: "3"
  services:
  
    web:
      build: .
      ports:
        - "8000:8000"
    db:
      image: postgres
  
  networks:
    default:
      # Use a custom driver
      driver: custom-driver-1
  ```

  

- ##### 4. 使用已经存在的网络

  多个容器，不在相同的配置中，也会有网络通讯的需求 。那么就可以使用公共的网络配置。容器可以加入到已经存在的网络。

  ```sh
  networks:
    default:
      external:
        name: my-pre-existing-network
  ```

  

# 十、traefik

Traefik 是一个云原生的新型的 HTTP 反向代理、负载均衡软件。

[traefik中文手册](https://www.mianshigee.com/tutorial/traefik/1.md)

手册新手入门中有一处错误 ，如下：

``` 
docker-compose scale whoami=2  
要改为 
docker-compose up --scale whoami=2
```

#### Traefix可以做什么

- 网关/代理请求：拦截并路由每个传入的请求，根据路由规则，作为外部请求与服务的中间代理
- 服务发现：无需重启，自动检测服务，自动更新路由规则
- 云原生：即专门为微服务等云端技术设计，兼容许多种集群技术
- 负载均衡：自动负载均衡
- 证书：支持自动配置HTTPS证书
- 服务监控管理：Web UI查看和管理各容器的运行

**服务发现：** 经[demo](https://github.com/wind8866/example/blob/main/traefik/README.md#使用方法)测试，先启动traefik服务，再启动其他服务，traefik会自动发现并代理服务。

**自动负载均衡例子：** 只需将docker服务的实例增加至大于一个，docker将会自动发现服务并进行负载均衡。

完整 docker-compose 配置如下

```sh

```









看片狂邮箱

[loma2gm@gmail.com](mailto:loma2gm@gmail.com)







































