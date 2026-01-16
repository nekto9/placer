import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

@Module({
  imports: [PrismaModule],
  controllers: [SportController],
  providers: [SportService],
  exports: [SportService],
})
export class SportModule {}
