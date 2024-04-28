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

// ajouter Client 

clientSchema.statics.addClient = async function(newData) {

   
    // Validation email, prénom, nom de famille
    if (!newData.email , !newData.fname , !newData.lname) {
        throw new Error("All fields must be filled");
    }

    const email = newData.email;
    const fname = newData.fname;
    const lname = newData.lname;

    // Vérifier si l'email existe déjà
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error("Email already exists");
    }

   

    const client = await this.create({
            email,
            fname,
            lname,
        })

    return client;
   
};

// get Client

clientSchema.statics.getDetailsClient= async function(_id ){

    const client = await this.findOne({ _id })
    if (client === null){
        throw Error("Client n'existe pas");
    }

   return client
}

// modifier Client

clientSchema.statics.modifierClient = async function(_id  , newData){

    const client = await this.findOne({ _id })

    if (client === null){
        throw Error("Client n'existe pas");
    }
    if (newData.email) {
        
        const exists = await this.findOne({ email :newData.email })
        if (exists && newData.email!=client.email){
            throw Error("Email deja existe");
        }
        client.email = newData.email;
    }

    if (newData.fname) {
        
        client.fname = newData.fname;
    }

    if (newData.lname) {
        
        client.lname = newData.lname;
    }

   
    const updatedClient = await client.save();

    return updatedClient
}

// supprimer livre 

clientSchema.statics.supprimerClient = async function(_id ){

    const res = await this.deleteOne({ _id })
    if (res.deletedCount === 0){
        throw Error("Client n'existe pas");
    }
   return true

}

// get all clients 

clientSchema.statics.getClients = async function( ){

    const clients = await this.find()
   
   return clients

}

//statistique ; 

clientSchema.statics.getStatistic = async function(){
    const nbClient = await this.find().count()
    return nbClient
}


export const Client = mongoose.model('client' , clientSchema);