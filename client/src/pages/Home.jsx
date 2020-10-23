import React, { useState, useEffect } from "react";
import { Row, Button, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/user";
import { GET_MESSAGES } from "../graphql/message";
import { useAuthDispatch } from "../context/auth";

export const Home = (props) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useAuthDispatch();
  const { loading, data, error } = useQuery(GET_USERS);

  const [
    getMessages,
    { loading: messageLoading, data: messages },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  if (messages) {
    console.log(messages);
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
      <div
        key={user.username}
        className="d-flex p-3"
        style={{ cursor: "pointer" }}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src={user.image_url}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div>
          <p className="text-success">{user.username}</p>
          <div className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected"}
          </div>
        </div>
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
        <Col xs={4} className="p-0 bg-secondary">
          {usersMarkup}
        </Col>
        <Col xs={8}>
          {messages && messages.getMessages.length > 0 ? (
            messages.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <p>You are not connected</p>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};
