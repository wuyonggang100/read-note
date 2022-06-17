# Linux云服务器安装宝塔面板

1. 登录 linux ；

2. 执行安装命令:

   ```sh
   curl -sSO http://download.bt.cn/install/install_panel.sh && bash install_panel.sh
   ```

3. 没有用 root 账号登录，使用 xxx 账号登录，安装时提示 **请使用root权限执行命令**；

   > 提示 xxx 不在 sudoers 文件中。此事将被报告。
   >
   > 说明sudoers文件放在etc目录下

   解决方法，执行如下命令切换到 root 账号，然后再执行安装命令就可以了

   ```sh
   su root  # 后需要输入 root 账号密码
   ```

   外网面板地址: http://183.62.140.226:8888/50b1741f
   内网面板地址: http://192.168.201.128:8888/50b1741f
   username: xz0zhrmm
   password: dcedb085

   

