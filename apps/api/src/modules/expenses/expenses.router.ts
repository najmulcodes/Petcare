import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import { getUserId } from "../../helpers/request";
import { createExpenseSchema, updateExpenseSchema, expenseQuerySchema } from "./expenses.schema";
import * as ExpensesService from "./expenses.service";

const router = Router();
router.use(requireAuth);

router.get("/", validateQuery(expenseQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ExpensesService.getExpenses(getUserId(req), req.query as { month?: string });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post("/", validateBody(createExpenseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ExpensesService.createExpense(getUserId(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updateExpenseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ExpensesService.updateExpense(req.params.id, getUserId(req), req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ExpensesService.deleteExpense(req.params.id, getUserId(req));
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
