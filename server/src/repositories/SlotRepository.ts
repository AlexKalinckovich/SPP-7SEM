import { SlotEntity } from "../entities/SlotEntity";

export class SlotRepository {
  private store = new Map<number, SlotEntity>();

  findAll(): SlotEntity[] {
    return this.deepCopy([...this.store.values()]);
  }

  findById(id: number): SlotEntity | undefined {
    const slot = this.store.get(id);
    return slot ? this.deepCopy(slot) : undefined;
  }

  create(slot: SlotEntity): SlotEntity {
    this.store.set(slot.id, this.deepCopy(slot));
    return this.deepCopy(slot);
  }

  update(slot: SlotEntity): SlotEntity {
    this.store.set(slot.id, this.deepCopy(slot));
    return this.deepCopy(slot);
  }

  delete(id: number): boolean {
    return this.store.delete(id);
  }

  private deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}