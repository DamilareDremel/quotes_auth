import express, { Response } from "express";
import { checkAuth, AuthRequest } from "../middleware/checkAuth";
import { QuoteService } from "../quoteService";

const router = express.Router();
const quoteService = new QuoteService();

router.get("/", async (req, res: Response) => {
  const quotes = await quoteService.getAllQuotes();
  res.json(quotes);
});

router.get("/:id", async (req, res: Response) => {
  const quote = await quoteService.getQuoteById(req.params.id);
  if (!quote) {
    res.status(404).json({ message: "Quote not found" });
    return;
  }
  res.json(quote);
});

router.post("/", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const quote = await quoteService.createQuote(req.body, req.user!.id);
    res.status(201).json({ message: "Quote created", quote });
  } catch (err: any) {
    console.error("Create Quote Error:", err);
    res.status(500).json({ message: "Failed to create quote", error: err.message || err });
  }
});


router.put("/:id", checkAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const quote = await quoteService.getQuoteById(req.params.id); // Make sure it loads user relation

  if (!quote) {
    res.status(404).json({ message: "Quote not found" });
    return;
  }

  if (quote.user.id !== req.user!.id) {
  res.status(403).json({ message: "Not authorized to update this quote" });
  return;
}


  const updated = await quoteService.updateQuote(req.params.id, req.body);
  res.json(updated);
});


router.delete("/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const quote = await quoteService.getQuoteById(req.params.id);
    if (!quote) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

    // ✅ FIX: use req.user.id, not req.user.userId
    if (quote.user.id !== req.user!.id) {
      res.status(403).json({ message: "Not authorized to delete this quote" });
      return;
    }

    const success = await quoteService.deleteQuote(req.params.id);
    res.json({ message: success ? "Quote deleted" : "Failed to delete" });
  } catch (err: any) {
    res.status(500).json({ message: "Error deleting quote", error: err.message });
  }
});

export default router;
