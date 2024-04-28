import {mongoose} from "mongoose";

const Schema = mongoose.Schema

const clientSchema = new Schema({
 
    email : {
        type : String ,
        required : true ,
        unique : true ,
    },
    fname : {
        type : String ,
        required : true ,
    },
    lname : {
        type : String ,
        required : true ,
    },

})

clientSchema.statics.ajouterClient = async function(newData ){

    // validation emial password 
    if (!newData.email , !newData.fname , !newData.lname ){
        throw Error("All fields must be filled")
    }

    const email = newData.email
    const fname = newData.fname
    const lname = newData.lname 
    const _id = newData._id

    const exists = await this.findOne({email })

    if (exists){
       return exists 
    }
   

    const client = await  this.create({
        _id,
        email , 
        fname, 
        lname,
         
    })


    return client
}

clientSchema.statics.supprimerClient =async function(_id){
    const res = await this.deleteOne({ _id })
    if (res.deletedCount === 0){
        throw Error("Client n'existe pas");
    }
   return true
}

clientSchema.statics.allMails =async function(){
    const mails = await this.find().select("email")
    const result = mails.map(mail => mail.email)
    return result
}

export const Client = mongoose.model('Client' , clientSchema);