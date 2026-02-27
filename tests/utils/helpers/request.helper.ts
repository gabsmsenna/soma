export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

export function createMockRequest(
  url: string,
  options: RequestOptions = {},
): Request {
  const { method = "GET", headers = {}, body } = options;

  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return new Request(url, requestInit);
}

export function createMockResponse(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function extractPathParams(
  path: string,
  template: string,
): Record<string, string> {
  const pathParts = path.split("/").filter(Boolean);
  const templateParts = template.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  for (let i = 0; i < templateParts.length; i++) {
    if (templateParts[i].startsWith("[") && templateParts[i].endsWith("]")) {
      const paramName = templateParts[i].slice(1, -1);
      params[paramName] = pathParts[i];
    }
  }

  return params;
}
