import {mongoose} from "mongoose";
const Schema = mongoose.Schema

const demandeSchema = new Schema({
    livre: {
      type: Schema.Types.ObjectId,
      ref: 'Livre',
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
  
  });

    // ajouter Livre 

demandeSchema.statics.addDemande = async function(client , livre){

    // validation emial password 
    if (!client, !livre){
        throw Error("All fields must be filled")
    }
    
    const demande = await  this.create({
        client, 
        livre,
            
    })

    const demande_details = await this.findOne({ _id: demande._id })
        .populate({
            path: 'client',
            //select: 'email fname lname'
        })
        .populate({
            path: 'livre',
            //select: 'code , '
        });



    return demande_details
}

demandeSchema.statics.getMailsDemandeLivre =async function (id){
  const objectId =new  mongoose.Types.ObjectId(id);
  const toutDemandes = await this.find({livre : objectId , status : true})
  .populate({
    path: 'client',
   
  })

  const mails = toutDemandes.map(demande => demande.client.email)

  return mails
}

demandeSchema.statics.modifierStatusDemandes =async function(id){
  const objectId =new  mongoose.Types.ObjectId(id);
  const updatedDemandes = await this.updateMany({ livre: objectId , status : true }, { $set: { status: false } });
  
  return true
}




export const Demande = mongoose.model('Demande', demandeSchema);