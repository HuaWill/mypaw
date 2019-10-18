import React, { Component } from 'react';
import axios from 'axios'; 
// import { connect } from '../my-react-redux'
// import { connect } from 'react-redux'
// import { Link, withRouter } from 'react-router-dom';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.formData = {};
  }

  valueChange = (evt) => {
    this.formData[evt.target.name] = evt.target.value;
  }

  login = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    axios.post(`/login`, this.formData).then(res => {
      this.props.history.push('/home');
    });
  }

  render() {
    return (
      <form onSubmit={this.login} className="loginForm">
        <div>
          <span>用户名：</span>
          <input name="username" onChange={this.valueChange} />
        </div>
        <div>
          <span>密码：</span>
          <input name="password" onChange={this.valueChange} />
        </div>
        <button type="submit">登录</button>
      </form>
    );
  }
}
