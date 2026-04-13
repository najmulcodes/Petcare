import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createMedicationSchema, updateMedicationSchema } from "./medications.schema";
import * as MedicationsService from "./medications.service";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MedicationsService.getMedications(req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MedicationsService.getMedicationById(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createMedicationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MedicationsService.createMedication(req.params.petId, getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updateMedicationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MedicationsService.updateMedication(req.params.id, req.params.petId, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await MedicationsService.deleteMedication(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
