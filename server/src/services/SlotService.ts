import { AuctionSlot, AuctionSlotCreate, AuctionSlotStatus, AuctionSlotUpdate } from "../api/Api";
import { toDto, toDtoList } from "../mappers/slot.mapper";
import { SlotEntity } from "../entities/SlotEntity";
import { SlotRepository } from "../repositories/SlotRepository";
import { notFound } from "../errors/http-error";

export class SlotService {
  constructor(private readonly repository: SlotRepository) {}

  list(status?: string): AuctionSlot[] {
    const slots = this.repository.findAll();
    return status ? toDtoList(slots.filter((s) => s.status === status)) : toDtoList(slots);
  }

  get(id: number): AuctionSlot {
    const slot = this.repository.findById(id);
    if (!slot) throw notFound("Слот не найден");
    return toDto(slot);
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

  update(id: number, data: AuctionSlotUpdate): AuctionSlot {
    const existing = this.repository.findById(id);
    if (!existing) throw notFound("Слот не найден");

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

  delete(id: number): void {
    if (!this.repository.delete(id)) throw notFound("Слот не найден");
  }

  private nextId(): number {
    return Date.now();
  }
}