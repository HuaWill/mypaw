import React from 'react';

export const itemFy = ItemComponent => {
  return class extends React.Component {
    render() {
      return (
        <div className={`item ${ItemComponent.className}`}>
          <ItemComponent {...this.props}/>
        </div>
      );
    }
  };
};

export const click = enable => ItemComponent => {
  return class extends React.Component {

    static className = ItemComponent.className;

    render() {
      return (
        <div onClick={ enable ? this.props.onClick : () => void 0 }>
          <ItemComponent {...this.props} />
        </div>
      );
    }
  }
}

export function beforeRender(blockRender) {
  return function (target, name, descriptor) {
    const original = descriptor.value;
  
    if (typeof original === 'function') {
      descriptor.value = function(...args) {
        return blockRender ? <div>禁止渲染</div> : original.apply(this, args);
      };
    }
  
    return descriptor;
  }
}
