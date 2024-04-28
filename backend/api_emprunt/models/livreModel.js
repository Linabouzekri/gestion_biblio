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
        type : Boolean , 
        default: false
    },


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
    const _id = newData._id
  

    const exists = await this.findOne({ code })

    if (exists){
        return exists
    }
   

    const livre = await  this.create({
        _id ,
        code , 
        title, 
        auteur,
        description,  
    })


    return livre
}

// get All Livres  

livreSchema.statics.getAllLivresEmrunts = async function(){
    const livres = await this.find({emprunt : true})
    
    return livres
}


livreSchema.statics.modifierLivre = async function(code , value){

    const livre = await this.findOne({ code })

    if (livre === null){
        throw Error("Livre n'existe pas");
    }

    livre.emprunt = value
    const updatedLivre = await livre.save();

    return updatedLivre
}

livreSchema.statics.supprimerLivre =async function(_id){
    const livre = await this.findOne({_id}) 

    if(livre){
        const res = await this.deleteOne({ _id })
        if (res.deletedCount === 0){
            throw Error("Livre n'existe pas");
        }
       return true
    }else{
        return true
    }
   
}






export const Livre = mongoose.model('Livre' , livreSchema);