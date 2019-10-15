import React, {Component} from 'react';
import {itemFy, click, beforeRender} from './decorator';

@itemFy
@click(true)
export default class Agriculture extends Component {

  static className = 'agriculture';

  @beforeRender(false)
  render() {
    return (
      <div>{'农业'}</div>
    );
  }
}
