/**
 * element 结构: 
 * ```js
 * {
 *  type,
 *  props,
 *  children
 * }
 * ```
 * @param {*} type 
 * @param {*} props 
 * @param  {...any} children 
 */
const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  };
};

const createTextElement = text => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
};

export default createElement;
