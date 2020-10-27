import React, { useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FormInputMessage } from "../components/FormInputMessage";
import { Message } from "../components/Message";
import { User } from "../components/User";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { useMessageDispatch, useMessageState } from "../context/message";
import { NEW_MESSAGE, NEW_REACTION } from "../graphql/message";

export const Home = (props) => {
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const messagedispatch = useMessageDispatch();

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );

  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messagedispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageData, messageError]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);
    if (reactionData) {
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;

      messagedispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionData, reactionError]);

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
        <Col xs={10} md={8} className="p-0">
          <div className="messages__box d-flex flex-column-reverse p-3">
            <Message />
          </div>
          <FormInputMessage />
        </Col>
      </Row>
    </React.Fragment>
  );
};
