/**
 * render virtual DOM to DOM
 * 
 * @param {*} element 
 * @param {*} container 
 */
function render(element, container) {
  const { type, props } = element;
  const dom =
    type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(type);

  const isProperty = key => key !== 'children';

  Object.keys(props)
    .filter(isProperty)
    .forEach(prop => {
      dom[prop] = props[prop];
    });

  props.children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

export default render;
