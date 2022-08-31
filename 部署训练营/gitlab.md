docker 中直接安装运行

1、安装

> 包比较大，镜像有 2.64G

```sh
# 不加 tag 则默认为最新版本 latest (一般使用这种)
sudo docker pull gitlab/gitlab-ce
# 如果需要下载其他版本，加上对应的 tag 即可，如：
sudo docker pull gitlab/gitlab-ce:rc
# 从Docker Hub查找镜像
$ docker search gitlab
```

2、启动运行

```sh
sudo docker run --detach \
  --hostname gitlab.example.com \
  --publish 443:443 --publish 80:80 --publish 22:22 \
  --name gitlab \
  --restart always \
  --volume /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

运行成功后会出现一行很长的字符串，查看 docker ps -a , 如果 gitlab 的容器状态为 up 说明在运行中了`STATUS` 为 `health: starting`，说明 gitlab 的服务正在启动中，还没有启动完毕。等这个状态变成 `healthy` 时则说明已经部署完成，可以访问了。

注释：

```sh
sudo docker run --detach \  # 后台运行
  --hostname gitlab.example.com \   # 设置主机名或域名
  --publish 443:443 --publish 80:80 --publish 22:22 \ # 本地端口的映射
  --name gitlab \     # gitlab-ce 的镜像运行成为一个容器，这里是对容器的命名
  --restart always \  # 设置重启方式，always 代表一直开启，服务器开机后也会自动开启的
  --volume /srv/gitlab/config:/etc/gitlab \   # 将 gitlab 的配置文件目录映射到 /srv/gitlab/config 目录中
  --volume /srv/gitlab/logs:/var/log/gitlab \ # 将 gitlab 的log文件目录映射到 /srv/gitlab/logs 目录中
  --volume /srv/gitlab/data:/var/opt/gitlab \ # 将 gitlab 的数据文件目录映射到 /srv/gitlab/data 目录中
  gitlab/gitlab-ce:latest  # 需要运行的镜像
```

报错解决：

如果启动时报错， 22端口被占用，就是 被 ssh 连接占用了；gitlab容器需要用到22端口，不能与宿主机冲突，这里需要修改宿主机的sshd服务的监听端口

```sh
netstat -tunlp|grep 22
```

在 /etc/[ssh](https://so.csdn.net/so/search?q=ssh&spm=1001.2101.3001.7020)/中的 sshd_config文件夹中修改，然后重启 ssh

```sh
port: 2222 # 原本为22

sudo service sshd restart
```

docker-compose 中运行



https://zhuanlan.zhihu.com/p/63786567



https://blog.csdn.net/BThinker/article/details/124097795



https://www.jb51.net/article/152570.htm

https://zhuanlan.zhihu.com/p/328795102

https://blog.csdn.net/u012922706/article/details/80252700





















































