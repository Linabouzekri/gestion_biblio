import express from "express"

import {ajouterEmprunt , retournerLivre , EmpruntsClient ,AllEmprunts  ,deleteEmprunt , deleteClient , livreDejaEmrunt ,
                deleteLivre , demandeEmprunt , getAllMailsDemandsLivre ,changeStatusDemendes ,statisticEmprunts} from "../controllers/empruntController.js"

const router = express.Router()


router.post("/" , ajouterEmprunt )
router.post("/demande" , demandeEmprunt)
router.put("/" , retournerLivre)
router.get("/statistic" , statisticEmprunts)
router.get('/' ,AllEmprunts )
router.delete("/client/:idClient" ,deleteClient)
router.get("/:idClient" , EmpruntsClient)
router.delete("/:idEmprunt" , deleteEmprunt)
router.get("/livre/:idLivre" , livreDejaEmrunt)
router.delete("/livre/:idLivre",deleteLivre)
router.get("/demande/mails/:idLivre" , getAllMailsDemandsLivre)
router.get("/demande/changestatus/:idLivre" , changeStatusDemendes)



export default router ; 