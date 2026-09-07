import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuctionSlotCreate, AuctionSlotStatus, AuctionSlotUpdate } from "../api/Api";
import { SlotService } from "../services/SlotService";
import { badRequest } from "../errors/http-error";

export class SlotController {
  constructor(private readonly service: SlotService) {}

  list = (req: Request, res: Response): void => {
    const status = req.query.status as string | undefined;
    if (status && !Object.values(AuctionSlotStatus).includes(status as AuctionSlotStatus)) {
      throw badRequest("Некорректный статус");
    }
    res.json(this.service.list(status));
  };

  get = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw badRequest("Некорректный id");
    }
    res.json(this.service.get(id));
  };

  create = (req: Request, res: Response): void => {
    const body = req.body;
    if (!this.isValidCreate(body)) {
      throw badRequest("Некорректные данные слота");
    }
    res.status(StatusCodes.CREATED).json(this.service.create(body));
  };

  update = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw badRequest("Некорректный id");
    }
    const body = req.body;
    if (!this.isValidUpdate(body)) {
      throw badRequest("Некорректные данные слота");
    }
    res.json(this.service.update(id, body));
  };

  delete = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw badRequest("Некорректный id");
    }
    this.service.delete(id);
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