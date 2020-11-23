import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { OverlayTrigger, Button, Popover } from "react-bootstrap";
import { REACT_TO_MESSAGE } from "../graphql/message";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

export const ReactButton = ({ message }) => {
  const [show, setShow] = useState(false);

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onCompleted: (data) => {
      setShow(false);
      console.log(data);
    },
    onError: (error) => console.log(error),
  });

  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={show}
      onToggle={setShow}
      transition={false}
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="reactButton__popoverBox d-flex align-items-center px-0 py-1">
            {reactions.map((reaction) => (
              <Button
                key={reaction}
                variant="link"
                className="reactIcon__button reactButton"
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2 reactButton">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );
};
