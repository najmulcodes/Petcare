import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createPetNoteSchema, updatePetNoteSchema } from "./pet-notes.schema";
import * as PetNotesService from "./pet-notes.service";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetNotesService.getPetNotes(req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createPetNoteSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetNotesService.createPetNote(req.params.petId, getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updatePetNoteSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetNotesService.updatePetNote(req.params.id, req.params.petId, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await PetNotesService.deletePetNote(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
