import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN_USER } from "../graphql/authentication";
import { useAuthDispatch } from "../context/auth";

export const Login = (props) => {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({
        type: "LOGIN",
        payload: data.login,
      });
      // props.history.push("/");
    },
  });

  const onRegister = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  const { username, password } = variables;

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={onRegister}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              value={username}
              className={errors.username && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              className={errors.password && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit" block disabled={loading}>
            {loading ? "Loading..." : "LOGIN"}
          </Button>
          <small>
            Don't have an account? <Link to="/register">Register here</Link>
          </small>
        </Form>
      </Col>
    </Row>
  );
};
