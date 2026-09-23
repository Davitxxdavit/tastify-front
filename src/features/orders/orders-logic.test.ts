import { describe, expect, it } from 'vitest';
import { makeOrder } from '../../test/fixtures';
import { orderSchema } from './types';
import { buildTimeline } from './timeline';
import { applyStatusUpdate, statusFromEvent } from './realtime';

const order = orderSchema.parse(makeOrder());
const at = (hh: string) => `2026-09-20T${hh}:00.000Z`;
const history = (...entries: [string, string][]) => entries.map(([status, time], i) => ({ id: `h${i}`, orderId: order.id, status, changedAt: at(time), changedBy: null, notes: null }));

describe('buildTimeline', () => {
    it('marks earlier steps done, the current one current and the rest upcoming', () => {
        const timeline = buildTimeline(orderSchema.parse(makeOrder({ status: 'READY', statusHistory: history(['READY', '10:20'], ['PREPARING', '10:05'], ['PENDING', '10:00']) })));
        expect(timeline.map((s) => [s.status, s.state, s.at])).toEqual([
            ['PENDING', 'done', at('10:00')],
            ['PREPARING', 'done', at('10:05')],
            ['READY', 'current', at('10:20')],
            ['DELIVERING', 'upcoming', null],
            ['COMPLETED', 'upcoming', null],
        ]);
    });

    it('shows a completed order as fully done', () => {
        const timeline = buildTimeline({ ...order, status: 'COMPLETED' });
        expect(timeline.every((s) => s.state === 'done')).toBe(true);
    });

    it('ends a cancelled order at the cancellation', () => {
        const timeline = buildTimeline(orderSchema.parse(makeOrder({ status: 'CANCELLED', statusHistory: history(['CANCELLED', '10:03'], ['PENDING', '10:00']) })));
        expect(timeline.map((s) => [s.status, s.state])).toEqual([
            ['PENDING', 'done'],
            ['CANCELLED', 'current'],
        ]);
    });
});

describe('realtime status events', () => {
    it('reads the status from order_updated and fixed-status events', () => {
        expect(statusFromEvent('order_updated', { orderId: order.id, status: 'PREPARING' })).toBe('PREPARING');
        expect(statusFromEvent('order_completed', { orderId: order.id })).toBe('COMPLETED');
        expect(statusFromEvent('order_updated', { orderId: order.id, status: 'NOT_A_STATUS' })).toBeNull();
    });

    it('patches a cached order and adds a history entry for the timeline', () => {
        const updated = applyStatusUpdate(order, 'PREPARING', at('10:07'));
        expect(updated.status).toBe('PREPARING');
        expect(updated.statusHistory?.[0]).toMatchObject({ status: 'PREPARING', changedAt: at('10:07') });
        expect(applyStatusUpdate(order, 'PENDING', at('10:07'))).toBe(order);
    });
});
