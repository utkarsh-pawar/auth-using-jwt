import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/userContext";

const AuthOptions = () => {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <button className="btn btn-primary mr-2" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <button className="btn btn-primary mr-2" onClick={register}>
            Sign up
          </button>
          <button className="btn btn-primary mr-2" onClick={login}>
            LogIn
          </button>
        </>
      )}
    </nav>
  );
};

export default AuthOptions;
