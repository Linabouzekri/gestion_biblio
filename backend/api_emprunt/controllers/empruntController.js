import { Livre } from "../models/livreModel.js"
import {Client} from "../models/clientModel.js"
import { Emprunt } from "../models/EmpuntModel.js" 
import axios from "axios"
import { config } from "dotenv";
import { Demande } from "../models/demandeModel.js";
config();



const ajouterEmprunt = async(req , res)=>{

    const id_client = req.body.id_client
    const id_livre = req.body.id_livre 

        try {

           const responseClient = await axios.get(`http://${process.env.HOSTNAME}:4000/api/v1/client/${id_client}`);
           const client_emprunt=responseClient.data

            const responseLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/${id_livre}`);
            const livre_emprunt=responseLivre.data

            const client = await Client.addClient(client_emprunt)
            const livre = await Livre.addLivre(livre_emprunt)
            const emprunt = await Emprunt.addEmprunt(client._id , livre._id)

            const responseChangeStatusLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/empruntLivre/${livre.code}`);

            res.status(200).json(emprunt);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }



}

const demandeEmprunt =async(req , res)=>{
    const id_client = req.body.id_client
    const id_livre = req.body.id_livre 

        try {

            if(!id_client , !id_livre){
                throw Error("All fields must be filled")
            }

           const responseClient = await axios.get(`http://${process.env.HOSTNAME}:4000/api/v1/client/${id_client}`);
           const client_demande=responseClient.data

            const responseLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/${id_livre}`);
            const livre_demande=responseLivre.data

            const client = await Client.addClient(client_demande)
            const livre = await Livre.addLivre(livre_demande)

            if(livre_demande.emprunt === false){
                throw Error("Livre disponible dans la biblio")
            }

            const demande = await Demande.addDemande(client._id , livre._id)

            res.status(200).json(demande);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

}

const deleteClient = async(req, res)=>{
    const idClient = req.params.idClient;
    try {

        const client = await Client.supprimerClient(idClient)

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}
const retournerLivre = async(req , res) =>{
    const code = req.body.code
    const email = req.body.email 

    try{

        const livresModifier = await Livre.modifierLivre(code , false)
        const test = await Emprunt.retourneEmrunt(code , email)
        const responseChangeStatusLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/retourneLivre/${code}`);

        res.status(200).json(test);
    } catch (error) {
            res.status(400).json({ error: error.message });
    }

    


}

const EmpruntsClient = async(req , res)=>{

    const idClient = req.params.idClient;
    try{
        const emprintClient = await Emprunt.getEmpruntsClient(idClient)

        res.status(200).json(emprintClient);
    } catch (error) {
            res.status(400).json({ error: error.message });
    }

}

const AllEmprunts = async(req , res) =>{

    try {
        const emprunts = await Emprunt.getAllEmprints()
        res.status(200).json(emprunts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteEmprunt = async(req , res) =>{ 
    const idEmprunt = req.params.idEmprunt;

    try {

        const emprint = await Emprunt.supprimerEmprunt(idEmprunt)
        console.log(emprint.livre.code);
        
        const responseChangeStatusLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/retourneLivre/${emprint.livre.code}`);

        res.status(200).json(emprint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const livreDejaEmrunt = async(req , res) =>{
    const idLivre = req.params.idLivre 

    try {
        const result = await Emprunt.livreEmruntDeja(idLivre)
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const deleteLivre = async(req , res) =>{
    const idLivre = req.params.idLivre
    
    try {
        const livre = await Livre.supprimerLivre(idLivre)
        res.status(200).json(livre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getAllMailsDemandsLivre = async (req , res)=>{
    const idLivre = req.params.idLivre
    
    try{
        const mails = await Demande.getMailsDemandeLivre(idLivre)
        res.status(200).json(mails)

    }catch(error){
        res.status(400).json({ error: error.message })
    }

   
}


const changeStatusDemendes =async (req , res) =>{
    const idLivre =req.params.idLivre 
 
    try{
        const result = await Demande.modifierStatusDemandes(idLivre)
        res.status(200).json(result)

    }catch(error){
        res.status(400).json({ error: error.message })
    }
    
}

const statisticEmprunts = async (req , res)=>{

    try{
        const result = await Emprunt.getSatistique()

        //statistique livre
        const livreStatistique = result.statLivre
        const informationsLivres = await Livre.find({ _id: { $in: livreStatistique } }).populate('code');

        const livresAvecStatistique = informationsLivres.map(livre => {
            const statistique = livreStatistique.find(stat => stat._id.equals(livre._id));
            return {
                label: livre.code,
                value: statistique ? statistique.count : 0
            };
        });

        // statistique Client

        const clientStatistique = result.statClient
        const informationsClients = await Client.find({ _id: { $in: clientStatistique } }).populate('fname' , 'lname');

        const ClientAvecStatistique = informationsClients.map(client => {
            const statistique = clientStatistique.find(stat => stat._id.equals(client._id));
            return {
                label: client.fname + " " + client.lname,
                value: statistique ? statistique.count : 0
            };
        });

        // nbEmrunt 
        const nbEmprunt = result.nbEmprunt
        

        res.status(200).json({livre :livresAvecStatistique , client : ClientAvecStatistique , nbEmprunt : nbEmprunt})

    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

export {ajouterEmprunt , retournerLivre , EmpruntsClient , AllEmprunts , deleteEmprunt , deleteClient ,
     livreDejaEmrunt , deleteLivre , demandeEmprunt , getAllMailsDemandsLivre ,changeStatusDemendes, statisticEmprunts}