# 一、概念

## 1、三大概念

### 1.1 镜像

### 1.2 容器

### 1.3 仓库

# 二、镜像仓库的使用

# 三、镜像的使用

3.1 镜像相关的命令

# 四、容器的使用

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
```



### 1、新建并启动容器

1. docker run [OPTIONS] IMAGE [COMMAND] [ARG…]
2. OPTIONS说明（常用）：
3. --name=”容器新名字”: 为容器指定一个名称；
4. -d: 后台运行容器，并返回容器ID，也即启动守护式容器；
5. -i：以交互模式运行容器，通常与 -t 同时使用；
6. -t：为容器重新分配一个伪输入终端，通常与 -i 同时使用；
7. -P: 随机端口映射；
8. -p: 指定端口映射，有以下四种格式
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

- docker stop 容器ID或者容器名：正常停止容器
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

- docker exec -it 容器ID bashShell

exec 是在容器中打开新的终端，并且可以启动新的进程

- docker attach 容器ID

直接进入容器启动命令的终端，不会启动新的进程

### 13、从容器内拷贝文件到主机上

docker cp 容器ID:容器内路径 目的主机路径

### 14、docker系统修剪

```sh
docker system prune
```

这个`docker system prune`了以下内容：

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

# 五、镜像与容器之间的关联关系

# 六、DockerFile

6.1 将脚本翻译为 dockerfile 文件

# 七、docker-compose

# 八、docker 网络