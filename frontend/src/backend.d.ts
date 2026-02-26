import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Position {
    ticker: string;
    takeProfit?: number;
    stopLoss?: number;
    quantity: number;
    entryPrice: number;
}
export interface backendInterface {
    addOrUpdatePosition(ticker: string, entryPrice: number, quantity: number, stopLoss: number | null, takeProfit: number | null): Promise<void>;
    addToWatchlist(ticker: string, description: string): Promise<void>;
    getAllPositions(): Promise<Array<Position>>;
    getLatestMarketBriefing(): Promise<string | null>;
    getWatchlist(): Promise<Array<[string, string]>>;
    removeFromWatchlist(ticker: string): Promise<void>;
    removePosition(ticker: string): Promise<void>;
    updateMarketBriefing(content: string): Promise<void>;
}
