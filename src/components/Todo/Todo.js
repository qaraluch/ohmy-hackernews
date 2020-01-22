import React from "react";

const Todo = () => (
  <div>
    TODO:
    <ul>
      <li>- add clicable logo</li>
      <li>- add query string</li>
      <li>
        - use awsomefonts arrows for sort - [React | Font
        Awesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react)
      </li>
      <li>
        - add dateRange and popularity -
        ?dateRange=pastMonth&page=0&prefix=false&query=javascript&sort=byPopularity&type=story
      </li>
      <li> - add material-ui</li>
      <li> - implement different pressets</li>
    </ul>
  </div>
);

//TODO: HN icon
// <HNIcon />
// function HNIcon() {
//   return (
//     <div>
//       <img src="page/hackernews-icon.svg" alt="" />
//     </div>
//   );
// }
// import { ReactComponent as HNIcon } from "../page/hackernews-icon.svg";
// [tanem/react-svg: A React component that injects SVG into the DOM.](https://github.com/tanem/react-svg)
// svg part [CSS { In Real Life } | A Modern Front End Workflow Part 2: Module Bundling with Parcel](https://css-irl.info/a-modern-front-end-workflow-part-2/)

export default Todo;
