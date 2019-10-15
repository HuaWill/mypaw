import React, {Component} from 'react';

export default class List extends Component {
  render() {
    const {dataSource = [], renderItem} = this.props;
    return (
      <React.Fragment>
        { dataSource.map(renderItem) }
      </React.Fragment>
    );
  }
}