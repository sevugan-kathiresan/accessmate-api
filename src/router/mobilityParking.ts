import { Router } from "express";
import { getAllMobilityParking } from "../controllers/mobilityParking";

export default (router: Router) => {
    router.get('/mobility-parkings', getAllMobilityParking);
}