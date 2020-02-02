import React from './react';

// 告诉 babel 使用自定义的 React.createElement 来转译 jsx
/** @jsx React.createElement */
const element = (
  <div style="background-color: lightyellow">
    <h1>Hello React!</h1>
    <p style="text-align: right">
      <span>————</span>
      <a href="#dog">Jonge Den</a>
    </p>
  </div>
);
const container = document.getElementById('root');
React.render(element, container);
