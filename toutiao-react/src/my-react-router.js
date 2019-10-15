import React, { Component } from 'react';

const RouterContext = React.createContext();

const matcher = (pathname = '', location = '') => {
  pathname = pathname.replace(':id', '(\\d+)');
  return (new RegExp(pathname)).exec(location.pathname);
};

const eventEmitter = {
  listeners: [],
  listen(cb) {
    this.listeners.push(cb);
  },
  notify(...args) {
    this.listeners.forEach(listener => listener(...args));
  }
}

const createLocation = (path, state) => {
  let pathInfo = /^([^\?]*?)(\?[^#]*?)?(\#.*?)?$/.exec(path);
  return {
    pathname: pathInfo[1],
    search: pathInfo[2],
    hash: pathInfo[3],
    state
  }
}

const getBrowserLocation = (state = {}) => {
  let window$location = window.location;
  let pathname = window$location.pathname;
  let search = window$location.search;
  let hash = window$location.hash;
  return createLocation(`${pathname}${search}${hash}`, state);
}

const createBrowserHistory = () => {

  // 用户点击浏览器前进、回退
  window.addEventListener('popstate', event => {
    // 有location变化
    let action = 'POP';
    let location = getBrowserLocation(event.state);
    setState({
      action,
      location
    });
  });

  const listen = (cb) => {
    eventEmitter.listen(cb);
  }

  const push = (path, state) => {
    let location = createLocation(path, state);

    window.history.pushState({
      state
    }, null, path);

    setState({
      action: 'PUSH',
      location
    });
  };

  const setState = (nextState) => {
    // Object.assign(history, nextState);
    eventEmitter.notify(nextState);
  }

  return {
    push,
    listen
  };
}

export class Router extends Component {

  constructor(props) {
    super(props);

    this.state = {
      action: '',
      location: getBrowserLocation()
    }

    props.history.listen(({ action, location }) => {
      this.setState({ action, location });
    });
  }

  render() {
    const contextValue = {
      history: this.props.history,
      location: this.state.location
    }

    return (
      <RouterContext.Provider value={contextValue}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export class BrowserRouter extends Component {

  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  render() {
    return (
      <Router history={this.history}>
        {this.props.children}
      </Router>
    );
  }
}

export class Route extends Component {

  static contextType = RouterContext;

  render() {
    let match = matcher(this.props.path, this.context.location);
    let Component = this.props.component; // or maybe render method
    let props = Object.assign({}, this.props, {
      match: { params: { id: match ? match[1] : undefined } }
    });

    return (
      match && <Component {...this.context} {...props} /> || null
    );
  }
}

export class Switch extends Component {

  static contextType = RouterContext;

  render() {
    const { location } = this.context;
    let match;
    let matchedRoute;

    React.Children.forEach(this.props.children, child => {
      match = matcher(child.props.path, location);
      // switcher 只 macth 第一个匹配的path，或最后一个没有 path 的 route
      if (!matchedRoute && (match || !child.props.path)) {
        matchedRoute = child;
      }
    })

    return matchedRoute ?
      React.cloneElement(matchedRoute) :
      null;
  }

}

export class Link extends Component {

  static contextType = RouterContext;

  onClick = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const { history } = this.context;
    history.push(this.props.to);
  }

  render() {
    return (
      <a onClick={this.onClick}>{this.props.children}</a>
    );
  }
}
