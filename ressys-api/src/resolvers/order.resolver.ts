import { GraphQLError } from 'graphql';
import _ from 'lodash';
import moment from 'moment';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ROLE_ADMIN } from '../common/constants';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';
import { Context } from '../types';
import { OrderFilterInput } from './types/orderFilter.input';
import { PlaceOrderInput } from './types/placeOrder.input';
import { UpdateOrderInput } from './types/updateOrder.input';

@Resolver()
export class OrderResolver {
  constructor(private orderService: OrderService) {
    this.orderService = new OrderService();
  }

  @Authorized()
  @Query(() => [Order])
  async orders(
    @Ctx() { user }: Context,
    @Arg('filter', () => OrderFilterInput, { nullable: true })
    filter?: OrderFilterInput
  ): Promise<Order[]> {
    return this.orderService.find(user!, filter);
  }

  @Mutation(() => Order)
  async placeOrder(
    @Arg('order', () => PlaceOrderInput) order: PlaceOrderInput,
    @Ctx() { user }: Context
  ): Promise<Order> {
    if (moment(order.expectedArrivalTime).isBefore(moment())) {
      throw new GraphQLError('Expected arrival time must be in the future');
    }

    return this.orderService.create(order, user);
  }

  @Mutation(() => Order)
  @Authorized()
  async updateOrder(
    @Arg('order', () => UpdateOrderInput) order: UpdateOrderInput,
    @Ctx() { user }: Context
  ): Promise<Order> {
    if (order.expectedArrivalTime) {
      if (moment(order.expectedArrivalTime).isBefore(moment())) {
        throw new GraphQLError('Expected arrival time must be in the future');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = order;
    if (_.values(rest).every((value) => value == null)) {
      throw new GraphQLError('At least one field needs to be updated');
    }

    return this.orderService.update(order, user!);
  }

  @Mutation(() => String, { nullable: true })
  @Authorized(ROLE_ADMIN)
  async confirmOrder(
    @Arg('id', () => String) id: string,
    @Ctx() { user }: Context
  ): Promise<string | null> {
    return this.orderService.confirm(id, user!);
  }

  @Mutation(() => String, { nullable: true })
  @Authorized(ROLE_ADMIN)
  async completeOrder(
    @Arg('id', () => String) id: string,
    @Ctx() { user }: Context
  ): Promise<string | null> {
    return this.orderService.complete(id, user!);
  }

  @Mutation(() => String, { nullable: true })
  @Authorized()
  async cancelOrder(
    @Arg('id', () => String) id: string,
    @Ctx() { user }: Context
  ): Promise<string | null> {
    return this.orderService.cancel(id, user!);
  }
}
