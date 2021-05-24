import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv';
dotenv.config();
import { connect  } from 'mongoose';

const check: string = process.env.DB_CONN_STRING;
const options = {  useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true}
export const dbConnect = () => {
        
    connect(check, options, (err) => {
        if (!err) {
            console.log('Successfully Established Connection with MongoDB')
        }
        else {
            console.log('Failed to Establish Connection with MongoDB with Error: '+ err)
        }     

  })
};
