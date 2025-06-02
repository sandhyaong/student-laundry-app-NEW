import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NotificationsService {
  constructor(private firebaseService: FirebaseService) {}

  async notifyOrderCreated(studentToken: string, orderId: string) {
    const title = 'Order Created';
    const body = `Your laundry order #${orderId} has been created.`;
    return this.firebaseService.sendNotification(studentToken, title, body);
  }
}


