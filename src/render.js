function createDom(fiber) {
  const { type, props } = fiber;
  const dom =
    type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(type);

  updateDom(dom, {}, props);
  return dom;
}
const isEvent = key => key.startsWith('on');
const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (pre, next) => key => pre[key] !== next[key];
const isGone = (pre, next) => key => !(key in next);
const getEventName = key => key.toLowerCase().substring(2);

function updateDom(dom, preProps, nextProps) {
  // 删除旧/有改变的事件回调
  Object.keys(preProps)
    .filter(isEvent)
    .filter(
      key => isGone(preProps, nextProps)(key) || isNew(preProps, nextProps)(key)
    )
    .forEach(key => {
      dom.removeEventListener(getEventName(key), preProps[key]);
    });
  // 删除旧属性
  Object.keys(preProps)
    .filter(isProperty)
    .filter(isGone(preProps, nextProps))
    .forEach(key => (dom[key] = ''));

  // 设置/更新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(preProps, nextProps))
    .forEach(key => {
      dom[key] = nextProps[key];
    });
  // 添加事件回调
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(preProps, nextProps))
    .forEach(key => {
      dom.addEventListener(getEventName(key), nextProps[key]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
  }
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
    },
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
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

  // create new fiber from children
  const { children } = fiber.props;
  reconcileChildren(fiber, children);

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

/**
 * 比较同一层的新旧 Fiber，生成新 Fiber
 *
 * fiber 结构：
 * ```js
 * {
 *  type,
 *  props,
 *  parent,    // 父 fiber
 *  [child],   // 子 fiber
 *  [sibling], // 第一个兄弟 fiber
 *  alternate, // 旧 fiber
 *  dom,       // 生成的 DOM 元素
 *  effectTag, // 标记 DOM 操作类型：UPDATE，PLACEMENT，DELETION
 * }
 * ```
 *
 * @param {*} wipFiber
 * @param {*} children
 */
function reconcileChildren(wipFiber, children) {
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let preSibling = null;
  let index = 0;

  while (index < children.length || oldFiber) {
    const child = children[index];
    let newFiber = null;

    // 比较 oldFiber 和 child，有三种情况
    // 1. 相同类型节点，保留原 DOM，做属性更新
    // 2. 不同类型，并且有 child，新增节点
    // 3. 不同类型，有 oldFiber，需要删除原来的节点
    const sameType = oldFiber && child && oldFiber.type === child.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        parent: wipFiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    }
    if (child && !sameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: wipFiber,
        dom: null,
        alternate: null,
        effectTag: 'PLACEMENT'
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    // 设置子
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (child) {
      // 设置兄弟
      preSibling.sibling = newFiber;
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    preSibling = newFiber;
    index++;
  }
}

export default render;
