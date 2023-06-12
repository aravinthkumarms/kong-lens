/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
  PutRequest,
} from './types';

const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

const GET = async (request: GetRequest): Promise<AxiosResponse<any, any>> => {
  const result = await httpClient.get(request.url, request.headers);
  return result;
};

const POST = async (request: PostRequest): Promise<AxiosResponse<any, any>> => {
  const result = await httpClient.post(
    request.url,
    request.body,
    request.headers
  );
  return result;
};

const PUT = async (request: PutRequest): Promise<AxiosResponse<any, any>> => {
  const result = await httpClient.post(
    request.url,
    request.body,
    request.headers
  );
  return result;
};

const PATCH = async (
  request: PatchRequest
): Promise<AxiosResponse<any, any>> => {
  const result = await httpClient.patch(
    request.url,
    request.body,
    request.headers
  );
  return result;
};

const DELETE = async (
  request: DeleteRequest
): Promise<AxiosResponse<any, any>> => {
  const result = await httpClient.delete(request.url, request.headers);
  return result;
};

export { GET, POST, PUT, DELETE, PATCH };
