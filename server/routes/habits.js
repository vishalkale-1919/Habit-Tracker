import { Router } from "express";
import { z } from "zod";
import { supabase } from "../supabase.js";

const router = Router();

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString().slice(0, 10);
  return { start, end };
};

// GET /habits — habits + completions for the current month + metrics
router.get("/", async (_req, res, next) => {
  try {
    const { start, end } = monthRange();
    const { data: habits, error: hErr } = await supabase
      .from("habits").select("*").order("created_at");
    if (hErr) throw hErr;

    const { data: comps, error: cErr } = await supabase
      .from("habit_completions")
      .select("*")
      .gte("date", start).lte("date", end);
    if (cErr) throw cErr;

    const daysInMonth = new Date(
      new Date().getFullYear(), new Date().getMonth() + 1, 0
    ).getDate();

    const enriched = habits.map((h) => {
      const completions = comps.filter((c) => c.habit_id === h.id && c.completed);
      const monthlyPct = Math.round((completions.length / daysInMonth) * 100);
      return { ...h, completions, monthlyPct };
    });

    const today = todayISO();
    const objectivesDone = enriched.filter(
      (h) => h.completions.some((c) => c.date === today)
    ).length;
    const syncEfficiency = habits.length
      ? Math.round((objectivesDone / habits.length) * 100) : 0;

    res.json({
      habits: enriched,
      meta: {
        today,
        objectivesDue: `${objectivesDone}/${habits.length}`,
        syncEfficiency,
      },
    });
  } catch (e) { next(e); }
});

// POST /habits
const NewHabit = z.object({ name: z.string().min(1).max(120) });
router.post("/", async (req, res, next) => {
  try {
    const { name } = NewHabit.parse(req.body);
    const { data, error } = await supabase
      .from("habits").insert({ name }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) { next(e); }
});

// PATCH /habits/:id/toggle  body: { date: 'YYYY-MM-DD' }
const Toggle = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = Toggle.parse(req.body);

    const { data: existing } = await supabase
      .from("habit_completions")
      .select("*").eq("habit_id", id).eq("date", date).maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("habit_completions")
        .update({ completed: !existing.completed })
        .eq("id", existing.id).select().single();
      if (error) throw error;
      return res.json(data);
    }
    const { data, error } = await supabase
      .from("habit_completions")
      .insert({ habit_id: id, date, completed: true })
      .select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) { next(e); }
});

// server/routes/habits.js
router.get("/stats/annual", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('date, completed')
      .eq('completed', true);

    if (error) throw error;

    // Group completions by date
    const counts = data.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + 1;
      return acc;
    }, {});

    res.json(counts);
  } catch (e) { next(e); }
});

// DELETE /habits/:id  (or DELETE /habits to clear all)
router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase.from("habits").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (e) { next(e); }
});

router.delete("/", async (_req, res, next) => {
  try {
    const { error } = await supabase.from("habits").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
