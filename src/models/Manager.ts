import {ResultSet} from './ResultSet';
import {Http} from '../request';

export class Manager {
  public static defaultClass = Manager;
  public model: any;

  constructor(model: any) {
    this.model = model;
    this.transformResponseToList = this.transformResponseToList.bind(this);
    this.transformResponseToObject = this.transformResponseToObject.bind(this);
  }

  protected transformResponseToList(responseData: any) {
    let results: any[] = [];
    try {
      const data = JSON.parse(responseData);
      if (Array.isArray(data) === true) {
        return ResultSet.defaultClass.getInstance(data, this.model, data);
      }

      for (let key in data || {}) {
        results = data[key];
        if (Array.isArray(results) === true) {
          results = ResultSet.defaultClass.getInstance(
            results,
            this.model,
            data,
          );
          break;
        }
      }
      return results;
    } catch (error) {
      console.error(error);
      return responseData;
    }
  }

  protected transformResponseToObject(responseData: any) {
    try {
      return JSON.parse(responseData);
    } catch (error) {
      console.error(error);
      return responseData;
    }
  }

  protected getResourceURL() {
    return (
      this.model?.getResourceURL() || `/${this.model?.name.toLowerCase()}s/`
    );
  }

  public create(data: object, httpConfig: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.post({
          url: this.getResourceURL(),
          data,
          ...httpConfig,
        });
        const responseData: any = new this.model({
          ...response.data,
        });
        resolve(responseData);
      } catch (err) {
        reject(err);
      }
    });
  }

  public update(data: any, httpConfig: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.put({
          url: `${this.getResourceURL()}${data.id}`,
          data,
          ...httpConfig,
        });
        const responseData: any = new this.model({
          ...response.data,
        });
        resolve(responseData);
      } catch (err) {
        reject(err);
      }
    });
  }

  public delete(data: {id: any}, httpConfig: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.delete({
          url: `${this.getResourceURL()}${data.id}`,
          ...httpConfig,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  public get(params: any, httpConfig: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.get({
          url: `${this.getResourceURL()}${params.id}`,
          ...httpConfig,
          transformResponse: this.transformResponseToObject,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  public filter(params: any = {}, httpConfig: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.get({
          url: this.getResourceURL(),
          params,
          ...httpConfig,
          transformResponse: this.transformResponseToList,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  public count(params: any = {}, httpConfig: any = {}): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const http: Http = new Http();
        const response: any = await http.get({
          url: `${this.getResourceURL()}count/`,
          params,
          ...httpConfig,
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  }
}
