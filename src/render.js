function createDom(fiber) {
  const { type, props } = fiber;
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
  return dom;
}


function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null;
}

function commitWork(fiber) {
  if(!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * render virtual DOM to DOM
 *
 * @param {*} element
 * @param {*} container
 */
function render(element, container) {
  // 初始化第一个碎片任务
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  };
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * perform work, return next unit work
 *
 * @param {*} fiber
 */
function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 这个会导致 UI 不完整渲染，所以拆解为 commitRoot，当没有碎片任务时，整体渲染 DOM
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // create new fiber from children
  const { children } = fiber.props;
  let preSibling = null;

  for (const child of children) {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null
    };
    // 设置子
    if (!preSibling) {
      fiber.child = newFiber;
    } else {
      // 设置兄弟
      preSibling.sibling = newFiber;
    }
    preSibling = newFiber;
  }

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

export default render;
