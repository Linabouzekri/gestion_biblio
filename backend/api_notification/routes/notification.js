import express from "express"

import {nouveauLivre , addClient , deleteClient , retournLivre} from "../controllers/notificationController.js"

const router = express.Router()


router.post("/nouveaulivre" , nouveauLivre )
//add mail user 
router.post("/addClient", addClient)
router.delete("/client/:idClient" , deleteClient)

// return Livre notification
router.get("/retournLivre/:idLivre" , retournLivre)


export default router ; 