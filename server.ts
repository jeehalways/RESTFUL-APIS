import express from "express";
import { z, ZodError } from "zod";

const app = express();
app.use(express.json());

const PORT = 3000;

const pastryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  price: z.number().nonnegative("Price must be >= 0"),
  isVegan: z.boolean().optional(),
  ingredients: z.array(z.string()).optional(),
});

const pastrySchema = pastryCreateSchema.extend({
  id: z.number().int().positive(),
});

type PastryCreate = z.infer<typeof pastryCreateSchema>;
type Pastry = z.infer<typeof pastrySchema>;

let pastries: Pastry[] = [
  {
    id: 1,
    name: "Kanelbulle",
    type: "bulle",
    price: 25,
    isVegan: false,
    ingredients: ["flour", "butter", "sugar", "cinnamon"],
  },
  {
    id: 2,
    name: "Semla",
    type: "semla",
    price: 35,
    isVegan: false,
    ingredients: ["flour", "milk", "almond", "cream"],
  },
];

function getNextId(): number {
  return pastries.length === 0 ? 1 : Math.max(...pastries.map((p) => p.id)) + 1;
}

function handleZodError(err: unknown, res: express.Response) {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Validation error", issues: err.format() });
  }
  return res.status(500).json({ message: "Unknown error" });
}

app.get("/pastries", (req, res) => {
  res.json(pastries);
});

app.get("/pastries/:id", (req, res) => {
  const id = Number(req.params.id);
  const pastry = pastries.find((p) => p.id === id);
  if (!pastry) return res.status(404).json({ message: "Pastry not found" });
  res.json(pastry);
});

app.post("/pastries", (req, res) => {
  try {
    const parsed: PastryCreate = pastryCreateSchema.parse(req.body);
    const newPastry: Pastry = { id: getNextId(), ...parsed };
    pastries.push(newPastry);
    res
      .status(201)
      .json({ message: "Pastry added successfully!", pastry: newPastry });
  } catch (err) {
    handleZodError(err, res);
  }
});

app.put("/pastries/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = pastries.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Pastry not found" });

  const merged = { ...pastries[idx], ...req.body };
  try {
    const validated = pastrySchema.parse(merged);
    pastries[idx] = validated;
    res.json({ message: "Pastry updated successfully!", pastry: validated });
  } catch (err) {
    handleZodError(err, res);
  }
});

app.delete("/pastries/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = pastries.length;
  pastries = pastries.filter((p) => p.id !== id);
  if (pastries.length === before)
    return res.status(404).json({ message: "Pastry not found" });
  res.json({ message: "Pastry deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
