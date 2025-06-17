import { AppDataSource } from "./config/database";
import { Quote } from "./entities/Quote";
import { User } from "./entities/User";

interface QuoteInput {
  text: string;
  author: string;
  tags: string[];
}


export class QuoteService {
  private quoteRepo = AppDataSource.getRepository(Quote);
  private userRepo = AppDataSource.getRepository(User);

  async getAllQuotes() {
    return await this.quoteRepo.find({
      relations: ["user"],
    });
  }

  async getQuoteById(id: string) {
    return await this.quoteRepo.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async getRandomQuote() {
    const quotes = await this.quoteRepo.find();
    if (quotes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  async createQuote(data: QuoteInput, userId: string) {
  const existingUser = await this.userRepo.findOne({ where: { id: userId } });
  if (!existingUser) {
    throw new Error("User not found");
  }

  const newQuote = this.quoteRepo.create({
    text: data.text,
    author: data.author,
    tags: data.tags, // include tags here
    user: existingUser,
  });

  return await this.quoteRepo.save(newQuote);
}


  async updateQuote(id: string, quoteData: Partial<QuoteInput>) {
    const quote = await this.quoteRepo.findOneBy({ id });
    if (!quote) throw new Error("Quote not found");

    Object.assign(quote, quoteData);
    return await this.quoteRepo.save(quote);
  }

  async deleteQuote(id: string) {
    const result = await this.quoteRepo.delete({ id });
    return typeof result.affected === "number" && result.affected > 0;
  }
}
