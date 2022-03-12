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
  const dispatch = useDispatch();
  // const visibleWrongNetwork = useSelector((state: any) => state.wallet.modalWrongNetwork);
  // console.log(visibleWrongNetwork)
  
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
      {/* <Modal
        title="Wrong Network"
        visible={visibleWrongNetwork}
        className="login-modal-style"
        footer={[]}>
        <span>Please connect to the appropriate Ethereum network and Sign in again.</span>
      </Modal> */}
    </div>
  );
}

export default App;
