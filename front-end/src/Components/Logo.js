import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../img/Logo.svg";

function Logo() {
    return (
        <Link to="/">
          <img className="h-10 w-auto sm:h-10" src={logo} alt="Logo" />
        </Link>
    )
}

export default Logo
