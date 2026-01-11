/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export const fetchGet = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  const { data } = await api.get<ApiResponse<T>>(url, { params });
  return data;
};

export const fetchPost = async <T>(
  url: string,
  body: any,
  options?: { isMultipart?: boolean; headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  const headers = { ...options?.headers };
  if (options?.isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const { data } = await api.post<ApiResponse<T>>(url, body, { headers });
  return data;
};

export const fetchPut = async <T>(
  url: string,
  body: any,
  options?: { isMultipart?: boolean; headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  const headers = { ...options?.headers };
  if (options?.isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const { data } = await api.put<ApiResponse<T>>(url, body, { headers });
  return data;
};

export const fetchPatch = async <T>(
  url: string,
  body: any,
  options?: { isMultipart?: boolean; headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  const headers = { ...options?.headers };
  if (options?.isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const { data } = await api.patch<ApiResponse<T>>(url, body, { headers });
  return data;
};

export const fetchDelete = async <T>(
  url: string,
  body?: any,
  options?: { isMultipart?: boolean; headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  const headers = { ...options?.headers };

  // Axios delete accepts 'data' in config for body
  const { data } = await api.delete<ApiResponse<T>>(url, {
    headers,
    data: body,
  });
  return data;
};
