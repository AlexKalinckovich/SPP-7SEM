import { AuctionSlotStatus } from "../api/Api";

export interface SlotEntity {
  id: number;
  title: string;
  description?: string | null;
  startPrice: number;
  currentBid?: number | null;
  seller?: string | null;
  status: AuctionSlotStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  updatedAt?: string | null;
}