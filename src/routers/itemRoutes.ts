import {Request, Response, NextFunction,Router} from "express";

import  {ItemController} from "../controller/itemController";


export class Routes {
    public itemController:ItemController =new ItemController()
    public routes(app:Router): void {
        app.route('/')
            .get(this.itemController.searchItem)
            .post(this.itemController.postItem)
            .put(this.itemController.updateItem)
            app.route('/form').get(((req:Request,res:Response,next:NextFunction)=>{
                    res.render('form')
            }))
      
        app.route('/:page').get(this.itemController.getItems)
        app.route('/item/:id').get(this.itemController.getOneItem)
                              .delete(this.itemController.deleteItem)
    }

}

