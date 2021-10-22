import React from "react";
import { useHistory } from "react-router";
import back from "../../img/Back.svg";
import back1 from "../../img/Back2.svg";
export const GoBack = (props) => {
  const history = useHistory();

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 1;
  };
  const work = () => {
    history.push(props.url);
    if (!isEmpty(props)) {
      props.change();
    }
  };
  return (
    <div className="fixed left-8 top-40">
      <svg
        viewBox="0 0 32 32"
        class="icon icon-chevron-left"
        aria-hidden="true"
        onClick={work}
        className="h-20 w-20 transform scale-90 transition ease-in duration-200 hover:scale-75 focus:outline-none"
      >
        <path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z" />
      </svg>
    </div>
  );
};
