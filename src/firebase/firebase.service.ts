// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as admin from 'firebase-admin';
// import * as path from 'path';
// @Injectable()
// export class FirebaseService {
//   constructor(private configService: ConfigService) {
//     const serviceAccount = require(path.join(__dirname, './firebase-config.json'));
//     if (!admin.apps.length) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//       });
//     }
//   }

//   async sendNotification(token: string, title: string, body: string) {
//     const message = {
//       token,
//       notification: {
//         title,
//         body,
//       },
//     };
//     return admin.messaging().send(message);
//   }
// }
// Newwww
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
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
}
