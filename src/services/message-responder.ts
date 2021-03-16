import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import { Chroma } from "./chroma";

@injectable()
export class MessageResponder {
  private pingFinder: PingFinder;
  private chroma: Chroma;

  constructor(
    @inject(TYPES.PingFinder) pingFinder: PingFinder,
    @inject(TYPES.Chroma) chroma: Chroma,
  ) {
    this.pingFinder = pingFinder;
    this.chroma = chroma;
  }

  handle(message: Message): Promise<Message | Message[]> {

    if (this.pingFinder.isPing(message.content)) {
        return message.reply('pong!');
    }

    if (this.chroma.isChroma(message.content)){
        return this.chroma.handle(message);
    }

    return Promise.reject();
  }
}