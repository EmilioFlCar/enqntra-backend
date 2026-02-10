import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Public()
    @Get()
    getCategories() {
        return this.categoriesService.getCategories();
    }
}
