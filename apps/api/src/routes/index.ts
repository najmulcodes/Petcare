import { Router, Request, Response } from "express";
import authRouter from "../modules/auth/auth.router";
import petsRouter from "../modules/pets/pets.router";
import expensesRouter from "../modules/expenses/expenses.router";
import remindersRouter from "../modules/reminders/reminders.router";
import medicationsRouter from "../modules/medications/medications.router";
import vaccinationsRouter from "../modules/vaccinations/vaccinations.router";
import vetVisitsRouter from "../modules/vet-visits/vet-visits.router";
import petNotesRouter from "../modules/pet-notes/pet-notes.router";
import petExpensesRouter from "../modules/pet-expenses/pet-expenses.router";
import healthSummaryRouter from "../modules/health-summary/health-summary.router";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "unknown",
    },
  });
});

router.use("/auth", authRouter);
router.use("/pets", petsRouter);
router.use("/expenses", expensesRouter);
router.use("/reminders", remindersRouter);

// Pet sub-resources — mergeParams in each child router exposes :petId
router.use("/pets/:petId/medications", medicationsRouter);
router.use("/pets/:petId/vaccinations", vaccinationsRouter);
router.use("/pets/:petId/vet-visits", vetVisitsRouter);
router.use("/pets/:petId/notes", petNotesRouter);
router.use("/pets/:petId/expenses", petExpensesRouter);
router.use("/health-summary", healthSummaryRouter);

export default router;
