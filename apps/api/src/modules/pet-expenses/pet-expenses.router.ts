import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createPetExpenseSchema, updatePetExpenseSchema, petExpenseQuerySchema } from "./pet-expenses.schema";
import * as PetExpensesService from "./pet-expenses.service";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", validateQuery(petExpenseQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetExpensesService.getPetExpenses(req.params.petId, getUserId(req), req.query as { month?: string });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createPetExpenseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetExpensesService.createPetExpense(req.params.petId, getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updatePetExpenseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await PetExpensesService.updatePetExpense(req.params.id, req.params.petId, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await PetExpensesService.deletePetExpense(req.params.id, req.params.petId, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
