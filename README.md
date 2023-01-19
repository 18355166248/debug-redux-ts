# 调试 react-redux 和 redux 源码

| 依赖        | 版本   |
| ----------- | ------ |
| react       | 18.2.0 |
| react-redux | 18.0.5 |
| redux       | 4.2.0  |

## 安装

### 1. 初始化

我们先使用 create-react-app 去下载 redux 模板的代码

```bash
  # JS
  npx create-react-app my-app --template redux
  # TS
  npx create-react-app my-app --template redux-typescript
```

然后我们使用命令去 clone react-redux 和 redux 的代码到 src 目录下

```bash
  cd src
  git clone --branch v18.0.5 git@github.com:reduxjs/react-redux.git
  git clone --branch v4.2.0 git@github.com:reduxjs/redux.git
```

### 调试

我们需要执行 cra 的 eject 命令去将打包的 webpack 配置暴露出来, 以便我们修改配置, 当然如果你想用 craco 也是可以的 最新的 craco 已经支持 cra 版本了

执行完 eject 后 我们需要找到 webpack 代码修改一下

> config/webpack.config.js

```JS
{
  extensions: paths.moduleFileExtensions
    .map((ext) => `.${ext}`)
    .filter((ext) => useTypeScript || !ext.includes("ts")),
  alias: {
    // Support React Native Web
    // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
    "react-native": "react-native-web",
    // Allows for better profiling with ReactDevTools
    // ...(isEnvProductionProfile && {
    //   'react-dom$': 'react-dom/profiling',
    //   'scheduler/tracing': 'scheduler/tracing-profiling',
    // }),

    // TODO start
 +  "react-redux": path.join(paths.appSrc, "react-redux/src"),
 +  redux: path.join(paths.appSrc, "redux/src"),
    // TODO end

    ...(modules.webpackAliases || {}),
  },
}
```

这个时候我们执行 npm run start 一定会一大堆报错, 包括 eslint 和 ts 的

我们需要删除一些文件

- src/react/.eslintrc
- src/react/test
- src/react-redux/.eslintrc
- src/react-redux/test

还要删除一些 package.json 里面的依赖

src/react-redux/package.json 下的 react 和 react-dom 相关的依赖和 @types

然后我们这个时候再运行 npm run start 可以发现已经正常了
