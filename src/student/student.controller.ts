import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('student')
export class StudentController {
         constructor(private readonly firebaseService: FirebaseService) {}

  // @Post('save-token')
  // async saveDeviceToken(@Body() body: { registrationId: string, token: string }) {
  //   const { registrationId, token } = body;
  //   await this.firebaseService.saveDeviceToken(registrationId, token);
  //   return { message: 'Token saved successfully' };
  // }
  @Post('save-token')
  async saveDeviceToken(@Body() body: { docId: string; token: string }) {
    const { docId, token } = body;
    await this.firebaseService.saveDeviceToken('students', docId, token);
    return { message: 'Token saved successfully for student' };
  }
}
