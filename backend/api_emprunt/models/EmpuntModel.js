import {mongoose} from "mongoose";
const Schema = mongoose.Schema

const empruntSchema = new Schema({
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
    date_emprunt: {
      type: Date,
      required: true
    },
    date_retour: {
      type: Date,
      default: null
    },
  
  });



  // ajouter Emprunt

  empruntSchema.statics.addEmprunt = async function(client , livre){

  // validation emial password 
  if (!client, !livre){
      throw Error("All fields must be filled")
  }
  const date_emprunt = new Date();

  date_emprunt.setHours(date_emprunt.getHours() + 1);

  const emprunt = await  this.create({
    client, 
    livre,
    date_emprunt,   
         
  })

  const emprunt_details = await Emprunt.findOne({ _id: emprunt._id })
    .populate({
        path: 'client',
        //select: 'email fname lname'
    })
    .populate({
        path: 'livre',
        //select: 'code , '
    });



  return emprunt_details
}

// check emprint 
empruntSchema.statics.check = async function(code, email) {

  const empruntsDuClient = await this.findOne({date_retour : null})
  .populate({
    path: 'client',
    match: { email }
  })
  .populate({
    path: 'livre',
    match: { code } 
  })
  .exec();

  if (!empruntsDuClient || !empruntsDuClient.client || !empruntsDuClient.livre) {
    return false;
  }


  return empruntsDuClient

}

// retourner Emprunter : 

empruntSchema.statics.retourneEmrunt = async function(code, email) {

  const empruntsDuClient = await this.check(code ,email )
  if (empruntsDuClient === false){
    throw Error("emprunt n'existe pas")
  }
  const date_retour = new Date();

  date_retour.setHours(date_retour.getHours() + 1);

  empruntsDuClient.date_retour = date_retour 
  
  empruntsDuClient.save()

  return empruntsDuClient  

}


empruntSchema.statics.getEmpruntsClient = async function(client){

  const empruntsDuClient = await this.find({client})
  .populate({
    path: 'client',
   
  })
  .populate({
    path: 'livre',
  })
  .exec();

  return empruntsDuClient

}


empruntSchema.statics.getAllEmprints = async function (){
  const emprunts = await this.find()
  .populate({
    path: 'client',
   
  })
  .populate({
    path: 'livre',
  })
  .exec();

  return emprunts
}


empruntSchema.statics.supprimerEmprunt =async function (_id){
  const emprunt = await this.findOne({_id})
  .populate({
    path: 'livre',
  })
  .exec();
  const res = await this.deleteOne({ _id })
    if (res.deletedCount === 0){
        throw Error("Emprunt n'existe pas");
  }
  return emprunt
}


// verifier si livre deja emprunter  : 
empruntSchema.statics.livreEmruntDeja =async function(livre){
  const emprunt =await  Emprunt.findOne({livre})

  if (emprunt !== null) {
    return true
  }else{
    return false
  }
}

//statistique  

empruntSchema.statics.getSatistique = async function(){
  const livresStatistique = await this.aggregate([
      { $group: { _id: '$livre', count: { $sum: 1 } } }, 
      { $sort: { count: -1 } },
      { $limit: 10 }
  ])
  const clientStatistique = await this.aggregate([
      { $group: { _id: '$client', count: { $sum: 1 } } }, 
      { $sort: { count: -1 } },
      { $limit: 5 }
  ])

  const nbEmprunts = await this.find().count()
  


  const data = { "statLivre" : livresStatistique , "statClient" : clientStatistique , "nbEmprunt" : nbEmprunts }

  return data

}

export const Emprunt = mongoose.model('Emprunt', empruntSchema);