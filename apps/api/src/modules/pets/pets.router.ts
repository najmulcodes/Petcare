import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createPetSchema, updatePetSchema } from "./pets.schema";
import * as PetsService from "./pets.service";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetsService.getAllPets(getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetsService.getPetById(req.params.id, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createPetSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetsService.createPet(getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updatePetSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetsService.updatePet(req.params.id, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await PetsService.deletePet(req.params.id, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
