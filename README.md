## portal-client
portal客户端，负责连接远程服务与本地项目

### 项目架构
![portal](https://p1.music.126.net/IXF1NONMG2HBxEPQma__NQ==/109951163753411807.png)

[查看portal-server点这里](https://github.com/ImmortalLark/portal-server)

## 安装
```js
npm i -g lark-portal-cli
```

## 启动
```js
portal -- --rh [domain]
```
如果有配置文件的话也可以直接在工程目录下这样启动
```js
portal
```

## 启动参数

启动参数的优先级高于配置文件同名参数

```js
  Options:
  --rh, --remote-host           远端服务域名                            [required]
  --rp, --remote-port           远端服务端口
  --lh, --local-host            本地工程域名
  --lp, --local-port            本地工程端口
  -s, --subdomain               指定要连接的子域名
  --fb, --fallback              备用请求地址
  --rcp, --remote-connect-port  指定要连接的tcp端口
  --help                        Show this help and exit                [boolean]
  --version                     Show version number                    [boolean]
```

## 配置文件 
命名为portalconfig.json（在配置文件所在目录执行启动命令）
```json
{
  "remoteHost": "xx.yy.com",
  "remotePort": 80,
  "localHost": "localhost",
  "localPort": 9527,
  "remoteConnectPort": 80,
  "fallback": {
    "/api": {
      "host": "xx.yy.com:80", // 可配置端口
      "force": true, // 强制fallback开关，可直接将请求代理到指定地址
      "headers": { // 可替换需要配置的请求头
        "x-from-isp": "1"
      }
    },
    "/m": {
      "host": "xx.yy.com"
    }
  },
  "subdomain": "sub"
}
```
