import axios, { AxiosRequestConfig, isAxiosError } from 'axios';

class AxiosError {
  // public err: boolean = true;
  constructor(
    public status: number,
    public message: string,
    public data: any,
    public res: any
  ) {}
}
export async function customFetch<T = any>(
  path: string,
  options?: AxiosRequestConfig
) {
  const response = await axios<T>(path, {
    ...options,
    withCredentials: true,
    validateStatus: () => true,
  });

  const { status, statusText, data, ...res } = response;

  if (Math.floor(status / 100) !== 2) {
    console.log('customFetch error:', status);
    throw new AxiosError(status, statusText, data, res);
  }
  return response;
}
