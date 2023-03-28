import { GraphQLError } from 'graphql';
import { ROLE_ADMIN } from '../common/constants';
import { Order, OrderModel, OrderStatus } from '../models/order.model';
import { User } from '../models/user.model';
import { OrderFilterInput } from '../resolvers/types/orderFilter.input';
import { PlaceOrderInput } from '../resolvers/types/placeOrder.input';
import { UpdateOrderInput } from '../resolvers/types/updateOrder.input';
import { OrderFilterData } from '../types';

export class OrderService {
  create(orderData: PlaceOrderInput, user?: User): Promise<Order> {
    return OrderModel.create({
      ...orderData,
      user: user
        ? {
            ...user,
            _id: user?._id.toString(),
          }
        : null,
    }).then((order) => order.populate('user'));
  }

  async update(orderData: UpdateOrderInput, user: User): Promise<Order> {
    const { _id, ...rest } = orderData;
    const filterData: OrderFilterData = { _id };

    if (user.role !== ROLE_ADMIN) {
      filterData.user = { _id: user._id.toString() };
    }

    const order = await OrderModel.findOne(filterData).lean();

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    if (user.role !== ROLE_ADMIN) {
      if (order.status === OrderStatus.Completed) {
        throw new GraphQLError('Order is already completed');
      } else if (order.status === OrderStatus.Cancelled) {
        throw new GraphQLError('Order is already cancelled');
      } else if (order.status === OrderStatus.Confirmed) {
        throw new GraphQLError('Order is already confirmed');
      }
    }

    return OrderModel.findByIdAndUpdate(order._id, rest, {
      new: true,
    }).then((res) => res!.populate('user'));
  }

  find(user: User, filter?: OrderFilterInput): Promise<Order[]> {
    const filterData: OrderFilterData = {};

    if (filter?.startTime && filter?.endTime) {
      filterData.expectedArrivalTime = {
        $gte: filter.startTime,
        $lte: filter.endTime,
      };
    } else if (filter?.startTime) {
      filterData.expectedArrivalTime = {
        $gte: filter.startTime,
      };
    } else if (filter?.endTime) {
      filterData.expectedArrivalTime = {
        $lte: filter.endTime,
      };
    }

    if (filter?.status) {
      filterData.status = filter.status;
    }

    if (user.role !== ROLE_ADMIN || !filter?.all) {
      filterData.user = { _id: user._id.toString() };
    }

    return OrderModel.find(filterData).populate('user').sort({
      expectedArrivalTime: -1,
    });
  }

  async confirm(id: string, user: User): Promise<string | null> {
    return this.updateStatus(id, OrderStatus.Confirmed, user, (status) => {
      if (status === OrderStatus.Completed) {
        throw new GraphQLError('Order is already completed');
      } else if (status === OrderStatus.Cancelled) {
        throw new GraphQLError('Order is already cancelled');
      } else if (status === OrderStatus.Confirmed) {
        throw new GraphQLError('Order is already confirmed');
      }
    });
  }

  complete(id: string, user: User): Promise<string | null> {
    return this.updateStatus(id, OrderStatus.Completed, user, (status) => {
      if (status === OrderStatus.Completed) {
        throw new GraphQLError('Order is already completed');
      } else if (status === OrderStatus.Cancelled) {
        throw new GraphQLError('Order is already cancelled');
      } else if (status === OrderStatus.Pending) {
        throw new GraphQLError('Order is not confirmed');
      }
    });
  }

  cancel(id: string, user: User): Promise<string | null> {
    return this.updateStatus(id, OrderStatus.Cancelled, user, (status) => {
      if (status === OrderStatus.Completed) {
        throw new GraphQLError('Order is already completed');
      } else if (status === OrderStatus.Cancelled) {
        throw new GraphQLError('Order is already cancelled');
      } else if (status === OrderStatus.Confirmed && user.role !== ROLE_ADMIN) {
        throw new GraphQLError('Order is already confirmed');
      }
    });
  }

  private async updateStatus(
    id: string,
    status: OrderStatus,
    user: User,
    validate: (status: OrderStatus) => void
  ): Promise<string | null> {
    const filterData: OrderFilterData = { _id: id };

    if (user.role !== ROLE_ADMIN) {
      filterData.user = { _id: user._id.toString() };
    }

    const order = await OrderModel.findOne(filterData).lean();

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    validate(order.status);

    return OrderModel.updateOne(filterData, {
      $set: { status },
    }).then((res) => (res.modifiedCount === 1 ? id : null));
  }
}
