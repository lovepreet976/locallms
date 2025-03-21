import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './app/App';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={LoginPage} />
      {/* Add other routes for Dashboard, Admin, etc. */}
    </Switch>
  </Router>
);

export default Routes;
