import React from "react";
import { Row, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/user";
import { useAuthDispatch } from "../context/auth";

export const Home = (props) => {
  const dispatch = useAuthDispatch();

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    props.history.push("/login");
  };

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading...</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div key={user.username}>
        <p>{user.username}</p>
      </div>
    ));
  }

  return (
    <React.Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Col xs={4}>{usersMarkup}</Col>
        <Col xs={8}>
          <p>Messages</p>
        </Col>
      </Row>
    </React.Fragment>
  );
};
