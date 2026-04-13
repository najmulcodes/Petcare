import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createVaccinationSchema, updateVaccinationSchema } from "./vaccinations.schema";
import * as VaccinationsService from "./vaccinations.service";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VaccinationsService.getVaccinations(req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VaccinationsService.getVaccinationById(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createVaccinationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VaccinationsService.createVaccination(req.params.petId, getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updateVaccinationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VaccinationsService.updateVaccination(req.params.id, req.params.petId, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await VaccinationsService.deleteVaccination(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
