import React from './react';

// 告诉 babel 使用自定义的 React.createElement 来转译 jsx
/** @jsx React.createElement */
const container = document.getElementById('root');
const updateValue = e => {
  reRender(e.target.value);
};

function App({value}) {
  return (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
}

const reRender = value => {
  React.render(<App value={value} />, container);
};

reRender('World');
