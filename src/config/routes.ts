import Watch from 'src/components/Watch/Watch';
import ActiveAccount from 'src/pages/ActiveAccount/ActiveAccount';
import LayoutComponent from 'src/pages/Layout/layout';
import Login from 'src/pages/Login/Login';
import Profile from 'src/pages/Profile/Profile';
import ResetPassword from 'src/pages/ResetPassword/Reset';
import ResetPasswordPage from 'src/pages/ResetPasswordPage/ResetPasswordPage';
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
  },
  {
    path: '/profile',
    component: LayoutComponent
  },
  {
    path: '/account',
    component: LayoutComponent
  },
  {
    path: "/activeAccount/:code",
    component: ActiveAccount
  },
  {
    path: "/resetpassword",
    component: ResetPassword
  },
  {
    path: "/reset",
    component: ResetPasswordPage
  },
  {
    path: "/watchs",
    component: LayoutComponent
  },
  {
    path: "/chats",
    component: LayoutComponent
  },
  {
    path: "/suggestion",
    component: LayoutComponent
  },
  {
    path: "/suggestionDetail",
    component: LayoutComponent
  },
  {
    path: "/hashtagDetail",
    component: LayoutComponent
  },
  {
    path: "/searchDetail",
    component: LayoutComponent
  },
  {
    path: "/postDetail",
    component: LayoutComponent
  },
  {
    path: "/staking",
    component: LayoutComponent
  },
];
