import express from "express";
import {
  createFolder,
  getFolders,
  getFullHierarchy
} from "../controllers/folderController.js";

const router = express.Router();

router.post("/", createFolder);
router.get("/", getFolders);
router.get("/full", getFullHierarchy);

export default router;
