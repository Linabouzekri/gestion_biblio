import {mongoose} from "mongoose";


const Schema = mongoose.Schema

const livreSchema = new Schema({
 
    code : {
        type : String ,
        required : true ,
        unique : true ,
    },
    title : {
        type : String ,
        required : true ,
    },
    auteur : {
        type : String ,
        required : true ,
    },
    description : {
        type : String , 
        required : true,
    },
    emprunt : {
        type : Boolean,
        default : false
    }

})

// ajouter Livre 

livreSchema.statics.addLivre = async function(newData ){

    // validation emial password 
    if (!newData.description , !newData.code , !newData.title , !newData.auteur){
        throw Error("All fields must be filled")
    }

    const description = newData.description
    const code = newData.code
    const title = newData.title 
    const auteur =newData.auteur

    const exists = await this.findOne({ code })

    if (exists){
        throw Error("code deja existe");
    }
   

    const livre = await  this.create({
        code , 
        title, 
        auteur,
        description ,    
    })


    return livre
}

// get Livre 

livreSchema.statics.getDetailsLivre = async function(_id ){

    const livre = await this.findOne({ _id })
    if (livre === null){
        throw Error("Livre n'existe pas");
    }

   return livre
}

// modifier Livre

livreSchema.statics.modifierLivre = async function(_id  , newData){

    const livre = await this.findOne({ _id })

    if (livre === null){
        throw Error("Livre n'existe pas");
    }
    if (newData.code) {
        
        const exists = await this.findOne({ code :newData.code })
        if (exists && newData.code!=livre.code){
            throw Error("code deja existe");
        }
        livre.code = newData.code;
    }

    if (newData.title) {
        
        livre.title = newData.title;
    }

    if (newData.auteur) {
        
        livre.auteur = newData.auteur;
    }

    if (newData.description) {
        
        livre.description = newData.description;
    }
    const updatedLivre = await livre.save();

    return updatedLivre
}

// supprimer livre 

livreSchema.statics.supprimerLivre = async function(_id ){

    const res = await this.deleteOne({ _id })
    if (res.deletedCount === 0){
        throw Error("Livre n'existe pas");
    }
   return true

}


// get All Livres 

livreSchema.statics.getLivres = async function( ){

    const livres = await this.find()
   
   return livres

}

livreSchema.statics.getLivresNonEmprunts = async function(){
    const livres = await this.find({emprunt : false})
    return livres
}

livreSchema.statics.retournLivre = async function(code , value){

    const livre = await Livre.findOne({code})
    
    if (livre === null){
        throw Error("Livre n'existe pas")
    }

    livre.emprunt = value
    const updatedLivre = await livre.save();
    return true

}

livreSchema.statics.getStatistic = async function(){
    const nbLivre = await this.find().count()

    return nbLivre
}




export const Livre = mongoose.model('livre' , livreSchema);