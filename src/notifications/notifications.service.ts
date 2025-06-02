import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
   private firestore = admin.firestore();
  constructor(private firebaseService: FirebaseService) {}

  async notifyOrderCreated(studentToken: string, orderId: string) {
    const title = 'Order Created';
    const body = `Your laundry order #${orderId} has been created.`;
    // return this.firebaseService.sendNotification(studentToken, title, body);
      const messageId = await this.firebaseService.sendNotification(studentToken, title, body);
  return { success: true, messageId, message: 'Notification sent successfully.' };
  }

async notifyOrderStatus(
  orderId: string,
  status: 'Accepted' | 'Reverted' | 'Ready',
  managerId: string
) {
  const orderSnap = await this.firestore
    .collection('orders')
    .where('orderId', '==', orderId)
    .get();

  if (orderSnap.empty) {
    throw new Error(`No order found with orderId ${orderId}`);
  }

  const orderData = orderSnap.docs[0].data();
  const studentID = orderData.studentID;

  const studentRef = await this.firestore.collection('students').doc(studentID).get();
  const studentData = studentRef.data();

  if (!studentData || !studentData.deviceTokens) {
    throw new Error(`No deviceTokens found for student ID ${studentID}`);
  }

  const tokens = Array.isArray(studentData.deviceTokens)
    ? studentData.deviceTokens
    : [studentData.deviceTokens];

  if (tokens.length === 0) {
    throw new Error(`Device token list is empty for student ID ${studentID}`);
  }

  const title = `Order ${status}`;
  const body = `Your laundry order #${orderId} has been ${status.toLowerCase()}.`;

  const results: {
    token: string;
    success: boolean;
    response?: string;
    error?: string;
    managerId: string;
    studentId: string;
  }[] = [];

  for (const token of tokens) {
    try {
      const response = await this.firebaseService.sendNotification(token, title, body);
      results.push({
        token,
        success: true,
        response,
        managerId,
        studentId: studentID,
      });
    } catch (error: any) {
      results.push({
        token,
        success: false,
        error: error.message,
        managerId,
        studentId: studentID,
      });
    }
  }

  return {
    success: true,
    results,
    message: `Notification for ${status} attempted for ${tokens.length} device(s).`,
  };
}

}


