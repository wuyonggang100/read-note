

https://verdaccio.org/docs/what-is-verdaccio

# 一、在 node 中使用

### 1.1、 安装

```sh
npm i verdaccio -g 
```



### 1.2、 运行 verdaccio 

> 启动 ，然后就能访问， 默认 4873端口，可以修改 ；

```sh
verdaccio --listen 4000 --config ~./config.yaml #指定端口和配置文件运行
```

### 1.3、使用[pm2](https://pm2.keymetrics.io/)进程管理verdaccio

```sh
# 安装pm2
sudo npm install -g pm2
# 启动verdaccio
pm2 start verdaccio
# pm2基本操作
pm2 start verdaccio			 # 使用pm2启动应用
pm2 list					# 查看pm2列表项，即应用状态
pm2 logs					# 查看应用输入的日志
pm2 monit					# 查看当前通过pm2运行的进程的状态
pm2 describe verdaccio        # 查看应用的进程状态
pm2 restart verdaccio	      # 重启引用，用于修改配置以后重启项目
pm2 stop verdaccio | pid	  # 停止应用(以应用名或者pid都可以)
pm2 stop all 				 # 停止所有应用
pm2 delete verdaccio | pid 	  # 将应用从pm2列表中删除
```



# 二、在 docker 中使用

### 2.1、翻译成 dockerfile 镜像

```dockerfile
FROM node:14-alpine
RUN yarn add verdaccio global
RUN verdaccio --listen 4000 --config ~./config.yaml
```

### 2.2、使用 docker-compose 启动服务

```dockerfile

```

启动后在浏览器中访问 192.168.209.129:4873，可以看到页面；

# 四、添加用户

### 1、直接在前台运行 verdaccio

> 此时可以看到日志

```sh
docker-compose up --build verdaccio  # 前台运行 verdaccio
docker logs --tail 20 verdaccio # 打印最后 20 条日志
```

### 2、添加用户以及权限报错解决

```sh
npm adduser --registry  http://192.168.201.129:4873
```

会看到报错了，如下

```sh
Error: EACCES: permission denied, open '/verdaccio/conf/htpasswd'
```

原来是没有权限。查了一番资料得知，用户在新增 npm 用户的时候会写入 htpasswd 文件，由于该文件是在宿主机中，默认是 root 用户建立的，而 verdaccio 容器中拥有自己的用户名，名字就叫 verdaccio，所以无法写入 root 用户拥有的文件。
那么是不是还要在宿主机上新建 verdaccio 用户呢？不用这么麻烦。根据官方文档和文末的最后一篇文章得知，docker 容器中的 uid 和 gid 和宿主机是共享的，只不过没有具体的名称，而容器内 verdaccio 使用的 uid 为 10001，gid 为 65533，所以我们在宿主机改一下 htpasswd 文件的权限，同理，`storage` 目录是 verdaccio 存放包数据的目录，也需要修改一下权限：

```sh
sudo chown 10001:65533 htpasswd # 在 verdaccio/conf 目录下运行
sudo chown -R 10001:65533 storage # 在verdaccio 目录下运行
```

再次添加用户，就能添加成功了；

> 添加用户成功以后在 htpasswd 文件中可以看到用户信息

```sh
zhangsan:1aIvkKi3bjiNE:autocreated 2022-08-19T09:10:32.958Z
```

至此 verdaccio 才算真正运行起来了，可以在浏览器页面中登录了；

# 五、使用 nrm 来连接私库

```sh
npm i -g nrm
# 查看 nrm帮助
nrm -h
# 列出当前 nrm 存储的npm源
nrm ls
# 添加用户自定义的源
nrm add mynpm 192.168.0.118:4873
# 使用指定源(即登录npm)
nrm use mynpm
# 添加用户(跟随提示填写用户名、密码、邮箱即可)
npm adduser
# 删除用户(注册的用户信息会存储在 ~/.config/verdaccio/htpasswd 文件中,打开文件，删除对应的记录)
sudo vim ~/.config/verdaccio/htpasswd
```

六、上传和下载



七、配置文件 config.yaml

> 默认配置见 https://github.com/verdaccio/verdaccio/tree/master/packages/config/src/conf
>
> 在 docker 中不要使用 listen 配置项来指定端口，会被忽略；见 https://github.com/verdaccio/verdaccio/blob/master/wiki/docker.md#docker-and-custom-port-configuration

