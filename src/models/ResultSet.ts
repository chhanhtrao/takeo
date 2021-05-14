export class ResultSet<T> extends Array<T> {
  public static defaultClass: any = ResultSet;
  protected __responseData__: any;

  public static getInstance(data: any[], model: any = null, rawData?: any) {
    let instance = new ResultSet.defaultClass();
    if (model !== null) {
      data.map((item: any) => {
        instance.push(new model(item));
      });
    }

    instance.setResponseData(rawData);
    return instance;
  }

  public toJSON: () => any = () => {
    const retVal: any[] = this.map((item: any) => {
      return item.json;
    });
    return retVal;
  };

  public setResponseData: (data: any) => void = (data: any) => {
    this.__responseData__ = data;
  };

  public toString: () => string = () => {
    return 'ResultSet Object';
  };
}
