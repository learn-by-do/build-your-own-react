# 写一个自己的 React

```shell
# 安装依赖
yarn

# 本地开发
yarn start
```

前面已经完成了基本的渲染，那么如何更新 DOM 呢？

需要记录上一次提交 DOM 时的 fiber 树，在 performUnitOfWork 中做新、旧 fiber 的比较，主要有更新、新增、删除三种情况，具体代码见函数 [reconcileChildren](./src/render.js#L159)
