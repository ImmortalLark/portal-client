## portal-client
portal客户端，负责连接远程服务与本地项目

### 启动
```js
node ./bin/portal-client

Options:
  --rh, --remote-host           远端服务域名                          [required]
  --rp, --remote-port           远端服务端口
  --lh, --local-host            本地工程域名
  --lp, --local-port            本地工程端口
  -s, --subdomain               指定要连接的子域名
  --rcp, --remote-connect-port  指定要连接的tcp端口
  --help                        Show this help and exit                [boolean]
  --version                     Show version number                    [boolean]
  ```