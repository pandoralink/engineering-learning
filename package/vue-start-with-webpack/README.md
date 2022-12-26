面试总是问 `Webpack` 怎么样？有什么用？有几个 `loader`，有几个 `plugin`，结果一去写业务，全都是上的 `Vue CLI`，`create-react-app`，启动配置什么的，前辈们都配好了

所以这篇文章就是教学如何基于 `Webpack` 从 `0` 到 `1` 启动一个 `Vue` 项目，下面是这个项目运行效果

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272332266.png)

# 传统启动

如果你是刚开始接触 `HTML/CSS/JavaScript` 三件套开始接触的前端，那么你可能比较熟悉或者比较能接受的引入 `Vue` 的方式可能是使用 `CDN` 的方式，大概如下（下面这个是我要介绍的例子）

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<body>
  <div id="app">
    <div>
      {{ "count:" + count }}
      <button @click="handleClick">click + 1</button>
    </div>
  </div>
</body>
<script>
  new Vue({
    data() {
      return {
        count: 0,
      }
    },
    methods: {
      handleClick() {
        this.count++;
      },
    }
  }).$mount('#app');
</script>
```

但如果你继续深入学习的话或者看过一些学习视频，往往他们会推荐你去使用 `Vue CLI` 去开发 `Vue` 项目，因为具有一定规模的项目是需要这类脚手架的，它集成了很多功能，但是如果让你自己扔掉 `Vue CLI` 你能否能够在浏览器中运行呢？因为究其本质，`Vue CLI` 是基于 `node` 和 `npm` 运作的，接下来就教你们一步步简单运行一个 `Vue` 项目

# Webpack 启动

## npm 初始化

先找个位置并在终端（或者命令行）初始化一个项目

```shell
npm init
```

初始化后会有一些选项，可以直接回车全部忽略，也可以根据自己意向填写

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272304964.png)

选择完成之后

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272305448.png)

这个时候系统会创建一个 `package.json` 文件

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272306328.png)

接下来要做的就是安装 `Vue`

```shell
# 文章使用的 Vue2 运行
npm install vue@2.7.10
```

然后你的 `package.json` 会有多出一个 `dependencies` 属性，如下

```json
{
  "dependencies": {
    "vue": "^2.7.10"
  }
}
```

所以上面的例子需要改成如下写法

```js
// <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
import Vue from "vue"
```

但这种写法在 `HTML` 文件需要使用 `module` 加持，而且现在的 `Vue` 的位置在 `node_modules`，不能再从 `HTML` 中直接导入，所以需要将上面例子中的 `JS` 代码脱离，命名为 `main.js`

```js
import Vue from "vue";

new Vue({
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    handleClick() {
      this.count++;
    },
  }
}).$mount('#app');
```

`html` 部分命名为 `index.html`

```html
<body>
  <div id="app">
    <div>
      {{ "count:" + count }}
      <button @click="handleClick">click + 1</button>
    </div>
  </div>
</body>
<script type="text/javascript" src="./main.js" charset="utf-8"></script>
```

_PS: 为什么脚本引入放在了下面？是因为 `main.js` 里面包含了获取 `DOM` 的代码，所以为了能够获取到 `<div id="app">...</div>` 必须放在其下面导入_

此时的文件结构

```
├── node_modules
├── main.js
├── index.html
├── package-lock.json
└── package.json
```

如果你有过 `HTML` 部署的经验或者你的电脑上恰好有 `Live Server` 这个软件，你会发现这个文件结构已经能够运行

但是效果和预期不一样，会是下面这样

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272334882.png)

为什么显示是 `{{"count:" + count}}` 而没有被解析呢？

这是因为在 `js` 中默认导出的 `Vue.js` 是只包含运行时而不包含编译时的，而编译时干的就是解析的活，具体可以参考这个文档，[对不同构建版本的解释 - Vue.js](https://v2.cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

像 `CDN` 使用的就是 `UMD` 完整版的 `Vue.js`，而 `js` 中导出的是只包含运行时的 `Vue.js`

对于这个问题可以使用 `Vue` 提供的 `h()` 渲染函数，像下面这样

```js
new Vue({
  // ...
  render(h) {
    return h("div", [
      "count:" + this.count,
      h(
        "button",
        {
          on: {
            click: this.handleClick,
          },
        },
        "click + 1"
      ),
    ]);
  },
  // ...
}).$mount("#app");
```

等同于下面的 `HTML`

```html
<div>
  {{ "count:" + count }}
  <button @click="handleClick">click + 1</button>
