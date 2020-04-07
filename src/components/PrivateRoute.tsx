import React, { FunctionComponent, ComponentClass } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { User } from "../api";

type ComponentProps = {
  user?: User;
  token: string;
};

type Props = {
  component: FunctionComponent<ComponentProps> | ComponentClass<ComponentProps>;
  isAuthenticated: boolean;
  token?: string;
  user?: User;
} & RouteProps;

function PrivateRoute({
  component,
  isAuthenticated,
  user,
  token,
  ...routeProps
}: Props) {
  console.log(isAuthenticated, !!user, !!token);
  if (isAuthenticated && !!token) {
    // if the user is authenticated, just render the component
    return (
      <Route
        {...routeProps}
        render={(props) =>
          React.createElement(component, { ...props, user, token })
        }
      />
    );
  } else {
    // otherwise redirect to the login page
    return (
      <Route
        {...routeProps}
        render={(props) => (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )}
      />
    );
  }
}

export default PrivateRoute;
