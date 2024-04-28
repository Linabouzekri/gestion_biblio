
import { Client } from "../models/clientModel.js";
import {transporter , sendMail} from "../sendMails.js" 

import { config } from "dotenv";
config();

import axios from "axios"





// pas encor commplete

const nouveauLivre = async(req , res) =>{
    const titre_livre = req.body.title 

    try{
        const mails = await Client.allMails()
        const titre = titre_livre
        const to = mails
        const subject = "Nouveau livre disponible à la bibliothèque"
        const message = `Cher Clients,\n
    Nous sommes ravis de vous informer qu'un nouveau livre passionnant, ${titre}, vient d'être ajouté à notre collection à la bibliothèque . Vous êtes invité(e) à venir l'emprunter aux heures d'ouverture.\n\nCordialement,\n\nLinaBiblio`
       
    const mailOption = {
            from: {
                name : "LinaBiblio",
                address : process.env.USER
            },
            to: to, subject, 
            text: message, 
        };

        sendMail(transporter , mailOption)
        
        return res.status(200).json(mailOption);
    }catch(error){
        res.status(400).json({ error: error.message })
    }

    
}

const addClient = async(req , res) =>{ 
    const newClient = req.body
    try{
        const client = await Client.ajouterClient(newClient)
        return res.status(200).json(true)

    }catch(error){
        res.status(400).json({ error: error.message })
    }

    
}

const deleteClient = async(req , res) =>{ 

    const idClient = req.params.idClient;
    try {
        const client = await Client.supprimerClient(idClient)

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// notification return livre  
const retournLivre = async(req , res)=>{
    const idLivre = req.params.idLivre ;
    
    try{

        const responseLivre = await axios.get(`http://${process.env.HOSTNAME}:4002/api/v1/livre/${idLivre}`);
        const livre_emprunt=responseLivre.data
        
        const titre_livre = livre_emprunt.title 
    
        const responseMails = await axios.get(`http://${process.env.HOSTNAME}:4001/api/v1/emprunt/demande/mails/${idLivre}`);
        const mails=responseMails.data
        const to = mails

        const subject = "Disponibilité du livre demandé"
        const message = `Cher/Chère client,\n\nNous sommes heureux de vous informer que le livre que vous avez demandé, ${titre_livre}, est désormais disponible à la bibliothèque. Vous pouvez venir le récupérer aux heures d'ouverture habituelles.\n\nCordialement,\n\nLinaBiblio`

        const mailOption = {
            from: {
                name : "LSBiblio",
                address : process.env.USER
            },
            to: to, subject, 
            text: message, 
        };

        sendMail(transporter , mailOption)

        res.status(200).json(true)
    }catch(error){
        res.status(400).json({error: error.message})

    }

}


export {nouveauLivre , addClient , deleteClient , retournLivre}
