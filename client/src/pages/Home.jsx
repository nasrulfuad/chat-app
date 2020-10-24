import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Message } from "../components/Message";
import { User } from "../components/User";
import { useAuthDispatch } from "../context/auth";
import { SEND_MESSAGE } from "../graphql/message";
import { useMessageState, useMessageDispatch } from "../context/message";

export const Home = (props) => {
  const [content, setContent] = useState("");
  const { users } = useMessageState();
  const authDispatch = useAuthDispatch();
  const messagedispatch = useMessageDispatch();
  const selectedUser = users?.find((user) => user.selected === true);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      messagedispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: selectedUser.username,
          message: data.sendMessage,
        },
      });
    },
    onError: (error) => console.log(error),
  });

  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent("");
  };

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
  };

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
        <Col xs={2} md={4} className="p-0 bg-secondary">
          <User />
        </Col>
        <Col xs={10} md={8}>
          <div className="messages__box d-flex flex-column-reverse">
            <Message />
          </div>
          <Form onSubmit={onSubmitMessage}>
            <Form.Group className="d-flex align-items-center">
              <Form.Control
                type="text"
                className="rounded-pill bg-secondary border-0 p-4 message__form__input"
                placeholder="Type message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <i
                className="fas fa-paper-plane fa-2x text-primary ml-3"
                role="button"
                onClick={onSubmitMessage}
              ></i>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
};
