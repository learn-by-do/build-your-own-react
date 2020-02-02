import React from './react';

// 告诉 babel 使用自定义的 React.createElement 来转译 jsx
/** @jsx React.createElement */
const container = document.getElementById('root');
const updateValue = e => {
  reRender(e.target.value);
};

const reRender = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  React.render(element, container);
};

reRender('World');
