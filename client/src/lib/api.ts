import API from "../config/apiClient";
import queryClient from "../config/queryClient";
import type { LoginResponse, SignInData } from "../types/LoginResponse";
import { navigate } from "./navigation";
import { storage } from "../constants/storage";

// -- FUNCTIONS FOR MAKING API REQUESTS --
export const login = async (data: SignInData): Promise<LoginResponse> => 
  API.post("/auth/login", data);

export const getUser = async () => {
  const token = storage.get('ACCESS_TOKEN');

  const response = await API("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const logout = async () => {
  const token = storage.get('REFRESH_TOKEN');
  const res = await API.get("/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Ends session by removing tokens from browser
  storage.remove('ACCESS_TOKEN');
  storage.remove('REFRESH_TOKEN');

  // Redirects user to login page
  navigate("/login", { state: { redirectUrl: window.location.pathname } });
  queryClient.clear();

  return res;
};
