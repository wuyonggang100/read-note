# docker 中直接安装运行gitlab

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
  --publish 443:443 --publish 80:80 --publish 222:22 \
  --name gitlab \
  --restart always \
  --volume /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

运行成功后会出现一行很长的字符串是容器 id，查看 docker ps -a , 如果 gitlab 的容器状态为 up 说明在运行中了`STATUS` 为 `health: starting`，说明 gitlab 的服务正在启动中，还没有启动完毕。等这个状态变成 `healthy` 时则说明已经部署完成，可以访问了。

注释：

```sh
sudo docker run --detach \  # 后台运行
  --hostname gitlab.example.com \   # 设置主机名或域名
  --publish 443:443 --publish 80:80 --publish 222:22 \ # 本地端口的映射
  --name gitlab \     # gitlab-ce 的镜像运行成为一个容器，这里是对容器的命名
  --restart always \  # 设置重启方式，always 代表一直开启，服务器开机后也会自动开启的
  --volume /srv/gitlab/config:/etc/gitlab \   # 将 gitlab 的配置文件目录映射到 /srv/gitlab/config 目录中
  --volume /srv/gitlab/logs:/var/log/gitlab \ # 将 gitlab 的log文件目录映射到 /srv/gitlab/logs 目录中
  --volume /srv/gitlab/data:/var/opt/gitlab \ # 将 gitlab 的数据文件目录映射到 /srv/gitlab/data 目录中
  gitlab/gitlab-ce:latest  # 需要运行的镜像
```

注意： **宿主机的22 端口尽量只给 ssh 连接使用，gitlab 可以使用其他端口，如 222**

报错解决：

如果启动时报错， 22端口被占用，就是 被 ssh 连接占用了；gitlab容器需要用到22端口，不能与宿主机冲突，这里需要修改宿主机的sshd服务的监听端口

```sh
netstat -tunlp|grep 22 # 查看端口号数字包含了22 的端口占用情况,如 122,322,2222等
lsof -i:8000 # 查看指定端口占用情况
kill -9 pid # 杀死进程 pid
```

在 /etc/[ssh](https://so.csdn.net/so/search?q=ssh&spm=1001.2101.3001.7020)/中的 sshd_config文件夹中修改，然后重启 ssh

```sh
port: 2222 # 原本为22
sudo service sshd restart
```

监看日志

```sh
docker logs -f gitlab # 跟踪监看指定容器的实时日志  follow
```



# docker-compose 方式运行gitlab

创建 docker-compose.yaml 文件如下

```yaml
version: "3"
services:
  gitlab:
    # 使用的镜像
    image: gitlab/gitlab-ce:latest
    # 宕机或断电服务中断后自动重启
    restart: always 
    # 自定义启动后的容器名
    container_name: gitlab 
    # 映射的端口
    ports:
      - 443:443
      - 80:80
      - 222:22
    # 容器卷
    volumes:
      - /srv/gitlab/config:/etc/gitlab
      - /srv/gitlab/data:/var/opt/gitlab
      - /srv/gitlab/logs:/var/log/gitlab
```

运行 

```sh
docker-compose up -d --build gitlab
```

运行需要稍等几分钟，如果出现 502 说明内存不够，虚拟机加大内存到 4G 再重启就可以了；

# 修改root 账号默认密码

查看 root 账号密码

```sh
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

第一次登录时需要修改root账号的密码，然后要重启 gitlab 容器，一定要重启；

```sh
# 先进入 gitlab 容器
docker exec -it gitlab bash
# 进入到gitlab命令行，需要等待片刻，出现 irb(main):001:0> 才算进入交互模式，
gitlab-rails console
# gitlab-rails console -e production

# 获取用户，第一个用户是 root 
user = User.where(id:1).first
# user = User.where(username: 'root').first

# 必须同时更改密码和password_confirmation才能使其正常工作，别忘了保存更改
user.password = 'caz408727'
user.password_confirmation = 'caz408727'
# 出现 true 表示修改成功
user.save!
Administrator
```



## 安装和注册 gitlab-runner

### 安装gitlab-runner，两种方式

- 方式1

```sh
sudo docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

- 方式2 

  > docker-compose 

  ```sh
  version: "3"
  services:
    gitlab-runner:
      image: gitlab/gitlab-runner:latest
      restart: always 
      depends_on:
        - gitlab
      container_name: gitlab-runner
      # 开启授权访问
      privileged: true
      # 容器卷
      volumes:
        - /srv/gitlab-runner/config:/etc/gitlab-runner
        - /var/run/docker.sock:/var/run/docker.sock
  ```

  

### 注册gitlab runner 

> token 需要到运行起来的 gitlab 页面头部菜单找到 扳手图标--> Runners --> Register an instance runner --> 复制要一个 token 过来；然后填到如下参数中

注册成功后可以看到复制token的页面下方，会出现一个 gitlab-runner 实例

- 方式1

  ```sh
   docker run --rm -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register \ 
    --non-interactive \
    --executor "docker" \
    --docker-image alpine:latest \
    --url "http://gitlab.mczaiyun.top/" \
    --registration-token "vtizNrFzQKFacsSMxsJX" \
    --description "first-register-runner" \
    --tag-list "test-cicd1,dockercicd1" \
    --run-untagged="true" \
    --locked="false" \
    --access-level="not_protected"
  ```

- 方式2

  > 容器名为 gitlab-runner

  ```sh
  # 进入 gitlab-runner 容器中
  docker exec -it gitlab-runner bansh
  # 注册，url 可以是域名或 ip，token 是上面复制的 ip
  gitlab-runner register \
    --non-interactive \
    --executor "docker" \
    --docker-image alpine:latest \
    --url "http://192.168.201.129/" \
    --registration-token "i4LJ1qrrPd9M44Xg6qUB" \
    --description "first-register-runner" \
    --tag-list "test-cicd1,dockercicd1" \
    --run-untagged="true" \
    --locked="false" \
    --access-level="not_protected" 
  ```

- 方式3 

  > 使用命令行交互的方式





https://zhuanlan.zhihu.com/p/63786567

https://blog.csdn.net/BThinker/article/details/124097795

https://www.jb51.net/article/152570.htm

https://zhuanlan.zhihu.com/p/328795102

https://blog.csdn.net/u012922706/article/details/80252700























































