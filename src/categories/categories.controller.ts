import { Controller, Get } from '@nestjs/common';
import { CategoriesService, CategoryNode } from './categories.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Public()
    @Get()
    async getCategories(): Promise<CategoryNode[]> {
        return this.categoriesService.getCategories();
    }

}
