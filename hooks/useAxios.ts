"use client";

import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

const baseURL = "http://localhost:5000/api"; // change to your API URL

// generic return type
type ApiResponse<T> = T | null;

export default function useAxios() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // common request function
  const request = async <T, D = unknown>(
    method: "get" | "post" | "patch" | "delete",
    endpoint: string,
    data?: D,
    config: AxiosRequestConfig<D> = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.request<T, any, D>({
        method,
        url: `${baseURL}${endpoint}`,
        data,
        ...config,
      });
      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || axiosErr.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // specific methods
  const get = <T>(endpoint: string, config: AxiosRequestConfig = {}) =>
    request<T>("get", endpoint, undefined, config);

  const post = <T, D = unknown>(endpoint: string, data: D, config: AxiosRequestConfig<D> = {}) =>
    request<T, D>("post", endpoint, data, config);

  const patch = <T, D = unknown>(endpoint: string, data: D, config: AxiosRequestConfig<D> = {}) =>
    request<T, D>("patch", endpoint, data, config);

  const del = <T>(endpoint: string, config: AxiosRequestConfig = {}) =>
    request<T>("delete", endpoint, undefined, config);

  return { get, post, patch, del, loading, error };
}
