import { Router } from "express";
import mobilityParking from "./mobilityParking";
import lifts from "./lifts";
import stairs from "./stairs";

const router: Router = Router();

export default (): Router => {
    mobilityParking(router);
    lifts(router);
    stairs(router);
    return router;    
}
