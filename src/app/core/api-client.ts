import {error} from "@angular/compiler/src/util";

export class HttpOptions<T> {
  body: T | null = null;
  headers: any;
}

export enum WebRequestMethod {
  post = 'POST',
  get = 'GET',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE'
}

export class WebRequest<T> {
  url: string;
  method: WebRequestMethod;
  body: T | null = null;
  parameter?: Record<string, unknown> = {};

  constructor(url: string, method: WebRequestMethod) {
    this.url = url;
    this.method = method;
  }

}

export class EmptyDataException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ApiResponse {
  static getFirstItem<T>(response: WebResponse<T>): T {

    if (response.error) {
      throw response.error;
    }

    if (response.data.items.length === 0){
      throw new EmptyDataException('tried to get first element of empty data-array');
    }

    if (response.data.items.length > 0) {
      return response.data?.items[0];
    }
  }
}

export class WebResponse<T> {
  data: Data<T>;
  error: Error;
}

export interface Data<T> {
  items: Array<T>;
  count: number;
  type: string;
}

export interface Error {
  message: string;
}

