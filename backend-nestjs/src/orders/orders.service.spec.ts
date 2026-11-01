import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { DataSource } from 'typeorm';

jest.unstable_mockModule('../entities/order.entity', () => ({
  Order: class Order {},
  OrderStatus: { PENDING: 'PENDING', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' },
  OrderType: { EAT_IN: 'EAT_IN', TAKE_AWAY: 'TAKE_AWAY' },
  PaymentMethod: { CASH: 'CASH', TRANSFER: 'TRANSFER' },
}));
jest.unstable_mockModule('../entities/order-item.entity', () => ({
  OrderItem: class OrderItem {},
}));
jest.unstable_mockModule('../entities/product.entity', () => ({
  Product: class Product {},
}));

const {
  calculateChange,
  calculateOrderTotal,
  OrdersService,
} = await import('./orders.service');

describe('OrdersService nghiệp vụ thanh toán', () => {
  it('tính tổng tiền từ đơn giá và số lượng bằng số tiền độc lập đã biết', () => {
    expect(
      calculateOrderTotal([
        { price: '15.00', quantity: 2 },
        { price: '12.50', quantity: 1 },
      ]),
    ).toBe('42.50');
  });

  it('tính tiền thừa bằng tiền khách đưa trừ tổng tiền', () => {
    expect(calculateChange(42000, 50000)).toBe(8000);
  });

  it('không trả tiền thừa âm khi khách đưa chưa đủ', () => {
    expect(calculateChange(42000, 40000)).toBe(0);
  });

  it('ném lỗi khi giỏ hàng trống trước khi mở giao dịch', async () => {
    const dataSource = {
      transaction: jest.fn(),
    } as unknown as DataSource;
    const service = new OrdersService(dataSource);
    const order = {
      order_type: 'EAT_IN',
      payment_method: 'CASH',
      items: [],
    };

    await expect(service.create(1, order)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('cấp mã đơn tiếp theo trong ngày và lưu tổng tiền đã tính', async () => {
    const savedOrder = {
      id: 8,
      orderNumber: 4,
      totalAmount: '42.50',
      status: 'PENDING',
    };
    const productQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      setLock: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        { id: 1, name: 'Bánh mì', price: '15.00', isAvailable: true },
        { id: 2, name: 'Nước', price: '12.50', isAvailable: true },
      ]),
    };
    const orderQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ next: '4' }),
    };
    const orderRepository = {
      create: jest.fn((value: object) => value),
      save: jest.fn().mockResolvedValue(savedOrder),
      createQueryBuilder: jest.fn().mockReturnValue(orderQueryBuilder),
    };
    const itemRepository = {
      create: jest.fn((value: object) => value),
      save: jest.fn().mockResolvedValue([]),
    };
    const manager = {
      getRepository: jest.fn((entity: unknown) => {
        const repositoryName = typeof entity === 'function' ? entity.name : '';
        if (repositoryName === 'Order') return orderRepository;
        if (repositoryName === 'OrderItem') return itemRepository;
        return { createQueryBuilder: jest.fn().mockReturnValue(productQueryBuilder) };
      }),
    };
    const dataSource = {
      transaction: jest.fn(async (callback: (value: typeof manager) => Promise<object>) =>
        callback(manager),
      ),
    } as unknown as DataSource;
    const service = new OrdersService(dataSource);

    await service.create(1, {
      order_type: 'EAT_IN',
      payment_method: 'CASH',
      items: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 1 },
      ],
    });

    expect(orderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ orderNumber: 4, totalAmount: '42.50' }),
    );
  });
});
