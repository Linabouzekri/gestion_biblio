import express from "express"

import {ajouterLivre , detailsLivre , updateLivre , deleteLivre , getAllLivres , empruntLivreEmpunte, 
            retourneLivreEmpunte , getAllLivresNonEmrunts , statisticLivre} from "../controllers/livreController.js"
            
const router = express.Router()


router.post("/" , ajouterLivre )
router.get("/" , getAllLivres)
router.get("/allNonEmrunts" , getAllLivresNonEmrunts)
router.get("/statistic" , statisticLivre)
router.get("/empruntLivre/:code" , empruntLivreEmpunte)
router.get("/retourneLivre/:code" , retourneLivreEmpunte)
router.get("/:idLivre" , detailsLivre)
router.put("/:idLivre" , updateLivre)
router.delete("/:idLivre" , deleteLivre)



export default router ; 