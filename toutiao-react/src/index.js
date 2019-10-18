import React, { Component, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { store, store_ssr } from './store';
// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from './my-react-redux';
// import { BrowserRouter } from './my-react-router';
import App from './app';

import './index.css';

const isSSREnabled = document.getElementById('app').hasChildNodes();
const render = isSSREnabled ? ReactDOM.hydrate : ReactDOM.render;
const _store = isSSREnabled ? store_ssr(window.__INITIAL_STATE__) : store;

console.log('isSSREnabled:::',  isSSREnabled);

render(
  <Provider store={_store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
