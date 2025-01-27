import { Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { sentContactDto } from './contact.dto';
import { Body } from '@nestjs/common';

@ApiTags('Contact')
@Controller('/contact')
export class ContactController {
  @Inject(ContactService)
  private readonly contactService: ContactService;

  @Post('sent')
  async sentContact(@Body() body: sentContactDto) {
    return await this.contactService.sentContact(body);
  }
}
