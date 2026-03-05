import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateScheduleDto } from './update-schedule.dto';

export class BatchUpdateSchedulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScheduleDto)
  schedules: UpdateScheduleDto[];
}
