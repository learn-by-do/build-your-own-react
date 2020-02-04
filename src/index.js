import React from './react';

// 告诉 babel 使用自定义的 React.createElement 来转译 jsx
/** @jsx React.createElement */
const container = document.getElementById('root');

function Counter() {
  const [count, setCount] = React.useState(1);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>click to add 1</button>
      <h2>Count: {count}</h2>
    </div>
  );
}

React.render(<Counter />, container);
