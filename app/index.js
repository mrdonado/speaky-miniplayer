import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

let initialState;

// Try to recover the last state when starting up
try {
  initialState = JSON.parse(localStorage.getItem('store'));
} catch {
  console.warn("The initial state couldn't be parsed");
}

const store = initialState ? configureStore(initialState) : configureStore();

// Persist the store on every update
store.subscribe(() => {
  localStorage.setItem('store', JSON.stringify(store.getState()));
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
