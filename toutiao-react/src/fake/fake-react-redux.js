/**
 * @file custom react-redux
 * @author yuanxin
 */
import React, { Component } from 'react';

const createContext = () => {
  return React.createContext(null);
};

const ReduxContext = createContext();

/**
 * @class Provider外层组件，获取store
 */
export class Provider extends Component {
  render() {
    const store = this.props.store;
    return (<ReduxContext.Provider value={store}>
      {this.props.children}
    </ReduxContext.Provider>);
  }
}

/**
 * 连接器方法，接受映射方法，返回HOC
 * @param {Function} [mapStateToProps] - 映射store上的state到props
 * @param {Function} [mapDispatchToProps] - 映射store上的dispatch到props
 * @param {React.Component} [ConnectComponent] - 需要HOC装饰的组件
 * @return {React.Component} - 装饰后的方法
 */
export const connect = (mapStateToProps, mapDispatchToProps) => {
  return ConnectComponent => {
    return class extends Component {

      constructor(props) {
        super(props);
        this.state = {
          mergedProps: null
        };
      }

      componentDidMount() {
        const store = this.context;
        store.subscribe(() => {
          const mergedProps = this.computeProps(store);
          if (!mergedProps === this.state.mergedProps) {
            this.setState({ mergedProps });
          }
        });
      }

      static contextType = ReduxContext;

      computeProps(store) {
        const stateProps = mapStateToProps(store.getState());
        const eventProps = mapDispatchToProps((...args) => store.dispatch(...args));
        return { ...stateProps, ...eventProps };
      }

      render() {
        const mergedProps = this.state.mergedProps || this.computeProps(this.context);
        return (<ConnectComponent {...mergedProps} {...this.props} />);
      }
    };
  };
};
