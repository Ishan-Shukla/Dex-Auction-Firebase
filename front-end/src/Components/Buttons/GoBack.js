import React from "react";
import { useHistory } from "react-router";
import leftArrow from "../../img/leftArrow.svg";

export const GoBack = () => {
  const history = useHistory();

  return (
    <div className="fixed left-8 top-40">
      <button
        onClick={() => history.goBack()}
        className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
      >
        Back
      </button>
    </div>
  );
};

// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   width="20"
//   height="20"
//   fill="currentColor"
//   class="bi bi-arrow-left"
//   viewBox="10 10 "
// >
//   <path
//     fill-rule="evenodd"
//     d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
//   />
// </svg>
