import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useMessageState } from "../context/message";
import { SEND_MESSAGE } from "../graphql/message";

export const FormInputMessage = () => {
  const [content, setContent] = useState("");
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => console.log(error),
  });

  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent("");
  };

  return (
    <Form onSubmit={onSubmitMessage} className="px-3 py-2">
      <Form.Group className="d-flex align-items-center m-0">
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
  );
};
