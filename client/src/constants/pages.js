import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";

export const pages = [
  {
    guest: true,
    path: "/register",
    component: Register,
  },
  {
    guest: true,
    path: "/login",
    component: Login,
  },
  {
    exact: true,
    authenticated: true,
    path: "/",
    component: Home,
  },
];
