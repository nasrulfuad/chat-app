import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";
import { Register } from "./pages/register";

export const App = () => {
  return (
    <Container className="pt-5">
      <Register />
    </Container>
  );
};
