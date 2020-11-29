import {
    Request,
    Response
} from 'express';

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    OPTIONS = 'options'
}

type RouteHandler = (req: Request, res: Response) => Promise<void>;

export interface IRoute {
    method: RequestMethod;
    handler: RouteHandler;
    path: string;
}