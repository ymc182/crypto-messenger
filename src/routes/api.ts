import { Router } from "express";
import { insertEvent, keyGen } from "../controller/api";

const router = Router();

router.get("/key-gen", keyGen);
router.post("/create-event", insertEvent);

export default router;
