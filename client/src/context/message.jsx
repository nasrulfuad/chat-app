import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let usersCopy, userIndex;
  const { username, message, messages, reaction } = action.payload;

  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "SET_USER_MESSAGES":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };

      return {
        ...state,
        users: usersCopy,
      };

    case "SET_SELECTED_USER":
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));

      return {
        ...state,
        users: usersCopy,
      };

    case "ADD_MESSAGE":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);

      message.reactions = [];

      let newUserMessage = {
        ...usersCopy[userIndex],
        messages: usersCopy[userIndex].messages
          ? [message, ...usersCopy[userIndex].messages]
          : null,
        latestMessage: message,
      };

      usersCopy[userIndex] = newUserMessage;
      return {
        ...state,
        users: usersCopy,
      };

    case "ADD_REACTION":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((user) => user.username === username);

      let userCopy = { ...usersCopy[userIndex] };
      const messageIndex = userCopy.messages.findIndex(
        (msg) => msg.uuid === reaction.message.uuid
      );

      if (messageIndex > -1) {
        let messagesCopy = [...userCopy.messages];
        let reactionsCopy = [...messagesCopy[messageIndex].reactions];
        const reactionIndex = reactionsCopy.findIndex(
          (react) => react.uuid === reaction.uuid
        );

        if (reactionIndex > -1) {
          /* If reaction exists then update */
          reactionsCopy[reactionIndex] = reaction;
        } else {
          /* Otherwise add new reaction */
          reactionsCopy = [...reactionsCopy, reaction];
        }

        messagesCopy[messageIndex] = {
          ...messagesCopy[messageIndex],
          reactions: reactionsCopy,
        };

        userCopy = {
          ...userCopy,
          messages: messagesCopy,
        };
        usersCopy[userIndex] = userCopy;
      }

      return {
        ...state,
        users: usersCopy,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};
