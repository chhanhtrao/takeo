import axios from 'axios';
import {HttpConfigType} from './Types';

export default class Http {
  public static readonly GET: string = 'GET';
  public static readonly POST: string = 'POST';
  public static readonly PUT: string = 'PUT';
  public static readonly PATCH: string = 'PATCH';
  public static readonly DELETE: string = 'DELETE';

  public static defaultConfig: any = {};

  private client: any;
  private config: any;

  constructor(config?: {config?: HttpConfigType; extraConfig?: any}) {
    this.config = {
      ...Http.defaultConfig,
      ...config?.config,
      ...config?.extraConfig,
    };
    this.client = this.createClient(this.config);
  }

  public static parseUri = (uri: string, context: any = {}) => {
    let parsedUri = uri;
    for (let key in context) {
      parsedUri = parsedUri.replace(`{${key}}`, context[key]);
    }
    return parsedUri;
  };

  private createClient(options: any) {
    return axios.create(options);
  }

  private toURLParams(params: any): string {
    const queryString = new URLSearchParams(params).toString();
    return queryString;
  }

  public request(config?: any): Promise<number> {
    let params = config?.params || {};
    if (Object.keys(params).length > 0) {
      const urlParams: string = this.toURLParams(params);
      config.url = `${config.url}${
        config.url.indexOf('?') < 0 ? '?' : '&'
      }${urlParams}`;
    }

    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await this.client.request({
          ...this.config,
          ...config,
        });
        resolve(response);
        console.info(
          `${config.method} ${response.status} "${
            config.url.indexOf('://') < 0
              ? config?.baseURL || this.config?.baseURL || ''
              : ''
          }${config.url}"`,
        );
      } catch (err) {
        reject(err);
        console.error(
          `${config.method} ${err.response.status} "${
            config.url.indexOf('://') < 0
              ? config?.baseURL || this.config?.baseURL || ''
              : ''
          }${config.url}"`,
        );
      }
    });
  }

  public get(options: any = {}): Promise<number> {
    return this.request({
      ...options,
      method: Http.GET,
    });
  }

  public post(options: any = {}) {
    return this.request({
      method: Http.POST,
      ...options,
    });
  }

  public put(options: any = {}) {
    return this.request({
      method: Http.PUT,
      ...options,
    });
  }

  public patch(options: any = {}) {
    return this.request({
      method: Http.PATCH,
      ...options,
    });
  }

  public delete(options: any = {}) {
    return this.request({
      method: Http.DELETE,
      ...options,
    });
  }
}
