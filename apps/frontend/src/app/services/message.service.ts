import { AxiosRequestConfig } from 'axios';
// import { ApiResponse } from '../models/api-response';
import { callExternalApi } from './external-api.service';

// const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const apiServerUrl = 'http://localhost:3000';

export const getPublicResource = async () => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/public`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data,
    error,
  };
};

export const getProtectedResource = async (accessToken: string) => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/healthcheck`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data,
    error,
  };
};

export const getAdminResource = async () => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/admin`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data,
    error,
  };
};
