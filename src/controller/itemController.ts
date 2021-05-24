import { itemModel } from "../models/items.js";
import * as middleware from "../middleware/middleware";
import multiparty from "multiparty";
import { Request, Response } from "express";

export class ItemController{
    public async searchItem(req: Request, res: Response) {
        console.log("Searching")
        const itemCode:string = String(req.query.itemCode) ||""
        const itemTitle: string = String(req.query.itemTitle) || ""
        let flterParameter={}
        if(itemCode!==""&&itemTitle!==""){
             flterParameter={ $and:[{itemCode},{itemTitle}]}
        }else if(itemCode!==""&& itemTitle===""){
             flterParameter={itemCode}
        }else if(itemCode===""&& itemTitle!==""){
             flterParameter = {itemTitle}
        }else{
             flterParameter={}
          }
          const perPage :number= 5
          const currentPage :number= Number(req.query.page) || 1;
          const from:number =(perPage * currentPage) - perPage+1
          const to :number= perPage * currentPage
          itemModel.find(flterParameter)
           .sort({flterParameter:1})
          .skip((perPage * currentPage) - perPage)
              .exec(function (error, data): void{
              console.log(data)
          if(error) throw error
                    itemModel.countDocuments().exec((err:any,count:any)=>{
                        if (err){
                            res.status(400).send({err})
                        };
                        const sendData={
                            from,
                            to,
                            perPage,
                            currentPage:Number(currentPage),
                            lastPage:Math.ceil(count / perPage),
                            total:count,
                            content:data
                        }
                        res.status(200).json(sendData)
                    })
              })
    }
    public async getItems(req: Request, res: Response) {
            const perPage:number = 5
            const currentPage = Number(req.params.page)|| 1;
            const from:number =(perPage * currentPage) - perPage+1
            const to: number = perPage * currentPage
        
        await itemModel.find({})
        .sort({itemTitle:1})
        .skip((perPage * currentPage) - perPage)
        .exec(function (error, data) {
                if (error) throw error;
            itemModel.countDocuments().exec(async function(err, count) {
                if (err) throw err;
                const sendData={
                    from,
                    to,
                    perPage,
                    currentPage:Number(currentPage),
                    lastPage:Math.ceil(count / perPage),
                    total:count,
                    content:data
                }
                res.status(200).json(sendData)
            })
      })
    }
    public async postItem(req: Request, res: Response) {
        try {
            const form = new multiparty.Form();
            form.parse(req,async (err, fields, files)=> {
            const sendObject:any={}
            const itemTypes:string[] = ['FUL','FUD','ALL','Physical','chemical']
            const sorted:any= [];
            itemTypes.forEach(item=>{
                sorted.push(item.toLowerCase())
            })
            Object.keys(fields).forEach(function(name:string) {
                sendObject[name]= fields[name][0];
                    if(name==='available'){
                        if(sendObject[name]==='on'){
                            sendObject[name]=true;
                        }else if(sendObject[name]==='off'){
                            sendObject[name]=false;
                        }
                    }
                    if(name=="itemType"){
                        const find = sendObject[name]
                        if(!sorted.includes(find.toLowerCase())){
                            return   res.status(400).send({err:"Item type not found"})
                        }
                    }
              });
    
              const itemData = new itemModel(sendObject)
              console.log(files.itemImages)
              if(files.itemImages !==undefined) {
                    if(err){
                        return   res.status(400).send({err:"Images can't be uploaded"+err})
                    }
                    const photoarr =[]
                    const imgArray = files.itemImages;
                    for (let i = 0; i < imgArray.length; i++) {
                      if(imgArray[i].size>0){
                           const fileType = imgArray[i].headers['content-type']
                           if(imgArray[i].originalFilename!=undefined &&fileType =='image/png' || fileType =='image/jpeg'){
                            const newPath = './public/uploads/'+Date.now()+ imgArray[i].originalFilename;
                            const singleImg = imgArray[i];
                            middleware.readAndWriteFile(singleImg, newPath);
                            photoarr.push(newPath)
                      }else{
                              return  res.status(400).send({err:"Images Type does not match"})
                         }
                      }
                    }
                    if(photoarr.length>0){
                         (itemData as any).itemImages=photoarr
                    }
            }
                    itemData.save(async (error,data) =>{
                    if(error){
                        return    res.status(400).send({msg:err})
                          }
                  res.status(201).json(data)
                })
            })
        } catch (error) {
            return res.json({ error: error})
         }
    }
    public async getOneItem(req: Request, res: Response) {
        const itemId:any = req.params.id
       await itemModel.findById({_id: itemId},async (err:any,result:any)=>{
                if(err){
                    return res.status(400).json({error: err});
                }
               res.status(200).json(result);
             })
    }
    public async updateItem(req: any, res: any) {
    const id = req.query.itemCode
    const form = new multiparty.Form();
    form.parse(req,async (err, fields, files)=> {
        const sendObject:any={}
        const itemTypes:string[] = ['FUL','FUD','ALL','Physical','chemical']
        const sorted:string[] = [];
        itemTypes.forEach(item=>{
            sorted.push(item.toLowerCase())
        })
        Object.keys(fields).forEach(function(name) {
            sendObject[name] = fields[name][0];
                if(name=='available'){
                    if(sendObject[name]=='on'){
                        sendObject[name]=true;
                    }else if(sendObject[name]=='off'){
                        sendObject[name]=false;
                    }
                }
                if(name=="itemType"){
                    const find = sendObject[name]
                    if(!sorted.includes(find.toLowerCase())){
                        return   res.status(400).send({err:"Item type not found"})
                    }
                }
          });
          if(files.itemImages !==undefined) {
            if(err){
                return   res.status(400).send({err:"Images can't be uploaded"+err})
            }
            const photoarr =[]
            const imgArray = files.itemImages;
            for (let i = 0; i < imgArray.length; i++) {
              if(imgArray[i].size>0){
                   const fileType = imgArray[i].headers['content-type']
                   if(imgArray[i].originalFilename!=undefined &&fileType =='image/png' || fileType =='image/jpeg'){
                    const newPath = './public/uploads/'+Date.now()+ imgArray[i].originalFilename;
                    const singleImg = imgArray[i];
                    middleware.readAndWriteFile(singleImg, newPath);
                    photoarr.push(newPath)
              }else{
                      return  res.status(400).send({err:"Images Type does not match"})
                 }
              }
            }
            if(photoarr.length>0){
                (sendObject as any).itemImages=photoarr
            }
    }
            itemModel.updateOne({'itemCode':id},{$set:sendObject}, {upsert: true},async function(error,data){
                if(error) throw error;
                if(data.nModified==1){
                res.status(200).json({msg:"item is updated"});
                }else if(data.nModified==0){
                    res.status(200).json({msg:"item is already updated"});
                }else{
                    res.status(400).json({msg:"error"+error});
                }
            })
     }) 
    }
  public async deleteItem(req: Request, res: Response) {
    const id = req.params.id
    const DeletedItem = itemModel.findByIdAndDelete(id)
    DeletedItem.exec((err,data)=>{
        if(err){
            return res.status(400).send(data)
        }
        res.status(200).json({msg:'item deletes'})
      })
    }
}
