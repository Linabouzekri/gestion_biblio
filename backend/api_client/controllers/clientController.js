import { Client } from "../models/clientModel.js"
import axios from "axios"
import { config } from "dotenv";
config();

const ajouterClient = async(req , res)=>{

    const newData = req.body
    try {
        const client = await Client.addClient(newData)

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
}

const detailsClient = async(req , res )=>{
    const idClient = req.params.idClient;

    try {

        const client = await Client.getDetailsClient(idClient)

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateClient = async(req , res )=>{
    const idClient = req.params.idClient;
    const newData = req.body

    try {

        const client = await Client.modifierClient(idClient , newData)

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const deleteClient = async(req , res )=>{
    const idClient = req.params.idClient;
    // test si le client a des emprunts ou pas  

    try {

        const responseClient = await axios.get(`http://${process.env.HOSTNAME}:4001/api/v1/emprunt/${idClient}`);
        const client_emprunts=responseClient.data
        
        // test si client a des emprunts ou pas 
        if(client_emprunts.length !==0 ){
            return res.status(400).json({ error: "impossible de supprimer Client" });
        }else{
            const client = await Client.supprimerClient(idClient)
            res.status(200).json(client);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllClient = async(req , res) =>{

    try {
        const clients = await Client.getClients()
        res.status(200).json(clients);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const statisticClient = async( req , res)=>{
    try {
        const nbClient = await Client.getStatistic()
        res.status(200).json(nbClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



export { ajouterClient , detailsClient , updateClient , deleteClient , getAllClient , statisticClient}