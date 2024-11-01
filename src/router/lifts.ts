import { Router } from "express";
import { getLifts } from "../controllers/lifts";

export default (router: Router) => {
    router.get('/lifts', getLifts);
}