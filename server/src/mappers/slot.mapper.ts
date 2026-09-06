import { AuctionSlot } from "../api/Api";
import { SlotEntity } from "../entities/SlotEntity";

export function toDto(slot: SlotEntity): AuctionSlot {
  return {
    id: slot.id,
    title: slot.title,
    description: slot.description ?? undefined,
    startPrice: slot.startPrice,
    currentBid: slot.currentBid,
    seller: slot.seller ?? undefined,
    status: slot.status,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    updatedAt: slot.updatedAt,
  };
}

export function toDtoList(slots: SlotEntity[]): AuctionSlot[] {
  return slots.map(toDto);
}