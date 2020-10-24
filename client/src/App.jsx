import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { ApolloProvider } from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import { pages } from "./constants/pages";
import { DynamicRoute } from "./utils/DynamicRoute";
import "./App.scss";

export const App = () => {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <Router>
            <Container className="pt-5">
              <Switch>
                {pages.map((page, index) => (
                  <DynamicRoute {...page} key={index} />
                ))}
              </Switch>
            </Container>
          </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};
