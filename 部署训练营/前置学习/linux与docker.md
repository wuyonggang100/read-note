## docker 

**Docker** 使用 `Google` 公司推出的 [Go 语言](https://golang.google.cn/) 进行开发实现，基于 `Linux` 内核的 [cgroup](https://zh.wikipedia.org/wiki/Cgroups)，[namespace](https://en.wikipedia.org/wiki/Linux_namespaces)，以及 [OverlayFS](https://docs.docker.com/storage/storagedriver/overlayfs-driver/) 类的 [Union FS](https://en.wikipedia.org/wiki/Union_mount) 等技术，对进程进行封装隔离，属于 [操作系统层面的虚拟化技术](https://en.wikipedia.org/wiki/Operating-system-level_virtualization)。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。最初实现是基于 [LXC](https://linuxcontainers.org/lxc/introduction/)，从 `0.7` 版本以后开始去除 `LXC`，转而使用自行开发的 [libcontainer](https://github.com/docker/libcontainer)，从 `1.11` 版本开始，则进一步演进为使用 [runC](https://github.com/opencontainers/runc) 和 [containerd](https://github.com/containerd/containerd)

> `runc` 是一个 Linux 命令行工具，用于根据 [OCI容器运行时规范](https://github.com/opencontainers/runtime-spec) 创建和运行容器。

> `containerd` 是一个守护程序，它管理容器生命周期，提供了在一个节点上执行容器和管理镜像的最小功能集。

**Docker** 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，极大的简化了容器的创建和维护。使得 `Docker` 技术比虚拟机技术更为轻便、快捷。

**Docker** 和传统虚拟化方式的不同之处。传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。







# Linux云服务器安装宝塔面板

1. 虚拟机内 centos7 下载地址： 

   http://mirrors.cn99.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso

2. ssh 登录 linux ；

   > 在`` C:\Users\xxx`` 目录下有个 目录  .ssh , 里面存放了 公钥 id_rsa.pub 文件 和私钥 id_rsa 文件。

   使用 ssh config 方式免密登录

   - 使用 git 等命令行工具在 .ssh 目录下创建 config 文件，

     ```sh
     touch ~/.ssh/config && chmod 700 ~/.ssh/config
     ```

   - 写入配置

     ```sh
     Host gang
         HostName 192.168.201.129
         User root
     ```

   - 在上述命令行工具内，输入以下命令，然后  yes , 再输入密码，就登录到 linux 了；

     ```sh
     ssh gang
     ```

     

3. 执行 宝塔 linux 面板安装命令:

   ```sh
   curl -sSO http://download.bt.cn/install/install_panel.sh && bash install_panel.sh
   ```

4. 没有用 root 账号登录，使用 xxx 账号登录，安装时提示 **请使用root权限执行命令**；

   > 提示 xxx 不在 sudoers 文件中。此事将被报告。
   >
   > 说明sudoers文件放在etc目录下

   解决方法，执行如下命令切换到 root 账号，然后再执行安装命令就可以了

   ```sh
   su root  # 后需要输入 root 账号密码
   ```

   外网面板地址: http://183.62.140.226:8888/869907c0
   内网面板地址: http://192.168.201.129:8888/869907c0

   username: aqa7a7gt
   password: 76e35b4c

### 安装 docker

安装依赖

```bash
$ yum install -y yum-utils device-mapper-persistent-data lvm2
```

添加 `docker` 的yum镜像源，如果在国内，添加阿里云的镜像源

```bash
# 安装 docker 官方的镜像源
$ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 如果在国内，安装阿里云的镜像
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

安装指定版本的 `docker` 并且启动服务

```bash
# 安装 docker
$ yum install -y docker-ce

# 安装指定版本号的 docker，以下是 k8s 官方推荐的 docker 版本号 (此时，k8s 的版本号在 v1.16)
$ yum install -y docker-ce-18.06.2.ce

$ systemctl enable docker # 配置开机启动
Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.

$ systemctl start docker
```

当 `docker` 安装成功后，可以使用以下命令查看版本号

```shell
$ docker --version
Docker version 18.06.2-ce, build 6d37f41

# 查看更详细的版本号信息
$ docker version

# 查看docker的详细配置信息
$ docker info
```

### 卸载 docker

1、查询本机 docker 已经安装的安装包

```sh
yum list installed | grep docker
```

2、删除安装包

```sh
yum remove docker*
```

3、再查询本地 docker 安装，查不到说明卸载成功，如果还有，就分别删除；

```sh
docker --version
# bash: docker: command not found...

yum list installed | grep docker
# 什么都没有说明删除干净
# 若有就分别删除，如: docker remove containerd.io.x86_64
```

4、如果有镜像或容器，需要删除

```sh
rm -rf /var/lib/docke # 删除镜像
docker kill $(docker ps -a -q) # 杀死所有容器
docker rm $(docker ps -a -q) #删除所有容器
docker rmi $(docker images -q) #删除所有镜像
systemctl stop docker # 停止 docker 服务

# 删除所有目录
rm -rf /etc/docker
rm -rf /run/docker
rm -rf /var/lib/dockershim
rm -rf /var/lib/docker

# 如果删不掉，需要执行以下命令
umount /var/lib/docker/devicemapper
```



## docker 守护进程  dockerd

> dockerd: 用于管理容器的守护进程，叫dockerd，docker是可以分为服务端和客户端的。即有host和client，dockerd可以理解为docker的引擎，来直接控制docker 的daemon的行为的。

1. dockerd是docker后台的真正的进程。docker只是命令行工具。

2. 当dockerd未启动时，docker是可以使用，但是执行build等一些命令时就会发现找不到daemon。此时用dockerd执行一下就可以。

3. docker的后台的所有行为，都是dockerd来实现的。而docker命令，仅仅是交互工具，只是一个客户端
4. dockerd 是docker daemon，类似server，docker client是一个客户端命令行，类似aws的客户端工具一样。client可以连接远程的docker daemon进行操作。
5. 也就是说，安装docker有两种，一种是安装docker daemon，即叫docker，里面涵盖了docker client。而安装的docker client只能访问别的机器上的docker（docker daemon）。
   

### docker 容器与镜像命令

> 一个容器只能基于一个镜像创建，比如需要启个 node 服务，就要开一个容器，再启一个 nginx 服务，又要开一个容器；同一个镜像可以用来创建多次容器；

1、镜像命令

```sh
# 列出本地主机上所有的镜像的几种方式
docker images -a #列出本地所有的镜像（含中间映像层）
docker images -q #只显示镜像ID
docker image inspect node:14.1.1 # 完美展示了镜像的细节，包括镜像层数据和元数据
docker images --digests #显示镜像的摘要信息
docker images --no-trunc #显示完整的镜像信息

# 在docker官网上http://hub.docker.com搜索镜像名称，查看版本结果
docker search XXX(镜像名字)
docker search xxx --no-trunc 显示完整信息
docker search -s XXX列出收藏数不小于指定值的镜像
比如：docker search -s 30 XXX
docker search --antomated XXX 只列出antomated build 类型的镜像
比如：docker search -s 30 --antomated XXX


docker pull XXX：TAG  # 下载某个镜像，若无：TAG,则默认最新版本
docker pull nginx:1.16.1  # 下载 nginx 1.16.1 版本
docker pull XXX # 下载某个镜像最新版本

删除某个镜像：
docker rmi XXX #（镜像名字或者唯一镜像ID或镜像 tag)
docker rmi -f XXX # 强制删除（如果镜像正在运行）
docker rmi -f XXX:TAG XXX:TAG #（删除多个）
docker rmi -f $(docker images -qa) # 删除全部镜像

# 将修改后的容器打包成镜像
docker commit parameter [containerID] [ImageName]:[Version]
参数说明
-a :提交的镜像作者；
-c :使用Dockerfile指令来创建镜像；
-m :提交时的说明文字；
-p :在commit时，将容器暂停 

# 导出镜像保存到本地，后期可以放到别的机器上部署
docker save -o /home/chw/tcnstream_ubuntu_aarch64.tar tcnstream_ubuntu_aarch64
# 加载本地保存的镜像，然后docker images就可以看到镜像
docker load  --input tcnstream_ubuntu_aarch64.tar

```

获取 xxx 的全部镜像  tag 列表

> 以 node 为例

```sh
wget -q https://registry.hub.docker.com/v1/repositories/node/tags -O -  | sed -e 's/[][]//g' -e 's/"//g' -e 's/ //g' | tr '}' '\n' | awk -F: '{print $3}'
```

#### 构建自定义镜像

在 Dockerfile 目录下执行以上命令即可构建镜像。`-t` 参数指定了镜像名称为 `nginx-alpine`，最后的 `.` 表示构建上下文（`.` 表示当前目录）.

**在使用 `COPY` 指令复制文件时，指令中的源路径是相对于构建上下文的**（如果指定上下文为 `/home`，那么相当于所有的源路径前面都加上了 `/home/`）。

如果你的 Dockerfile 文件名不是 “Dockerfile”，可以使用 `-f` 参数指定。

> **千万不要将 Dockerfile 放在根目录下构建，假如你将 Dockerfile 放在一个存放大量视频目录下，并且构建上下文为当前目录，那么镜像将会非常大（视频都被打包进去了）**。最佳做法是将 Dockerfile 和需要用到的文件放在一个单独的目录下

```sh
docker build -t nginx-alpine . --file #如果 Dockerfile文件有多个，就需要指定,简写 -f
```



### 2、容器命令 

> 容器ID=id name=容器名字 name:tag=容器:版本号

```sh
# 创建容器
docker create -it centos:latest 
docker create -it --name tomcat01 centos:latest

# docker run：创建一个新的容器并运行一个命令
docker run --name ppocr --privileged  -p  2022:22 -v $PWD:/paddle --shm-size=256G  --network=host -itd paddlepaddle/paddle:2.0.1-gpu-cuda11.0-cudnn8 /bin/bash
--name：指定容器的名字。

-v：v是指volume,这里的意思是把当前目录映射到容器中的/paddle路径，
-d: 启动一个 daemon 进程，后台运行容器，并返回容器ID；
-i: 以交互模式运行容器，通常与 -t 同时使用；
-t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
-p: 表示端口映射，其中2022为主机端口，22为docker端口。后面可以远程连接： ssh root@172.31.8.207:2022 ---- 2022为 -p 的主机端口。
--privileged: 表示container内的root拥有真正的root权限。否则，container内的root只是外部的一个普通用户权限。privileged启动的容器，可以看到很多host上的设备，并且可以执行mount。甚至允许你在docker容器中启动docker容器。如果不使用此参数，docker中可能无法看到一些设备，如mlu，就无法使用。
--shm-size=256G：这里是设置docker环境中的共享内存大小，默认是64m，太小了，后面运行程序会报错，因此在创建容器之前先在电脑上用df-h命令看一下电脑的虚拟内存大小，然后创建docker容器时设置成一样的。下面的/dev/shm就是共享内存大小。

# nginx:1.16.1 为镜像名，用 nginx:1.16.1 镜像创建一个容器，然后浏览器输入http://192.168.201.129:8888/ 就能看到 nginx 启动了，或者在宿主机输入 curl localhost:8889
docker run -d --name nginx -p 8888:80 nginx:1.16.1

# 进入容器目录
docker exec -it 容器ID/容器NAME /bin/bash
# 退出已经进入的容器
直接ctrl+D或者输入exit

## 简写
docker exec -it 容器ID/容器NAME bash
# 创建\启动\进入容器
docker run -it centos:latest /bin/bash
docker run -it -p 7001:8001 centos:latest /bin/bash #指定端口号

# 使用 -P 标记时，Docker 会随机映射一个 49000~49900 的端口
#开启端口号 firewall-cmd --zone=public --add-port=5671/tcp --permanent
docker run -it -P --name tomcat03 centos:latest /bin/bash
#重启防火墙(不重启以上的设置是不会生效的)： firewall-cmd --reload
firewall-cmd --zone=public --add-port=15671/tcp --permanent

docker start 容器ID|name|name:tag # 启动容器
docker stop 容器ID|name|name:tag # 停止容器
docker restart 容器ID|name|name:tag # 重启容器

#停止所有运行容器
docker stop $(docker ps -aq) 

#删除所有的容器，需要先停止
docker rm $(docker ps -aq) 
docker rm $(docker stop $(docker ps -q))
删除所有的镜像
docker rmi $(docker images -q)

docker ps # 查看当前运行的容器
docker ps -a # 查看所有容器，包括运行和不运行的
docker rm 容器ID # 删除容器
docker port nginx # 查看 nginx 容器端口映射 80/tcp -> 0.0.0.0:8888
docker stats # 查看容器资源占用

docker rename 旧名 新名 # 给容器重命名
docker rename nginx:1.16.1 nginx # 先给 name 为nginx:1.16.1容器改名为 nginx，再将id 为nginx:1.16.1 的容器改名为 nginx;
```



# Dockerfle 

> 在使用 `docker` 部署自己应用时，往往需要自己构建镜像。`docker` 使用 `Dockerfile` 作为配置文件构建镜像，简单看一个 `node` 应用构建的 `dockerfile`

```sh
FROM node:alpine

ADD package.json package-lock.json /code/
WORKDIR /code

RUN npm install --production

ADD . /code

CMD npm start
```

### FROM

基于一个旧有的镜像，格式如下

```dockerfile
FROM <image> [AS <name>]

# 在多阶段构建时会用到
FROM <image>[:<tag>] [AS <name>]
```

### ADD

把目录，或者 url 地址文件加入到镜像的文件系统中

```dockerfile
ADD [--chown=<user>:<group>] <src>... <dest>
```

### RUN

执行命令，由于 `ufs` 的文件系统，它会在当前镜像的顶层新增一层

```dockerfile
RUN <command>
```

### CMD

指定容器如何启动

**一个 `Dockerfile` 中只允许有一个 CMD**

```dockerfile
# exec form, this is the preferred form
CMD ["executable","param1","param2"] 

# as default parameters to ENTRYPOINT
CMD ["param1","param2"]

# shell form
CMD command param1 param2
```

问题：Dockerfile 中 CMD 与 RUN 有什么区别？

- RUN 在构建阶段执行，每执行一次会为镜像添加一个层，而 CMD 只在容器启动时执行(而且还不一定执行，它只是容器启动时默认的执行命令)

- RUN命令是构建镜像的步骤，会在当前图像顶部的新层中执行，并提交结果，所得的图像将用于Dockerfile的下一步，一个Dockerrfile中可以有许多个RUN命令 CMD命令是当Docker镜像启动后，Docker容器将会默认执行的命令，一个Dockerfile中只能有一个CMD命令。通过执行docker run $image $other_command启动镜像可以重载CMD命令。



# docker compose

[Docker](https://so.csdn.net/so/search?q=Docker&spm=1001.2101.3001.7020) Compose是一个用来定义和运行复杂应用的Docker工具。一个使用Docker容器的应用，通常由多个容器组成。使用Docker Compose不再需要使用shell脚本来启动容器。

Compose 通过一个配置文件来管理多个Docker容器，在配置文件中，所有的容器通过services来定义，然后使用docker-compose脚本来启动，停止和重启应用，和应用中的服务以及所有依赖服务的容器，非常适合组合使用多个容器进行开发的场景。

Docker从1.13.x版本开始，版本分为企业版EE和社区版CE，版本号也改为按照时间线来发布，比如17.03就是2017年3月。

Docker的社区版（Docker Community Edition）叫做docker-ce。老版本的Docker包叫做docker或者docker-engine，如果安装了老版本的docker得先卸载然后再安装新版本的docker。docker的发展非常迅速，apt源的更新往往比较滞后。所以docker官网推荐的安装方式都是下载docker安装脚本安装。 

























