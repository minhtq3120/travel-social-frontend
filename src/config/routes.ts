import LayoutComponent from 'src/pages/Layout/layout';
import Login from 'src/pages/Login/Login';
import PoolManagement from 'src/pages/PoolManagement/PoolManagement';
import Signup from 'src/pages/Signup/Signup';

export const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path: '/home',
    component: LayoutComponent,
  }
];
