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
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 252.5 155.42136"
        onClick={work}
        className="h-16 w-16 p-2 transform transition ease-in duration-200 hover:scale-90 focus:outline-none"
      >
        <polyline
          points="245.5 77.711 7 77.711 77.711 7 7 77.711 77.711 148.421"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="14"
        />
      </svg>
    </div>
  );
};
