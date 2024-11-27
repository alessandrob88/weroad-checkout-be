import { PaginationResponse } from '../../shared/types/paginationResponse.type';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { PaginatedTravelGraphQL } from './models/paginated-travel.model';
import { TravelGraphQL } from './models/travel.model';

@Resolver(() => Travel)
export class TravelResolver {
  constructor(private travelService: TravelService) {}

  /**
   * Resolver to get a paginated list of Travel entities.
   *
   * @param page The page number to return (1-indexed).
   * @param pageSize The number of items per page.
   * @returns A promise that resolves to a PaginationResponse containing the
   * list of travels, along with the total number of items, the current page
   * number, the page size, and the total number of pages.
   */
  @Query(() => PaginatedTravelGraphQL)
  async getAllTravels(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Number, defaultValue: 10 })
    pageSize: number,
  ): Promise<PaginationResponse<TravelGraphQL>> {
    return this.travelService.getAllTravels(page, pageSize);
  }

  /**
   * Resolver to retrieve a travel entity by its unique identifier.
   *
   * @param id Travel entity unique identifier
   * @returns A promise that resolves to the travel entity if found
   * @throws NotFoundException if not found
   */
  @Query(() => TravelGraphQL)
  async getTravelById(@Args('id') id: string): Promise<Travel> {
    return this.travelService.getTravelById(id);
  }

  /**
   * Resolver to retrieve a travel entity by its slug.
   *
   * @param slug Travel entity slug
   * @returns A promise that resolves to the travel entity if found
   * @throws NotFoundException if not found
   */
  @Query(() => TravelGraphQL)
  async getTravelBySlug(@Args('slug') slug: string): Promise<Travel> {
    return this.travelService.getTravelBySlug(slug);
  }
}
