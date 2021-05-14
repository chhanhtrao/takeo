import {Manager} from './Manager';

export abstract class Model {
  protected static objects: Manager = new Manager(Model);
  protected static fields: string[] = [];
  protected abstract getManager(): any;

  private __initialData__: any;
  private __fields__: string[] = [];

  protected id?: number;

  constructor(data: any = {}) {
    this.__initialData__ = data;
  }

  public static getResourceURL(): any {
    return null;
  }

  public set fields(fields: string[]) {
    this.setData(this.__initialData__);
    this.__fields__ = fields;
  }

  public get fields(): string[] {
    return this.__fields__;
  }

  public get json(): any {
    return this.toJSON();
  }

  private setData(data: any) {
    Object.assign(this, data);
  }

  public save() {
    const data = this.toJSON();
    if (data.id === 0 || undefined === data.id || data.id === null) {
      return this.getManager().create(data);
    }
    return this.getManager().update(data);
  }

  public delete() {
    return this.getManager().delete({id: this.id});
  }

  public toJSON(): any {
    let json = {};
    const fields = this.__fields__;
    fields.map((field: string) => {
      json[field] = this[field];
    });
    return json;
  }

  public toString(): string {
    return `${this.getManager().model.name} Object`;
  }
}
