import React, { Component } from 'react';
import { connect } from '../my-react-redux'
// import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom';

class Content extends Component {
  render() {
    return (<div>渲染内容如下:</div>);
  }
}

const ContentView = connect(
  state => {
    return {
      list: state.list
    };
  }
)(Content);

// const ContentView = connect(
//   state => {
//     return {
//       list: state.list
//     };
//   }
// )(Content);

export default class Detail extends Component {
  render() {
    return (
      <div>
        <ContentView />
        {/* <Link to={"/detail/1234" + Math.random() * 10}>跳转内容</Link> */}
        <div>详情页，我的id是：{this.props.match.params.id}</div>
      </div>
    );
  }
}
