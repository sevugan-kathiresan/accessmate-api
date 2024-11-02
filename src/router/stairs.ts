import { Router } from "express";
import { getStairs } from "../controllers/stairs";

export default (router: Router) => {
    router.get('/stairs', getStairs)
}