import { Router } from "express";
import mobilityParking from "./mobilityParking";
import lifts from "./lifts";

const router: Router = Router();

export default (): Router => {
    mobilityParking(router);
    lifts(router);
    return router;    
}
