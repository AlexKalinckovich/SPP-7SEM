import { AuctionSlot, AuctionSlotCreate, AuctionSlotStatus, AuctionSlotUpdate } from "../api/Api";
import { toDto, toDtoList } from "../mappers/slot.mapper";
import { SlotEntity } from "../entities/SlotEntity";
import { SlotRepository } from "../repositories/SlotRepository";

export class SlotService {
  constructor(private readonly repository: SlotRepository) {}

  list(status?: string): AuctionSlot[] {
    const slots = this.repository.findAll();
    if (!status) return toDtoList(slots);
    return toDtoList(slots.filter((s) => s.status === status));
  }

  get(id: number): AuctionSlot | null {
    const slot = this.repository.findById(id);
    return slot ? toDto(slot) : null;
  }

  create(data: AuctionSlotCreate): AuctionSlot {
    const entity: SlotEntity = {
      id: this.nextId(),
      title: data.title,
      description: data.description,
      startPrice: data.startPrice,
      currentBid: null,
      seller: data.seller,
      status: AuctionSlotStatus.Draft,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      updatedAt: null,
    };
    return toDto(this.repository.create(entity));
  }

  update(id: number, data: AuctionSlotUpdate): AuctionSlot | null {
    const existing = this.repository.findById(id);
    if (!existing) return null;

    const updated: SlotEntity = {
      ...existing,
      title: data.title,
      description: data.description,
      startPrice: data.startPrice,
      seller: data.seller,
      status: data.status,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      updatedAt: new Date().toISOString(),
    };
    return toDto(this.repository.update(updated));
  }

  delete(id: number): boolean {
    return this.repository.delete(id);
  }

  private nextId(): number {
    return Date.now();
  }
}