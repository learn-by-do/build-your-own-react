# 写一个自己的 React

```shell
# 安装依赖
yarn

# 本地开发
yarn start
```

## useState

以 `const [state, setState] = useState()` 为例：

```js
function Counter() {
  const [count, setCount] = React.useState(1);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>click to add 1</button>
      <h2>Count: {count}</h2>
    </div>
  );
}
```

针对每个函数组件都有计数器 `hookIndex` 和 hooks 队列，在 `useState` 被调用时，从对应 fiber 上取旧 hook（在 `fiber.alternate.hooks[hookIndex]`，如果没有则添加一个，要返回的 `state` 根据旧的 `setState` 的输入计算得到，`setState` 重启了 `workLoop`（相当于 re-render）。见源码 [`updateFunctionComponent` 和 `useState`](./src/render.js#L166)

