import React from "react";
import ReactDOM from "react-dom";
import UserReview from "./UserReview";

it("test", () => {
  const div = document.createElement("div");
  ReactDOM.render(<UserReview />, div);
  ReactDOM.unmountComponentAtNode(div);
});
