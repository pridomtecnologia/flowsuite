import { createContext, useEffect, useReducer, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

// GLOBAL CUSTOM COMPONENTS
import Loading from "app/components/MatxLoading";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const isValidToken = (accessToken) => {
  if (!accessToken) return false;

  try {
    const decodedToken = jwtDecode(accessToken);

    if (!decodedToken.exp) {
      return false;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decodedToken.exp < currentTime;

    if (isExpired) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, user, isAuthenticated, isInitialized: true };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, user, isAuthenticated: true };
    }
    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }
    case "REGISTER": {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }
    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT"
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = import.meta.env.VITE_API_FLOWSUITE;

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });

    window.location.href = "/session/signin";
  }, []);

  const logoutWithAlert = useCallback(() => {
    Swal.fire({
      title: "Sessão Expirada",
      text: "Sua sessão expirou por segurança. Redirecionando para login...",
      icon: "warning",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    setTimeout(() => {
      logout();
    }, 2500);
  }, [logout]);

  const checkTokenValidity = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !isValidToken(accessToken)) {
      logoutWithAlert();
    }
  }, [logoutWithAlert]);

  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response_autenticacao = await axios.post(`${api}user/login`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const user = {
      name: response_autenticacao.data.name,
      email: response_autenticacao.data.email,
      exp: response_autenticacao.data.exp,
      id_user: response_autenticacao.data.id_user,
      permissions: response_autenticacao.data.permissions
    };

    setSession(response_autenticacao.data.access_token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({ type: "LOGIN", payload: { user } });
  };

  const register = async (email, username, password) => {
    const { data } = await axios.post("/api/auth/register", { email, username, password });
    const { accessToken, user } = data;

    setSession(accessToken);
    dispatch({ type: "REGISTER", payload: { user } });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user: storedUser ? JSON.parse(storedUser) : null
            }
          });
        } else {
          if (accessToken) {
            logoutWithAlert();
          } else {
            setSession(null);
            localStorage.removeItem("user");
            dispatch({
              type: "INIT",
              payload: { isAuthenticated: false, user: null }
            });
          }
        }
      } catch (err) {
        setSession(null);
        localStorage.removeItem("user");
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null }
        });
      }
    })();
  }, [logoutWithAlert]);

  useEffect(() => {
    const interval = setInterval(checkTokenValidity, 600000);

    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutWithAlert();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logoutWithAlert]);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
