import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/message";
import { useMessageDispatch, useMessageState } from "../context/message";

export const Message = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const selectedUser = users?.find((user) => user.selected === true);
  const messages = selectedUser?.messages;
  console.log(messages);
  const [
    getMessages,
    { loading: messageLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  let chatMarkup;
  if (!messages && !messageLoading) {
    chatMarkup = <p>Select a friend</p>;
  } else if (messageLoading) {
    chatMarkup = <p>Loading...</p>;
  } else if (messages.length > 0) {
    chatMarkup = messages.map((message) => (
      <p key={message.uuid}>{message.content}</p>
    ));
  } else if (messages.lengt === 0) {
    chatMarkup = <p>You are now connected! send your first message</p>;
  } else {
    chatMarkup = <p>You are not connected</p>;
  }

  return <React.Fragment>{messagesData && chatMarkup}</React.Fragment>;
};
