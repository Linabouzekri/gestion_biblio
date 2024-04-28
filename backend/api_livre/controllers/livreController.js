import { Livre } from "../models/livreModel.js"
import axios from "axios"
import { config } from "dotenv";
config();


const ajouterLivre = async(req , res)=>{

    const newData = req.body
    try {
        const livre = await Livre.addLivre(newData)

        res.status(200).json(livre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
}

const detailsLivre = async(req , res )=>{
    const idLivre = req.params.idLivre;

    try {

        const livre = await Livre.getDetailsLivre(idLivre)

        res.status(200).json(livre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const updateLivre = async(req , res )=>{
    const idLivre = req.params.idLivre;
    const newData = req.body

    try {

        const livre = await Livre.modifierLivre(idLivre , newData)

        res.status(200).json(livre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const deleteLivre = async(req , res )=>{
    const idLivre = req.params.idLivre;

    
    try {
        // test si le livre emprunter ou pas 
        const responseLivre = await axios.get(`http://${process.env.HOSTNAME}:4001/api/v1/emprunt/livre/${idLivre}`);
        const livre_emprunts=responseLivre.data

        if(livre_emprunts){
            // livre deja emprunt
            res.status(400).json({ error: "impossible de supprimer Livre Deja Emrunts" });
        }else{
            const livre = await Livre.supprimerLivre(idLivre)
            res.status(200).json(livre);
        }

     
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getAllLivres = async(req , res)=>{
    try {
        const livres = await Livre.getLivres()
        res.status(200).json(livres);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const retourneLivreEmpunte = async(req , res)=>{
    const code = req.params.code;

    try {
        const ressult = await Livre.retournLivre(code , false)
        res.status(200).json(ressult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const empruntLivreEmpunte = async(req , res) =>{
    const code = req.params.code;
   
    try {
        const ressult = await Livre.retournLivre(code , true)
        res.status(200).json(ressult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getAllLivresNonEmrunts = async (req , res)=>{

    try {
        const livres = await Livre.getLivresNonEmprunts()
        res.status(200).json(livres);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const statisticLivre = async (req , res) =>{ 
    try {
        const nbLivre = await Livre.getStatistic()
        res.status(200).json(nbLivre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export { ajouterLivre , detailsLivre , updateLivre , deleteLivre , getAllLivres ,empruntLivreEmpunte,retourneLivreEmpunte , getAllLivresNonEmrunts ,statisticLivre }