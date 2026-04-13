import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createVetVisitSchema, updateVetVisitSchema } from "./vet-visits.schema";
import * as VetVisitsService from "./vet-visits.service";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VetVisitsService.getVetVisits(req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VetVisitsService.getVetVisitById(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createVetVisitSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VetVisitsService.createVetVisit(req.params.petId, getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updateVetVisitSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await VetVisitsService.updateVetVisit(req.params.id, req.params.petId, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await VetVisitsService.deleteVetVisit(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
