import { AppDataSource } from "./config/database";
import { Quote } from "./entities/Quote";
import { Repository } from "typeorm";
import { User } from "./entities/User";


interface QuoteInput {
    text: string;
    author: string;
    tags: string[];
}

export class QuoteService {
    private readonly quoteRepository: Repository<Quote>;

    constructor() {
        this.quoteRepository = AppDataSource.getRepository(Quote);
    }

    async getAllQuotes(): Promise<Quote[]> {
        return await this.quoteRepository.find();
    }

    async getQuoteById(id: string): Promise<Quote | null> {
  return await this.quoteRepository.findOne({
    where: { id },
    relations: ["user"],  // Important: load the user relation
  });
}



    async getRandomQuote(): Promise<Quote | null> {
        const quotes = await this.quoteRepository.find();
        if (quotes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // In quoteService.ts
async createQuote(quoteData: QuoteInput, userId: string): Promise<Quote> {
  const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  const quote = this.quoteRepository.create({ ...quoteData, user });
  return await this.quoteRepository.save(quote);
}



    async updateQuote(id: string, quoteData: Partial<QuoteInput>): Promise<Quote | null> {
        const quote = await this.quoteRepository.findOneBy({ id });
        if (!quote) return null;

        Object.assign(quote, quoteData);
        return await this.quoteRepository.save(quote);
    }

    async deleteQuote(id: string): Promise<boolean> {
        const result = await this.quoteRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
} 