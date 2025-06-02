
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
    private firestore: admin.firestore.Firestore;
  constructor(private configService: ConfigService) {
    const configPath = this.configService.get<string>('FIREBASE_CONFIG_PATH');

    if (!configPath) {
      throw new Error('FIREBASE_CONFIG_PATH is not defined in the environment variables.');
    }

    const fullPath = path.resolve(__dirname, configPath);

    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
       this.firestore = admin.firestore();
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    try {
      return await admin.messaging().send(message);
    } catch (error) {
      if (error.code === 'messaging/registration-token-not-registered') {
        console.warn('FCM token not registered:', token);
      }
      throw error;
    }
  }

  // New one Save devide Token
//    async saveDeviceToken(registrationId: string, token: string): Promise<void> {
//   const snapshot = await this.firestore
//     .collection('students')
//     .where('registrationId', '==', registrationId)
//     .get();

//   if (snapshot.empty) {
//     throw new Error('Student not found');
//   }

//   const studentRef = snapshot.docs[0].id.ref;

//   await studentRef.update({
//     deviceTokens: admin.firestore.FieldValue.arrayUnion(token)
//   });
// }
async saveDeviceToken(
  collection: 'students' | 'laundry_manager', 
  docId: string, 
  token: string
): Promise<void> {
  const docRef = this.firestore.collection(collection).doc(docId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error(`${collection.slice(0, -1)} not found`); // 'student' or 'manager'
  }

  await docRef.update({
    // deviceTokens: admin.firestore.FieldValue.arrayUnion(token),
     deviceToken: token
  });
}


}
