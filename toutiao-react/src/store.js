import { createStore, applyMiddleware, compose } from 'redux';

const initialState = {
  list: []
}

const reducer = (state, action) => {

  if (!state) {
    state = initialState;
  }

  if ('PUSH_LIST' === action.type) {
    return {
      ...state,
      list: state.list.concat(...action.data)
    }
  } else {
    return state;
  }
}

const __CLIENT__ = typeof window !== 'undefined';
const composeEnhancers = __CLIENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxPromise = ({ dispatch, getState }) => next => action => {
  if (action.then && typeof action.then === 'function') {
    return action.then(next);
  }
  return next(action);
}

const logMiddleware = ({ dispatch, getState }) => next => action => {
  console.log('store state:::', getState());
  let result = next(action);
  console.log('store state:::', getState());
  return result;
}

export const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxPromise, logMiddleware)));

export const store_ssr = (initData = { list: [] }) => {
  return createStore(reducer, initData, composeEnhancers(applyMiddleware(reduxPromise, logMiddleware)))
}
