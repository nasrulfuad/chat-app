import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
      reactions {
        uuid
        content
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
    }
  }
`;

export const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
      content
      user {
        username
        image_url
        createdAt
      }
      message {
        uuid
        from
        to
        content
      }
    }
  }
`;

export const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`;
