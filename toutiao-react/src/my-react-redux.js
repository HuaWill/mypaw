import React from 'react';

const createContext = () => {
  return React.createContext({store: null});
}

const ReduxContext = createContext();

export class Provider extends React.Component {
  render() {
    const store = this.props.store;
    return (
      <ReduxContext.Provider value={{store}}>
        {this.props.children}
      </ReduxContext.Provider>
    );
  }
}

export const connect = (mapStateToProps, mapDispatchToProps) => (ComponentToBeConnected) => {
  return class extends React.Component {

    static contextType = ReduxContext;

    constructor(props) {
      super(props);
      this.state = {
        mergedProps: {}
      }
    }
    
    componentDidMount() {
      const {store} = this.context;
      store.subscribe(() => {
        const mergedProps = this.computeProps(store);
        this.setState({mergedProps});
      });
    }

    computeProps(store) {
      const stateProps = mapStateToProps(store.getState());
      const eventProps = mapDispatchToProps && mapDispatchToProps((...args) => store.dispatch(...args)) || {};
      // const eventProps = mapDispatchToProps(store.dispatch);
      return {...stateProps, ...eventProps};
    }

    render() { 
      console.log('i got ：：：', this.context);
      const mergedProps = {...this.props, ...this.computeProps(this.context.store)};
      return <ComponentToBeConnected {...mergedProps} />
    }
  }
}