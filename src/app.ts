import  express ,{Request, Response, NextFunction,Router}from "express";
import path from 'path';
import * as bodyParser from 'body-parser';
import { dbConnect } from './db/connection';
dbConnect()
import {Routes} from "./routers/itemRoutes";
class App{
  public app: express.Application;
  public routePrv: Routes = new Routes();

        constructor() {
          this.app = express();
          this.app.set("views", path.join(__dirname, "views"))
          this.app.set("view engine", "ejs")
          // parse application/x-www-form-urlencoded
          this.app.use(bodyParser.urlencoded({extended: false}))
          // parse application/json
          this.app.use(bodyParser.json());
          this.app.use(express.static(path.join(__dirname, './public')));
          this.app.use(express.urlencoded({ extended: true }))
          this.routePrv.routes(this.app);   
  }
}


export default new App().app