学了 `HTML/CSS/JavaScript` 和 `Webpack` 还想学？让这篇文章教学你如何基于 `vite` 从 `0` 到 `1` 启动一个 `Vue` 项目

_下面是这个项目运行效果_

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290012578.png)

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

但如果你继续深入学习的话或者看过一些学习视频，他们可能会推荐你去使用 `Webpack` 或者 `Vite` 等一些成熟的工具链去开发项目，而前面我有一篇文章介绍过[基于 Webpack 从 0 到 1 启动一个 Vue 项目](https://juejin.cn/post/7170725391353511944)，那么如何通过 `Vite` 去运行一个项目呢？ 接下来就教你们一步步简单运行一个 `Vue` 项目

# Vite 启动

先找个位置并在终端（或者命令行）初始化一个项目

```shell
npm init
```

初始化后会有一些选项，可以直接回车全部忽略，也可以根据自己意向填写

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211282335003.png)

选择完成之后

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211282335120.png)

这个时候系统会创建一个 `package.json` 文件

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211282336357.png)

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
<script src="./main.js"></script>
```

此时的文件结构

```
├── node_modules
├── main.js
├── index.html
├── package-lock.json
└── package.json
```

如果你有过 `HTML` 部署的经验或者你的电脑上的 `VS Code` 恰好有 `Live Server` 这个软件，你会发现这个文件结构已经能够运行

但是效果和预期不一样，会是下面这样

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211272334882.png)

此时控制台会有一个错误

> Uncaught SyntaxError: Cannot use import statement outside a module (at main.js:1:1)

这个错误的意思是无法在模块外部使用 `import`，虽然但是，我没能理解它这个的意思

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211222003384.png)

不过这个错误的原因是我们在引入的 `main.js` 中使用了 `ES Module` 语法/规范

```js
import Vue from "vue";
```

那么如何能够解决这个报错呢？这里可以普及一下 `esm` 的理念，现在浏览器已经支持直接使用 `ES Module`，这意味着使用 `ES Module` 规范的模块可以直接在浏览器中使用，其实这也是 `Vite` 这类框架的出现的基础，直接使用模块而不再是打包成一个文件引用

而解决这个问题的具体的操作如下

_完成以下操作，需要下载 `Live Server` 插件_

1. 第一步，在 `index.html` 的引入脚本中开启 `type="module"`，如下

```html
<body>
  <div id="app">
    <div>
      {{ "count:" + count }}
      <button @click="handleClick">click + 1</button>
    </div>
  </div>
</body>
<script type="module" src="./main.js"></script>
```

2. 第二步，开启 `package.json` 的 `"type": "module"`

```json
{
  // ...
  "type": "module",
  // ....
}
```

3. 第三步，最骚的来了，根据这个[对不同构建版本的解释 - Vue.js 文档](https://v2.cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A "对不同构建版本的解释")找到对应的文件 `vue.esm.broswer.js`（可以直接在浏览器使用，而且既有**编译时又有运行时**），然后拖出来和 `index.html` 在同一文件夹下，修改 `main.js` 的导入方式

_PS: 有编译时的 `Vue.js` 才可以正确解析 `{{ "count:" + count }}`_

```js
import Vue from "./vue.esm.browser.js"