```yaml
#
# This is the config file used for the docker images.
# It allows all users to do anything, so don't use it on production systems.

# path to a directory with all packages
# 包存放的位置，包括从上游下载的和私有上传的
storage: /verdaccio/storage

auth:
  htpasswd:
    # 用户信息存放的文件
    file: /verdaccio/conf/htpasswd
    
    # 允许用户注册的数量，默认1000，设为-1时，不允许用户通过npm adduser注册。但是可以通过直接编写htpasswd file内容的方式添加用户
    max_users: 2 # 最多可以注册 2 个用户
    # hash 算法，选项可以是 "bcrypt", "md5", "sha1", "crypt"，默认 crypt
    algorithm: bcrypt
    # “bcrypt”的轮数，对于其他算法将被忽略,值设的越高，验证所需时间越久，大于 10 时 CPU 使用率显着增加，并在处理请求时产生额外的延迟
    rounds: 10
    # 如果密码的验证时间超过此持续时间（以毫秒为单位），则记录警告
    slow_verify_ms: 200
security:
  api:
    jwt:
      sign:
        expiresIn: 60d
        notBefore: 1
  web:
    sign:
      expiresIn: 7d

# 上游仓库，当从私有仓库下载不到依赖时，就去上游仓库下载，
uplinks:
  npmjs: # 名字可以自定义
    url: https://registry.npmjs.org/
    cache: true # 是否开启缓存，默认 true
    timeout: 3000ms # 超时不响应就去备选仓库下载
  yarnpkg:
  	url: https://registry.yarnpkg.org/
    cache: true 
    timeout: 3000ms
  local: # 私有仓库
    url: http:127.0.0.1:4873/
    
# 包相关的操作权限
# $all（所有人）, $anonymous（匿名用户）, $authenticated（认证用户）
# access 访问权限; publish 发布权限; unpublish 删除权限; proxy 若
packages:
  # 包名以 @vue/开头的匹配此规则，否则匹配后面的规则
  '@vue/*':
    access: $all # 所有人可以访问
    publish: $all # 所有人可以上传
	unpublish:$authenticated # 只有登陆的人才可以删除
	
  # 匹配所有命名以@开头的包，不包含 @vue/
  '@*/*':
    access: $all
    publish: $all
    # 下载/上传/删除时，用当前账号从前往后操作，前一个中操作失败，就到下一个仓库中操作，仓库名字能与 uplinks 中对应起来就可以
    proxy: taobao yarnpkg npmjs local 

  '**':
    access: $all  # 任意用户可访问
    publish: $all # 任意用户可发布

    # if package is not available locally, proxy requests to 'npmjs' registry
    # 如果本地仓库找不到，就到 npmjs 仓库中找
    proxy: npmjs

# To use `npm audit` uncomment the following section
middlewares:
  audit:
    enabled: true

# log settings
log:
  - { type: stdout, format: pretty, level: trace }
  #- {type: file, path: verdaccio.log, level: info}

```

**如果访问不了，可能需要开放防火墙端口，并且重启防火墙配置**





- listen: 监听的端口，可以修改

- storage： 仓库保存的地址，publish时仓库保存的地址。

- auth： htpasswd file：账号密码的文件地址，初始化时不存在，可指定需要手工创建。
  max_users：默认1000，为允许用户注册的数量。为-1时，不允许用户通过npm adduser注册。但是，当为-1时，可以通过直接编写htpasswd file内容的方式添加用户。
  语法：用户名:{SHA}哈希加密的字符=:autocreated 时间
  加密算法：SHA1哈稀之后再转换成 Base64 输出就好

- uplinks: 配置上游的npm服务器，主要用于请求的仓库不存在时到上游服务器去拉取。

- packages: 配置模块。

  > - access    访问下载权限,
  >
  > - publish   包的发布权限。格式如下：
  >
  >   ```sh
  >   scope:
  >   权限：操作
  >   ```

  - scope:两种模式
    一种是 @/ 表示某下属的某项目
    另一种是 * 匹配项目名称(名称在package.json中有定义)
  - 权限：
    l access: 表示哪一类用户可以对匹配的项目进行安装(install)
    l publish: 表示哪一类用户可以对匹配的项目进行发布(publish)
    l proxy: 如其名，这里的值是对应于 uplinks 的名称，如果本地不存在，允许去对应的uplinks去取。
    操作：

  l $all 表示所有人(已注册、未注册)都可以执行对应的操作
  l $authenticated 表示只有通过验证的人(已注册)可以执行对应操作，注意，任何人都可以去注册账户。
  l $anonymous 表示只有匿名者可以进行对应操作（通常无用）
  l 或者也可以指定对应于之前我们配置的用户表 htpasswd 中的一个或多个用户，这样就明确地指定哪些用户可以执行匹配的操作
  听端口和主机名。
  localhost:4873 　　　　 #默认
  0.0.0.0:4873　　　　　　 #在所有网卡监听

- 代理

  #http_proxy: http://something.local/  #http代理
  #https_proxy: https://something.local/  #https代理
  #no_proxy: localhost,127.0.0.1  #不适用代理的iP

