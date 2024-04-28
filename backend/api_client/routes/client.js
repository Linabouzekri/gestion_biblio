import express from "express"

import {ajouterClient , detailsClient , updateClient , deleteClient , getAllClient , statisticClient} from "../controllers/clientController.js"
const router = express.Router()


router.post("/" , ajouterClient )
router.get("/" , getAllClient )
router.get("/statistic" , statisticClient)
router.get("/:idClient" , detailsClient)
router.put("/:idClient" , updateClient)
router.delete("/:idClient" , deleteClient)


export default router ; 