import React from "react";
import { Image } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/user";
import { useMessageDispatch, useMessageState } from "../context/message";

export const User = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      dispatch({
        type: "SET_USERS",
        payload: data.getUsers,
      });
    },
    onError: (error) => console.log(error),
  });

  if (!users || loading) {
    return <p>Loading...</p>;
  } else if (users.length === 0) {
    return <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    return (
      <React.Fragment>
        {users.map((user) => {
          const selected = selectedUser === user.username;

          return (
            <div
              key={user.username}
              className={`d-flex p-3 user__button ${selected && "bg-white"}`}
              role="button"
              onClick={() =>
                dispatch({ type: "SET_SELECTED_USER", payload: user.username })
              }
            >
              <Image
                src={user.image_url}
                roundedCircle
                className="mr-2"
                style={{ width: 50, height: 50, objectFit: "cover" }}
              />
              <div>
                <p className="text-success">{user.username}</p>
                <div className="font-weight-light">
                  {user.latestMessage
                    ? user.latestMessage.content
                    : "You are now connected"}
                </div>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
};
