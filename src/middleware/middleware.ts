import { readFile, writeFile } from 'fs';
export const readAndWriteFile=(singleImg:any, newPath:string) :any=>{
  readFile(singleImg.path, function (error, data): any {
    console.log('ds',data)
          if(error) throw error;
    writeFile(newPath, data, (err): any => {
      console.log('ssds',data)
            if (err)
                return err
        });
    });
}