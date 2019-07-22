import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import PlayerPage from './containers/PlayerPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.PLAYER} component={PlayerPage} />
    </Switch>
  </App>
);
