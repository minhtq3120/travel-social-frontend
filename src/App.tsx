import { Modal } from 'antd';
import { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from 'src/components/privateRoute/PrivateRoute';
import { routes } from 'src/config/routes';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux'

const RouteWithSubRoutes = (route: any) => {
  return (
    <PrivateRoute
      path={route.path}
      component={route.component}
      render={(props: any) => <route.component {...props} routes={route.routes} />}
    />
  );
};

function App() {

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/home"></Redirect>
        </Route>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </div>
  );
}

export default App;
