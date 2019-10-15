import React, {Component} from 'react';
import {itemFy} from './decorator';
import {MyColorContext} from '../index';

@itemFy
export default class Settings extends Component {

  static className = 'settings-page';

  static SETTINGS = ["视频", "农业", "热点", "社会", "娱乐"];

  // 可以定义 contextType 后直接使用 this.context
  // 或者通过 context.consumer 获取context
  // static contextType = MyColorContext;

  render() {
    // const color = this.context.color;
    return (
      <React.Fragment>
        <MyColorContext.Consumer>
          {
            context => (
              <ul style={{color: context.color}}>
                {
                  Settings.SETTINGS.map((item, idx) => {
                    return <li key={idx}>{item}</li>
                  })
                }
              </ul>
            )
          }
        </MyColorContext.Consumer>
      </React.Fragment>
    );
  }
}