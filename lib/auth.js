import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Router, { useRouter } from "next/router";
import axios from "axios"; //We use axios for http requests
import qs from "querystring";

export const restreamUrl = `https://api.restream.io/login?response_type=code&client_id=${process.env.NEXT_PUBLIC_RESTREAM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_RESTREAM_REDIRECT_URI}&state=${process.env.NEXT_PUBLIC_RESTREAM_RANDOM_OPAQUE_TOKEN}`;

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { pathname, events } = useRouter();
  const [token, setToken] = useState(null);

  //Effects Effects
  //We check the user's auth, every time the route changes.../// we check the route access, every time user changes.
  useEffect(() => {
    loadUserFromCookies();
  }, [pathname]);

  //Loads user from strapi API, using stored cookie token
  const loadUserFromCookies = async () => {
    const cookie = Cookies.get(); // grab token value from cookie
    if (Object.keys(cookie).length === 0) {
      setToken(null);
    } else {
      const token = JSON.parse(cookie.token);
      setToken(token);
      //TODO: check expiration here, for renewal
    }
  };

  //Logouts user
  const logout = async () => {
    delete window.__user;
    window.localStorage.setItem("logout", Date.now()); // sync logout between multiple windows
    Cookies.remove("token"); //remove token and user cookie
    setToken(null);
    localStorage.setItem("questions", []);
    Router.push("/"); //redirect to the home page
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
