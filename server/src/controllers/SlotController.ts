import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuctionSlotCreate, AuctionSlotStatus, AuctionSlotUpdate } from "../api/Api";
import { SlotService } from "../services/SlotService";

export class SlotController {
  constructor(private readonly service: SlotService) {}

  list = (req: Request, res: Response): void => {
    const status = req.query.status as string | undefined;
    if (status && !Object.values(AuctionSlotStatus).includes(status as AuctionSlotStatus)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректный статус" });
      return;
    }
    res.json(this.service.list(status));
  };

  get = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректный id" });
      return;
    }
    const slot = this.service.get(id);
    if (!slot) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Слот не найден" });
      return;
    }
    res.json(slot);
  };

  create = (req: Request, res: Response): void => {
    const body = req.body;
    if (!this.isValidCreate(body)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректные данные слота" });
      return;
    }
    res.status(StatusCodes.CREATED).json(this.service.create(body));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректный id" });
      return;
    }
    const body = req.body;
    if (!this.isValidUpdate(body)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректные данные слота" });
      return;
    }
    const slot = this.service.update(id, body);
    if (!slot) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Слот не найден" });
      return;
    }
    res.json(slot);
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Некорректный id" });
      return;
    }
    if (!this.service.delete(id)) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Слот не найден" });
      return;
    }
    res.status(StatusCodes.NO_CONTENT).send();
  };

  private isValidCreate(body: any): body is AuctionSlotCreate {
    return (
      typeof body === "object" &&
      body !== null &&
      typeof body.title === "string" &&
      body.title.trim().length > 0 &&
      typeof body.startPrice === "number" &&
      isFinite(body.startPrice) &&
      body.startPrice >= 0 &&
      (body.description === undefined || typeof body.description === "string") &&
      (body.seller === undefined || typeof body.seller === "string")
    );
  }

  private isValidUpdate(body: any): body is AuctionSlotUpdate {
    return (
      typeof body === "object" &&
      body !== null &&
      typeof body.title === "string" &&
      body.title.trim().length > 0 &&
      typeof body.startPrice === "number" &&
      isFinite(body.startPrice) &&
      body.startPrice >= 0 &&
      Object.values(AuctionSlotStatus).includes(body.status) &&
      (body.description === undefined ||
        body.description === null ||
        typeof body.description === "string") &&
      (body.seller === undefined ||
        body.seller === null ||
        typeof body.seller === "string")
    );
  }
}