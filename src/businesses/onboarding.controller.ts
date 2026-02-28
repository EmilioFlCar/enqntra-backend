import { Body, Controller, Param, Patch } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingStepDto } from './dto/onboarding-step.dto';

@Controller('businesses')
export class OnboardingController {
    constructor(private onboardingService: OnboardingService) {}

    @Patch(':id/onboarding')
    advanceOnboarding(
        @Param('id') id: string,
        @Body() body: OnboardingStepDto,
    ) {
        return this.onboardingService.advanceOnboarding(id, body.step, body.data);
    }
}
