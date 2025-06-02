import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('order-created')
  async sendOrderCreatedNotification(@Body() body: { token: string; orderId: string }) {
    return this.notificationsService.notifyOrderCreated(body.token, body.orderId);
  }
}
