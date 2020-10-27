import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import moment from "moment";
import { ReactButton } from "./ReactButton";
import { useAuthState } from "../context/auth";

export const Chat = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const reactions = [
    ...new Set(message.reactions?.map((reaction) => reaction.content)),
  ];

  return (
    <div className={`d-flex my-3 ${sent ? "ml-auto" : "mr-auto"}`}>
      {sent && <ReactButton sent message={message} />}
      <OverlayTrigger
        placement="bottom"
        transition={false}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
      >
        <div
          className={`py-2 px-3 rounded-pill position-relative ${
            sent ? "bg-primary" : "bg-secondary"
          }`}
        >
          {message.reactions?.length > 0 && (
            <div className="bg-secondary p-1 rounded-pill chat__reactionsBox">
              {reactions} {message.reactions.length}
            </div>
          )}
          <p className={sent ? "text-white" : ""}>{message.content}</p>
        </div>
      </OverlayTrigger>
      {!sent && <ReactButton sent message={message} />}
    </div>
  );
};
