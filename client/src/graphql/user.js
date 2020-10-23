import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      image_url
      createdAt
      latestMessage {
        uuid
        from
        to
        content
      }
    }
  }
`;
