import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

//Skipped chapter!
//TODO: Test - Go over it again
//TODO: Add to tiljs!
it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
