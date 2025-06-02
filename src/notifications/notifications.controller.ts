import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('order-created')
  async sendOrderCreatedNotification(@Body() body: { token: string; orderId: string }) {
    return this.notificationsService.notifyOrderCreated(body.token, body.orderId);
  }
@Post('order-status')
async notifyOrderStatus(
  @Body()
  body: {
    orderId: string;
    status: 'Accepted' | 'Reverted' | 'Ready';
    managerId: string;
  }
) {
  try {
    const result = await this.notificationsService.notifyOrderStatus(
      body.orderId,
      body.status,
      body.managerId,
    );
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


}
