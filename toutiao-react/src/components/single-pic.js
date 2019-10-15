import React, {Component} from 'react';
import {itemFy} from './decorator';

@itemFy
export default class SinglePic extends Component {

  static className = 'single-pic';

  render() {
    const {title, imageList} = this.props.data;
    return (
      <React.Fragment>
        <div>{title}</div>
        <img src={imageList[0]}/>
      </React.Fragment>
    );
  }
}
