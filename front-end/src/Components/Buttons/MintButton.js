import React from 'react'
import { useHistory } from "react-router";

export const MintButton = () => {
  const history = useHistory();

    return (
        <div className="fixed left-8 top-64">
            <button
            onClick={()=>history.push("/MyAssets/Mint")}
            className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
          >
            Mint
          </button>
        </div>
    )
}
