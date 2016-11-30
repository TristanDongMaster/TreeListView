#级联树说明（tree list view）
	
	1. 支持多层树结构，理论支持无数层
	2. 节点包含三种状态：全选，部分选中，未选中
	3. 自定伸展状态
	4. 可根据需要，自行替换图标和更改样式

# demo

	[Demo page](https://tristandongmaster.github.io/TreeListView/demo/test.html)	

# 预览

	![Demo 预览](https://tristandongmaster.github.io/TreeListView/demo/img/1.png)

————————————————————————————————————————————————————————————————————————————————————
## 使用的技术 

	pug —— 原来的 jade ，编写html的源码
	jquery —— 必要的 jq 方法
	less —— 样式文件
	gulp —— 前端工作流
	
## 命令

	npm run dev#启动开发环境

	npm run serve#启动静态服务器

	npm run build#本地编译生成资源