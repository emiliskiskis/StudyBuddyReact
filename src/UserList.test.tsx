import React from "react";
import ReactDOM from "react-dom";
import UserList from "./UserList";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";

it("App renders correnctly", () => {
  const renderee = renderer
    .create(<UserList onUserSelect={() => {}} />)
    .toJSON();
  expect(renderee).toMatchSnapshot();
});