// ...
```

此时的文件结构

```
├── node_modules
├── main.js
├── index.html
├── vue.esm.browser.js
├── package-lock.json
└── package.json
```

再次刷新运行

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211282354157.png)

解析成功

你可能会觉得主动去 `node_modules` 里拖出一个文件也太秀了，有没有一种工具可以直接找到并运行在浏览器里呢？没错，`Vite` 就是干这件事的

# Vite

```shell
npm install vite --save-dev
```

新增 `script`

```json
{
  // ..
  "scripts": {
    // 新增部分
    "dev": "vite",
  },
  // ...
  "dependencies": {
    "vite": "^3.2.4",
    // ...
  }
  // ...
}
```

修改 `main.js`

```js
import Vue from "./node_modules/vue/dist/vue.esm.browser.js"
```

新增 `vite.config.js` 文件

```js
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // root 默认值是 process.cwd(), 即当前工作文件夹
  // 所以例子中的 index.html 无需任何修改
  // 同时 index.html 中引用的 .js 需要在同一个 root 目录下
  root: process.cwd(),
  server: {
    port: 5173, // 默认端口是 5173
  },
  plugins: [vue()],
});
```

_注意：由于 `Vite` 配置有一些默认值，所以我将一些关键的属性重写并做了注释_

运行 `npm run dev`，结果如下

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290012974.png)

同样解析成功

## 与 Webpack 比较

比较一下 `Webpack` 启动 `Vue2` 项目和 `Vite` 启动 `Vue2` 项目的终端/命令行对比图

`Vite`

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290017362.png)

`Webpack` 

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211280015771.png)

通过上面的图片可以看出来，`Vite` 好像其实就是只开了 `5173` 的服务，而 `Webpack` 却的实打实的 `code generated`（打包），同时这就是这两个开发工具为什么在速度上会有差距，回到 `Vite` 文档的两张图，你会更清楚两者的工作原理

`Vite`

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290027694.png)

`Webpack` 

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290026255.png)

在看一下刚才的例子是不是真的请求过我们的 `Vue` **模块**

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211290028177.png)

# 添加 .vue 支持

有朋友可能会问了，你这个味道不对呀，我平时开发都是用的 `.vue` 后缀的文件开发呀，我要用单文件组件（`Single File Components (SFCs)`）开发！

对于现在的前端工程化来说，不可能全部 `html` 代码都写在同一个文件里，正确的处理方式是编写 `SFC` 然后通过 `JS` 模块化统一导入到 `html` 中

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211291524385.png)

对于 `JS` 的模块化当然是只能导入 `.js` 文件，但是为了便于平时的开发，`Vue` 框架提供了 `.vue` 文件（`SFC`）的选择，然后通过编译转成 `.js` 文件

而在 `Vite` 中提供这一支持的是

-   Vue 2.7 支持：[@vitejs/vite-plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
-   Vue <2.7 的支持：[underfin/vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

由于本篇文章采用的是 `vue@2.7.10`，因此需要导入 `@vitejs/vite-plugin-vue2`

```shell
npm install @vitejs/plugin-vue2 --save-dev
```

修改 `vite.config.js`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
```

迁移 `index.html` 模板内容和 `main.js` 部分 `Javascript` 至 `App.vue`

```html
<!-- index.html -->
<body>
  <div id="app"></div>
</body>
<script type="module" src="./main.js"></script>
```

```js
// main.js
import Vue from "vue";
import App from "./App.vue";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

```vue
<!-- App.vue -->
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
```

再次运行 `npm run dev`，解析成功

![IMG](https://raw.githubusercontent.com/pandoralink/my-drawing-bed/main/img/202211291542498.png)

从上面文章其实有一些问题并没有详细讲解，读者看完可以思考一下

1. 为什么通过 `import Vue from 'vue'` 能够直接找到 `node_modules` 中的对应文件
	1. `import Vue from 'vue'` 是怎么判断是 `CommonJS` 还是 `ES Module`
	2. 设置 `<script type="module" ... />` 和 `package.json` 的属性 `"type": "module"` 之后，为什么 `import Vue from 'vue'` 默认导出的是仅运行时的 `Vue`，即 `vue.runtime.esm.js`
2. 基于 `ES Module` 规范导入模块/库/包，那么面对一些老的库，不支持 `ES Module` 时，`Vite` 会怎么处理？ 

**本篇文章例子的 `github` 库**，[pandoralink/vue2-start-with-vite](https://github.com/pandoralink/vue2-start-with-vite)

# 参考资料

1. [为什么选 Vite - Vite 官方文档](https://cn.vitejs.dev/guide/why.html#the-problems)
2. [对不同构建版本的解释 - Vue.js 文档](https://v2.cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A "对不同构建版本的解释")