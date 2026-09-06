import { useState } from "react";
import { AuctionSlot, AuctionSlotStatus } from "../api/data-contracts";
import "./SlotsPage.css";

interface EditableSlot {
  id: number | null;
  title: string;
  startPrice: string;
}

const emptyForm: EditableSlot = { id: null, title: "", startPrice: "" };

const toSlot = (f: EditableSlot, existing?: AuctionSlot): AuctionSlot => ({
  id: f.id ?? Date.now(),
  title: f.title,
  startPrice: Number(f.startPrice) || 0,
  status: existing?.status ?? AuctionSlotStatus.Draft,
  createdAt: existing?.createdAt ?? new Date().toISOString(),
});

export default function SlotsPage() {
  const [slots, setSlots] = useState<AuctionSlot[]>([]);
  const [form, setForm] = useState<EditableSlot>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (s: AuctionSlot) => {
    setForm({ id: s.id, title: s.title, startPrice: String(s.startPrice) });
    setEditingId(s.id);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId === null) {
      setSlots((prev) => [...prev, toSlot(form)]);
    } else {
      setSlots((prev) =>
        prev.map((s) => (s.id === editingId ? toSlot(form, s) : s)),
      );
    }
    startAdd();
  };

  const remove = (id: number) => setSlots((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="slots-page">
      <h1>Аукцион</h1>

      <form className="slot-form" onSubmit={submit}>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Название слота"
        />
        <input
          value={form.startPrice}
          onChange={(e) => setForm({ ...form, startPrice: e.target.value })}
          placeholder="Стартовая цена"
          type="number"
          min="0"
        />
        <button type="submit">{editingId === null ? "Добавить" : "Сохранить"}</button>
        {editingId !== null && (
          <button type="button" onClick={startAdd}>
            Отмена
          </button>
        )}
      </form>

      <ul className="slot-list">
        {slots.map((s) => (
          <li key={s.id} className="slot-item">
            <div className="slot-info">
              <span className="slot-title">{s.title}</span>
              <span className="slot-price">{s.startPrice} ₽</span>
            </div>
            <div className="slot-actions">
              <button onClick={() => startEdit(s)}>Изменить</button>
              <button onClick={() => remove(s.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}