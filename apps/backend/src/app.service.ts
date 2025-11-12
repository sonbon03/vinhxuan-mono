import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Vinh Xuan CMS API is running! 🚀';
  }
}
