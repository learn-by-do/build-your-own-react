# 写一个自己的 React

```shell
# 安装依赖
yarn

# 本地开发
yarn start
```

## 函数组件

```js
function App({value}) {
  return (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
}
React.render(<App value={value} />, container);

// 被 babel 转译为
function App(_ref) {
  var value = _ref.value;
  return React.createElement(
    "div",
    null,
    React.createElement("input", {
      onInput: updateValue,
      value: value
    }),
    React.createElement("h2", null, "Hello ", value)
  );
}

React.render(
  React.createElement(App, {
    value: value
  }),
  container
);
```

函数组件(FC)有这么两点不同：

1. children 是通过执行 FC 得到的，而不是直接从 props 里取
2. FC 生成的 fiber 没有 DOM 节点

对第 1 点，通过 `fiber.type(fiber.props)` 获取到 `children`，并组装为标准结构 `[children]`，从而与普通 HTML 元素组件统一：

```js
const children = [fiber.type(fiber.props)];
```

对第 2 点，因为 FC 生成的 fiber 没有 DOM 节点，因此在挂载时，需要向上找有 DOM 节点的 parent，然后通过该 parent 来挂载(appendChild)，同样的，删除 FC 的 fiber 时，需要找到有 DOM 节点的 parent，以及有 DOM 节点的 child，从 parent 里移除 child。
