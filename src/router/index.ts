import { Router } from "express";
import mobilityParking from "./mobilityParking";

const router: Router = Router();

export default (): Router => {
    mobilityParking(router);
    return router;    
}
