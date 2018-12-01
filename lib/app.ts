import * as express from "express";
import * as bodyParser from 'body-parser';
import {Routes} from './routes/crmRoutes';
import * as mongoose from 'mongoose';

class App {
    public app: express.Application;
    public routesPre:Routes = new Routes();
    public mongodbURL:string = 'mongodb://localhost/CRMdb'
    constructor() {
        this.app = express();
        this.config();
        this.routesPre.routes(this.app);
        this.mongoSetUp();
    }

    private mongoSetUp():void{
        require('mongoose').Promise = global.Promise;
        mongoose.connect(this.mongodbURL,{ useNewUrlParser: true });

    }
    private config() {
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({extended:false}));
    }
}

export default new App().app;