import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";

export const pages = [
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/",
    component: Home,
  },
];
