import {
    Router
} from 'express';
import {
    IRoute
} from './IRoute';
import initialize from './initialize';
import addTemporyHitPoints from './combat/addTemporyHitPoints';
import dealDamage from './combat/dealDamage';
import heal from './combat/heal';

const routes: IRoute[] = [
    initialize,
    addTemporyHitPoints,
    dealDamage,
    heal
];

export const configure = (router: Router) => {
    // Add all routes to express app instance
    routes.forEach((route: IRoute) => {
        router[route.method](route.path, route.handler);
    });
};