import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('manager')
export class ManagerController {
     constructor(private readonly firebaseService: FirebaseService) {}

  @Post('save-token')
  async saveDeviceToken(@Body() body: { docId: string; token: string }) {
    const { docId, token } = body;
    await this.firebaseService.saveDeviceToken('laundry_manager', docId, token);
    return { message: 'Token saved successfully for manager' };
  }
}
