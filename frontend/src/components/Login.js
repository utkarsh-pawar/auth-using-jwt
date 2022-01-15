import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/userContext";
import ErrorNotice from "./ErrorNotice";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const { setUserData } = useContext(UserContext);

  const history = useHistory();
  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post(
        "http://localhost:5000/users/login",
        loginUser
      );

      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });

      localStorage.setItem("auth-token", loginResponse.data.token);

      history.push("/");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <label>Email: </label>
        <input
          type="email"
          id="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label>Password: </label>
        <input
          type="password"
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
