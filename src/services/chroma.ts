import { Message, MessageAttachment } from "discord.js";
import {injectable} from "inversify";
import * as request from "request";
import * as fs from "fs";

@injectable()
export class Chroma {

  private regexp = 'chroma';

  public isChroma(stringToSearch: string): boolean {
    return stringToSearch.search(this.regexp) >= 0;
  }

  public handle(message: Message) : Promise<Message | Message[]>{

    if(message.attachments.size > 0){
        let asset = message.attachments.first();
        
        const download = (url: string, path: string, callback: VoidFunction) => {
          request.head(url, () => {
            request(url)
              .pipe(fs.createWriteStream(path))
              .on('close', callback)
          })
        }        
        
        download(asset.url as string, ("./streamlabs-chroma/image" + (asset.url.endsWith(".gif")? ".gif" : ".jpg")), () => {
          console.log('✅ Downloaded new file for chroma!')
        })

        return message.reply('Ok, você mandou uma imagem!');
    }

    return message.reply('Você não mandou uma imagem!');
  }
}