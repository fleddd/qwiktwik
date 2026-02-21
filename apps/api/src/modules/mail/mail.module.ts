import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
    providers: [MailService],
    exports: [MailService], // Експортуємо, щоб інші модулі могли його юзати
})
export class MailModule { }