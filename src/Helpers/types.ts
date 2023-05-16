export type GetRequest = {
  headers?: Record<string, unknown>;
  url: string;
};

export type PostRequest = {
  headers?: Record<string, unknown>;
  url: string;
  body: Record<string, unknown>;
};

export type PutRequest = {
  headers?: Record<string, unknown>;
  url: string;
  body: Record<string, unknown>;
};

export type DeleteRequest = {
  headers?: Record<string, unknown>;
  url: string;
  body?: Record<string, unknown>;
};

export type PatchRequest = {
  headers?: Record<string, unknown>;
  url: string;
  body: Record<string, unknown>;
};