</div>
```

然后在 `package.json` 和 `html` 的导入方式中设置为 `module`，也可以生成同样的效果，具体详情就不多演示，因为这涉及到另一个前端工程化的大方向，也就是 `Vite` 类型的打包框架

当然你也使用 `vue-loader`，但是使用 `vue-loader` 的前提需要一个前提，即 `Webpack`

## Webpack

执行

```shell
npm install webpack webpack-dev-server webpack-cli --save-dev
```

1. `webpack` 是一个打包器，可以将不同模块的 `.js` 文件打包成一个 `.js` 文件，就比如上面的 `Vue.js` 和 `main.js` 合并成一个 `.js` 文件
2. `webpack-dev-server` 可以监视 `.js` 文件内容的修改，进行热更新，具体场景比如更新 `DOM` 的内容，然后更新到浏览器
3. `webpack-cli` 可以在终端执行 `webpack` 和 `webpack-dev-server`

`webpack` 重点在于它的配置，配置如下

```js
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8080,
  },
  entry: path.join(__dirname, "./main.js"),
  output: {
    publicPath: "",
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
    clean: true,
  },
};
```

我认为 `Webpack` 的配置是一定要讲的，因为有非常多的属性有默认值，关键是它还比较重要！！

我强烈建议**不要随便百度你遇到的问题，请去查看 Webpack 文档，即使它有点烂**

解析如下

1. `mode` 是 `webpack` 的运行配置
2. `entry` 是打包的入口文件，这里默认为 `main.js`
3. `output` 是打包的出口文件，也就是打包结果
	1. `path` 是打包文件的存放位置，由于我们目的是运行 `Vue` 项目，目的不在打包而是运行，所以不需要过多关注
	2. `publicPath` 需要重点关注，和 `webpack-dev-server` 紧密相连，这个属性目的在于配置使用 `webpack-dev-server` 启动时打包文件的引用位置
4. `devServer` 是 `webpack-dev-server` 的配置选项，等同于 `Live Server`
	1. `port` 启动一个服务在 `localhost:port`，你可以直接通过 `http://localhost:port` 访问热更新的内容
	2. `static`
		1. `directory` 是配置静态文件展示的位置的选项，可以简单理解可以直接在浏览器访问在这个位置的 `index.html`，如上就是 `http://localhost:8080`

配置完 `Webpack`，项目的文件也需要重新调整

1. `index.html` 需要迁移至 `public`
2. 里面的 `.js` 文件需要改成打包后的文件，即如下

```html
<body>
<!-- ... -->
</body>
<script type="text/javascript" src="./bundle.js" charset="utf-8"></script>
```

然后还需要修改一下 `package.json` 的内容，修改如下

```json
{
  "name": "vue-start-with-webpack",
  "version": "1.0.0",
  "description": "运行 vue 项目 demo",
  "main": "main.js",
  "scripts": {
    "start": "webpack server", // 启动 webpack-dev-server
  },
  "author": "poplink",
  "license": "MIT",
  "dependencies": {
    "vue": "^2.7.10"
  },
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.0",
    "webpack-dev-server": "^4.11.1"
  }
}
```

现在的目录结构如下

```
├── node_modules
├── public
|  └── index.html
├── main.js
├── package-lock.json
├── package.json
└── webpack.config.js
```

测试运行 `npm run start`，结果如下

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211280015771.png)

**注意**，这个时候你可以观察一下目录里面并没有生成 `bundle.js`，但 `webpack-dev-server` 并不是没有打包，而是放在了内存里，只是你没看见，具体可以参考[文档](https://webpack.docschina.org/guides/development/#using-webpack-dev-server)

> Warning
    webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 [`devMiddleware.publicPath`](https://webpack.docschina.org/configuration/dev-server/#devserverdevmiddleware) 选项进行修改。

这也就是为什么需要强调 `publicPath` 的重要性，它就是指定了 `bundle.js` 的引用位置

对于值的取舍可以参考 [Webpack 文档](https://webpack.docschina.org/configuration/output/#outputpublicpath)

# vue-loader 引入

先安装 `vue-loader`

```shell
# 注意：vue-loader@15.9.2 适配 Vue2，不要安装最新版，有坑，运行不起来
# 注意：vue-template-compiler 需要和你的 Vue2 版本一致！
npm install vue-loader@15.9.2 vue-template-compiler@2.7.10 --save-dev
```

在 `webpack.config.js` 中添加

```js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      }
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
```

但到这里其实还没有结束，因为我们的 `vue-loader` 是针对 `.vue` 文件的，所以需要将 `dom` 相关的内容迁移至 `.vue` 文件里

在 `main.js` 同目录下创建 `App.vue` 文件，内容如下

```vue
<template>
  <div>
    {{ "count:" + count }}
    <button @click="handleClick">click + 1</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    handleClick() {
      this.count++;
    },
  },
};
</script>
<style></style>
```

`main.js` 的内容修改为

```js
import Vue from "vue";
import App from "./App.vue";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

`index.html` 的内容修改为

```html
<body>
  <div id="app"></div>
</body>
<script type="text/javascript" src="bundle.js" charset="utf-8"></script>
```

再次运行 `npm run start` 结果如下

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272332266.png)

最后检查一下热更新

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211281624824.gif)

最后的文件目录如下，以及 `github` 的例子请参考

```
├── node_modules
├── public
|  └── index.html
├── App.vue
├── main.js
├── package-lock.json
├── package.json
└── webpack.config.js
```

# 总结

刚刚接触 `Vue CLI` 的同学可以对比一下 `Vue CLI` 创建的项目和本篇文章的文件目录对应的文件比较，对应 `Vue CLI` 部分原理

_PS: `.js` 到 `.vue` 的操作就是这么简单，但好像也没用几个 `loader`_
