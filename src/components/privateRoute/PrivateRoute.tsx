import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, path, ...rest }: any) => {
  const isAuthenticated = localStorage.getItem('accessToken') || false;
  const routeComponent = (props: any) => {
    // if (isAuthenticated && path === '/login') {
    //   return <Redirect to={{ pathname: '/' }} />;
    // } else 
    if (!isAuthenticated && path === '/home') {
      return <Redirect to={{ pathname: '/login' }} />;
    }
    // if (!isAuthenticated && path ==='home') {
    //   return <Redirect to={{ pathname: '/login' }} />;
    // } 
    return <Component {...props} />;
  };
  return <Route {...rest} render={routeComponent} />;
};

export default PrivateRoute;
