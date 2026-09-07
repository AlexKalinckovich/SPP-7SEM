import { useEffect, useState } from "react";
import {
  type AuctionSlot,
  AuctionSlotStatus,
  type AuctionSlotCreate,
  type AuctionSlotUpdate,
} from "../api/data-contracts";
import { Slots } from "../api/Slots";
import "./SlotsPage.css";

const api = new Slots({ baseUrl: "http://localhost:3000/api" });

interface EditableSlot {
  id: number | null;
  title: string;
  startPrice: string;
}

const emptyForm: EditableSlot = { id: null, title: "", startPrice: "" };

export default function SlotsPage() {
  const [slots, setSlots] = useState<AuctionSlot[]>([]);
  const [form, setForm] = useState<EditableSlot>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await api.getSlots();
      setSlots(res.data);
      setError(null);
    } catch (e) {
      setError("Не удалось загрузить слоты");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (s: AuctionSlot) => {
    setForm({ id: s.id, title: s.title, startPrice: String(s.startPrice) });
    setEditingId(s.id);
  };

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      if (editingId === null) {
        const payload: AuctionSlotCreate = {
          title: form.title,
          startPrice: Number(form.startPrice) || 0,
        };
        await api.postSlot(payload);
      } else {
        const existing = slots.find((s) => s.id === editingId);
        const payload: AuctionSlotUpdate = {
          title: form.title,
          startPrice: Number(form.startPrice) || 0,
          status: existing?.status ?? AuctionSlotStatus.Draft,
        };
        await api.putSlot(editingId, payload);
      }
      setError(null);
      startAdd();
      await refresh();
    } catch {
      setError("Не удалось сохранить слот");
    }
  };

  const remove = async (id: number) => {
    try {
      await api.deleteSlot(id);
      setError(null);
      await refresh();
    } catch {
      setError("Не удалось удалить слот");
    }
  };

  return (
    <div className="slots-page">
      <h1>Аукцион</h1>

      {error && <div className="slot-error">{error}</div>}

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
        <button type="submit">
          {editingId === null ? "Добавить" : "Сохранить"}
        </button>
        {editingId !== null && (
          <button type="button" onClick={startAdd}>
            Отмена
          </button>
        )}
      </form>

      {loading ? (
        <p className="slot-empty">Загрузка…</p>
      ) : slots.length === 0 ? (
        <p className="slot-empty">Слотов пока нет</p>
      ) : (
        <ul className="slot-list">
          {slots.map((s) => (
            <li key={s.id} className="slot-item">
              <div className="slot-info">
                <span className="slot-title">{s.title}</span>
                <span className="slot-status">{s.status}</span>
                <span className="slot-price">{s.startPrice} ₽</span>
              </div>
              <div className="slot-actions">
                <button onClick={() => startEdit(s)}>Изменить</button>
                <button onClick={() => remove(s.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}