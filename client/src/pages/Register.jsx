import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { REGISTER_USER } from "../graphql/authentication";

export const Register = (props) => {
  const [variables, setVariables] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: () => props.history.push("/login"),
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const onRegister = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };

  const { username, email, password, confirmPassword } = variables;

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
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
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email"}
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              className={errors.email && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
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

          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Confirm Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit" block disabled={loading}>
            {loading ? "Loading..." : "REGISTER"}
          </Button>
          <small>
            Already have an account? <Link to="/login">Login here</Link>
          </small>
        </Form>
      </Col>
    </Row>
  );
};
