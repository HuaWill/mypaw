import React, { Component, lazy, Suspense } from 'react';
import List from "./list";
import * as Components from "./components";
// import { connect } from 'react-redux';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from './my-react-redux';
// import { Route, Link, Switch } from './my-react-router';
import Detail from './detail';
import Login from './login';

const Settings = lazy(() => {
  // import return的只不过是一个promise，自己甚至可以通过ajax call来异步请求一个组件
  return import("./components/settings").then(comp => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(comp);  // using default export
      }, 1000);
    })
  });
});

// 创建有默认值的context, 当context.consumer外层没有context.provider提供value时，
// 此默认值生效。不然以context.provider提供的value为准
export const MyColorContext = React.createContext({
  color: 'red'
});

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSetting: false
      // list: []
    }
    // store.subscribe(() => {
    //   this.setState({list: store.getState().list});
    // })
  }

  getList() {
    return fetch("http://localhost:9000/list")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        } else {
          return {
            type: 'PUSH_LIST',
            data: data.data
          }
        }
      })
      .catch(error => {
        this.props.history.push('/login');
        return {
          type: 'LOGIN_ERROR',
          data: error
        }
      });
  }

  showSetting = () => {
    this.setState({
      showSetting: true
    });
  }

  componentDidMount() {
    if (!this.props.list || this.props.list.length === 0) {
      this.props.updateList(this.getList.bind(this));
    }
  }

  componentWillUnmount() {
    console.log('Main unmounted');
  }

  render() {
    return (
      <MyColorContext.Provider value={{ color: 'blue' }}>
        <div className="container">
          {
            this.state.showSetting
              ?
              <Suspense fallback={<h1>Loading ...</h1>}>
                <Settings />
              </Suspense>
              :
              <React.Fragment>
                <div className="app-header">
                  <button id="setting-btn" onClick={this.showSetting}>设置</button>
                  <button id="dispatch-btn" onClick={() => { this.props.updateList(this.getList.bind(this)) }}>更多</button>
                  <Link id="login-btn" to="/login">登录</Link>
                  &nbsp;&nbsp;<Link to="/detail/111">详情页1</Link>
                  &nbsp;&nbsp;<Link to="/detail/222">详情页2</Link>
                </div>
                <div className="app-content">
                  <List
                    dataSource={this.props.list}
                    renderItem={(item, idx) => {
                      const type = item.type.replace(/^\w/, code => code.toUpperCase());
                      const ItemComponent = Components[type];
                      return ItemComponent ? <ItemComponent key={idx} {...item} onClick={() => { console.log('跳转'); }} /> : null;
                    }}
                  />
                </div>
              </React.Fragment>
          }
        </div>
      </MyColorContext.Provider>
    )
  }
}

const App = connect(
  function mapStateToProps(state) {
    return {
      list: state.list
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      updateList: (task) => task && dispatch(task())
    };
  }
)(Main);

export default class extends Component {
  render() {
    const NoMatch = () => {
      return <div>我是404</div>;
    }
  
    return (
      <Switch>
        <Route path="/home" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/detail/:id" component={Detail} />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}
