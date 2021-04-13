export interface ChildKeys{
    id:number|null;
    name:string|null;
    username:string|null;
    deviceId?:string;
    parentId:number|null;
}

export interface Weather{
    current:{
        weather:any[]
    };
}