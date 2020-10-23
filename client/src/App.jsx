import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "./ApolloProvider";
import { pages } from "./constants/pages";
import "./App.scss";

export const App = () => {
  return (
    <ApolloProvider>
      <Router>
        <Container className="pt-5">
          <Switch>
            {pages.map((page, index) => (
              <Route {...page} key={index} />
            ))}
          </Switch>
        </Container>
      </Router>
    </ApolloProvider>
  );
};
