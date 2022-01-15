import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../Auth/AuthOptions";

const Header = () => {
  return (
    <div>
      <header className="header">
        <Link to="/">
          <h1 className="title">MERN Authentication App</h1>
        </Link>
        <AuthOptions />
      </header>
    </div>
  );
};

export default Header;
