import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import { useAuthState } from "../context/auth";

export const Chat = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;

  return (
    <OverlayTrigger
      placement="bottom"
      transition={false}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
    >
      <div className={`d-flex my-3 ${sent ? "ml-auto" : "mr-auto"}`}>
        <div
          className={`py-2 px-3 rounded-pill ${
            sent ? "bg-primary" : "bg-secondary"
          }`}
        >
          <p className={sent ? "text-white" : ""}>{message.content}</p>
        </div>
      </div>
    </OverlayTrigger>
  );
};
