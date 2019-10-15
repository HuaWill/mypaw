import React, {Component} from 'react';
import {itemFy} from './decorator';

@itemFy
export default class MultiplePic extends Component {

  static className = 'multiple-pic';

  render() {
    const {title, imageList} = this.props.data;
    return (
      <React.Fragment>
        <div>{title}</div>
        {
          imageList.map((imageSrc, idx) => {
            return <img key={idx} src={imageSrc}></img>
          })
        }
      </React.Fragment>
    );
  }
}
