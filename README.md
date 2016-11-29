————————————————————————————————————————————————————————————————————————————————————
## 使用的技术 

	pug —— 原来的 jade ，编写html的源码
	knockoutjs —— 兼容 ie6 的 mvvm 的库，jquery 的 DOM 是开发和维护的深渊，避免这样的操作
	jquery —— 必要的 jq 方法
	less —— 样式文件
	gulp —— 前端工作流

## 前后端分离方式

前端开发环境独立运行在 node 服务器，用nginx 前置代理api请求。

所有的lauyout 都是前端用 pug 写好，所需要的数据通过 ajax 获取，然后用 knockout 做局部渲染

## 命令

	npm run dev#启动开发环境

	npm run serve#启动静态服务器

	npm run build#本地编译生成资源


## 增量发布策略

静态资源的版本号根据项目名称+版本号的md5值来定。每次迭代开发时，请手动更改 package.json 的 version 的值，修改原则可根据产品进度来


