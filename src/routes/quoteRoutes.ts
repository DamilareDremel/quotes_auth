import express, { Request, Response } from "express";
import { checkAuth, AuthRequest } from "../middleware/checkAuth";  // ✅ you already have this
import { QuoteService } from "../quoteService";

const router = express.Router();
const quoteService = new QuoteService();

// Get all quotes
router.get("/", async (req: Request, res: Response) => {
  const quotes = await quoteService.getAllQuotes();
  res.json(quotes);
});

// Get random quote
router.get("/random", async (req: Request, res: Response) => {
  try {
    const quote = await quoteService.getRandomQuote();
    if (!quote) {
      res.status(404).json({ message: "No quotes found" });
      return;
    }
    res.json(quote);
  } catch (error: any) {
    console.error("Random Quote Error:", error);
    res.status(500).json({ message: "Failed to fetch random quote", error: error.message });
  }
});

// Get quote by ID
router.get("/:id", async (req: Request, res: Response) => {
  const quote = await quoteService.getQuoteById(req.params.id);
  if (!quote) {
    res.status(404).json({ message: "Quote not found" });
    return;
  }
  res.json(quote);
});

// Create quote — protected route
router.post("/", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const quoteData = req.body;

    const newQuote = await quoteService.createQuote(quoteData, userId);

    // Remove password from user object before sending
    if (newQuote.user) {
      delete (newQuote.user as any).password;
    }

    res.status(201).json({ message: "Quote created", quote: newQuote });
  } catch (err: any) {
    res.status(500).json({ message: "Error creating quote", error: err.message });
  }
});

// Update quote — protected route
router.put("/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const quote = await quoteService.getQuoteById(req.params.id);

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

// Delete quote — protected route
router.delete("/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const quote = await quoteService.getQuoteById(req.params.id);
    if (!quote) {
      res.status(404).json({ message: "Quote not found" });
      return;
    }

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
