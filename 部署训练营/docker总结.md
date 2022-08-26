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

> https://deepzz.com/post/docker-compose-file.html#toc_31

# 八、docker network

详见 [简书](https://www.jianshu.com/p/3004fbce4d37?u_atoken=7e5eba42-1461-4424-b80d-0b3afc9110f7&u_asession=01VvzYaV_gHsrNjhLE1Su1GAfzk6LJv2mhgtQApNYZIFxL14G2rBZrQE7vxx7NDh_dX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K8nD5cfoNoTK_6GA3wyon3mCvvWHyhA8I9G3hxoTho1LGBkFo3NEHBv0PZUm6pbxQU&u_asig=05qqfmDpV5jnzQ3zaOR-kKvo9GIyPSEU9bw8mlVlMVGppZ9pJxMONfYVqMxov9SKyxJiyccUUyR3518TpSIGyIwgwM6toykM2wPEZonwQg5YNHdY_SbRZxvoGKF3gNR6FYRi54SlC2WoHrOabV4aW_IeoqMN8dtl6KGO3T8OB_mdz9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzUrY0QhB-Ma-EqxeO6vNS5HipymZkD-PpMAPXZfii-1IChTz2MQxpCmDDGYlh3aZze3h9VXwMyh6PgyDIVSG1W9HRCuSkoPezGK-B_JV3Q83S0gA-YCVD9qXtlq4leRItDdgzKzNqrrWi9_-2TUYxFyUe5pNRJDtrRTZ4ViTRkgFmWspDxyAEEo4kbsryBKb9Q&u_aref=QNV%2BNasOaPsJ%2ByEz0C1U11jPt0o%3D)

详见 [博客](http://www.zzvips.com/article/145198.html)

> 在 docker-compose 配置中使用同一个网络的容器服务可以互相访问，类似于这些服务在一个小的局域网中，可以使用 127.0.0.1 访问；不同名的网络服务不能互相访问；

- **1. 未显式声明网络环境的docker-compose.yml**
  - 例如在目录`app`下创建docker-compose.yml，使用`docker-compose up`启动容器后，这些容器都会被加入`app_default`网络中。使用`docker network ls`可以查看网络列表，`docker network inspect <container id>`可以查看对应网络的配置，默认网络名为  "目录名_default"

# 九、traefik

Traefik 是一个云原生的新型的 HTTP 反向代理、负载均衡软件。

#### Traefix可以做什么

- 网关/代理请求：拦截并路由每个传入的请求，根据路由规则，作为外部请求与服务的中间代理
- 服务发现：无需重启，自动检测服务，自动更新路由规则
- 云原生：即专门为微服务等云端技术设计，兼容许多种集群技术
- 负载均衡：自动负载均衡
- 证书：支持自动配置HTTPS证书
- 服务监控管理：Web UI查看和管理各容器的运行

**服务发现：** 经[demo](https://github.com/wind8866/example/blob/main/traefik/README.md#使用方法)测试，先启动traefik服务，再启动其他服务，traefik会自动发现并代理服务。

**自动负载均衡例子：** 只需将docker服务的实例增加至大于一个，docker将会自动发现服务并进行负载均衡。



















































