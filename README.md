## portal-client
portal客户端，负责连接远程服务与本地项目

## 安装
```js
  nenpm i -g @music/portal-client
```

### 启动
```js
portal --rh [domain]
```
如果有配置文件的话也可以直接在工程目录下这样启动
```js
portal
```
### 启动参数
```js
  Options:
  --rh, --remote-host           远端服务域名                            [required]
  --rp, --remote-port           远端服务端口
  --lh, --local-host            本地工程域名
  --lp, --local-port            本地工程端口
  -s, --subdomain               指定要连接的子域名
  --rcp, --remote-connect-port  指定要连接的tcp端口
  --help                        Show this help and exit                [boolean]
  --version                     Show version number                    [boolean]
```

### 配置文件 
命名为portalconfig.json（在配置文件所在目录执行启动命令）
```json
{
  "remoteHost": "portal.qa.igame.163.com",
  "remotePort": 80,
  "localHost": "localhost",
  "localPort": 9527,
  "remoteConnectPort": 80,
  "fallback": {
    "/m": "music.163.com",
    "/api/xx": "music.163.com"
  },
  "subdomain": "sub"
}
```
