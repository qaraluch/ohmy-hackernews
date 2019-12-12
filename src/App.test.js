import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Niedokończone - patrz rozdział 3
//TODO: Add to tiljs!
it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
