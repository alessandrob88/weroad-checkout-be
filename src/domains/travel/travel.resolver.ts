import { PaginationResponse } from '../../shared/types/paginationResponse.type';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { PaginatedTravelResponse } from './models/paginated-travel-response';

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
  @Query(() => PaginatedTravelResponse)
  async getAllTravels(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Number, defaultValue: 10 })
    pageSize: number,
  ): Promise<PaginationResponse<Travel>> {
    return this.travelService.getAllTravels(page, pageSize);
  }

  /**
   * Resolver to retrieve a travel entity by its unique identifier.
   *
   * @param id Travel entity unique identifier
   * @returns A promise that resolves to the travel entity if found,
   * null otherwise.
   */
  @Query(() => Travel)
  async getTravelById(@Args('id') id: string): Promise<Travel> {
    return this.travelService.getTravelById(id);
  }

  /**
   * Mutation to increase the available seats for a travel entity.
   *
   * @param id Travel entity unique identifier.
   * @param seats The number of seats to increase.
   * @returns A promise that resolves to the updated travel entity.
   */
  @Mutation(() => Travel)
  async increaseAvailableSeats(
    @Args('id') id: string,
    @Args('seats', { type: () => Number }) seats: number,
  ): Promise<Travel> {
    return this.travelService.increaseAvailableSeats(id, seats);
  }

  /**
   * Mutation to decrease the available seats for a travel entity.
   *
   * @param id Travel entity unique identifier.
   * @param seats The number of seats to decrease.
   * @returns A promise that resolves to the updated travel entity.
   */
  @Mutation(() => Travel)
  async decreaseAvailableSeats(
    @Args('id') id: string,
    @Args('seats', { type: () => Number }) seats: number,
  ): Promise<Travel> {
    return this.travelService.decreaseAvailableSeats(id, seats);
  }
}