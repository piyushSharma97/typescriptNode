import { model, Schema, Model, Document } from 'mongoose';
interface ITodo extends Document{
    itemCode: string;
    itemType: string;
    itemTitle: string;
    Category: string;
    itemImages: string;
    shortDescription: string;
    available: boolean;
    slug: string;
    startDate: string;
    endDate: string;
}
const itemSchema:Schema =  new Schema({
  itemCode :{
    type: String,
    required: 'This field is required!',
    unique:true
  }  ,
  itemType:{
      type: String,
      required: 'This field is required',
  },
  itemTitle:{
      type: String,
      required: 'This field is required',
  },
  Category: {
      type: String,
      required: 'This field is required',
  },
  itemImages:[{
   type: String,
  }],
  shortDescription:{
      type: String,
  },
  longDescription:{
      type: String,
  },
  available:{
      type: Boolean,
  },
  slug:{
      type: String,
  },
  startDate:{
      type: Date,
  },
  endDate:{
      type: Date,
  }
})

export const itemModel : Model<ITodo>=model('Items',itemSchema)
