import axios, { AxiosResponse } from 'axios';
import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
  PutRequest,
} from './types';

const GET = async (request: GetRequest): Promise<AxiosResponse<any, any>> => {
  const result = await axios.get(request.url, request.headers);
  return result;
};

const POST = async (request: PostRequest): Promise<AxiosResponse<any, any>> => {
  const result = await axios.post(request.url, request.body, request.headers);
  return result;
};

const PUT = async (request: PutRequest): Promise<AxiosResponse<any, any>> => {
  const result = await axios.post(request.url, request.body, request.headers);
  return result;
};

const PATCH = async (
  request: PatchRequest
): Promise<AxiosResponse<any, any>> => {
  const result = await axios.patch(request.url, request.body, request.headers);
  return result;
};

const DELETE = async (
  request: DeleteRequest
): Promise<AxiosResponse<any, any>> => {
  const result = await axios.delete(request.url, request.headers);
  return result;
};

export { GET, POST, PUT, DELETE, PATCH };
