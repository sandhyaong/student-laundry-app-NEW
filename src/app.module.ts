import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FirebaseModule,  
    ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [AppController, NotificationsController],
  providers: [AppService, FirebaseService, NotificationsService],
})
export class AppModule {}
