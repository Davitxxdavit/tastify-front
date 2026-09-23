#!/usr/bin/env node
/**
 * Plays the restaurant side of the demo, since the web app has no staff UI.
 * Signs in as the seeded kitchen account and, for the customer's latest active order:
 *
 *   npm run demo:kitchen                    advance it through every status (5 s apart)
 *   npm run demo:kitchen -- --say "Hello"   send a chat message as the kitchen
 *   npm run demo:kitchen -- --order <id>    target a specific order
 *
 * Status changes go through PATCH /orders/:id/status, which emits `order_updated`
 * to the order's Socket.IO room. Chat goes over the /chat socket so the customer
 * receives it live.
 */
import { io } from 'socket.io-client';

const ORIGIN = process.env.VITE_API_ORIGIN ?? 'http://localhost:3000';
const API = `${ORIGIN}/api/v1`;
const STAFF = { phone: process.env.KITCHEN_PHONE ?? '555000002', password: process.env.KITCHEN_PASSWORD ?? 'kitchen123' };
const FLOW = ['PENDING', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'];
const STEP_DELAY_MS = 5000;

const args = process.argv.slice(2);
const option = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, { method = 'GET', body, token } = {}) {
    const response = await fetch(`${API}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: body && JSON.stringify(body),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(json.message)}`);
    return json.data;
}

async function sendChat(token, orderId, message) {
    const socket = io(`${ORIGIN}/chat`, { auth: { token }, transports: ['websocket'], extraHeaders: { Origin: 'http://localhost:5173' } });
    await new Promise((resolve, reject) => {
        socket.once('connect', resolve);
        socket.once('connect_error', reject);
    });
    try {
        // The gateway authenticates right after the handshake; retry briefly
        for (let attempt = 0; attempt < 5; attempt++) {
            const ack = await socket.timeout(5000).emitWithAck('send_chat_message', { orderId, message });
            if (ack?.success) return;
            if (ack?.error !== 'Unauthorized') throw new Error(ack?.error ?? 'Message not delivered');
            await sleep(300);
        }
        throw new Error('Chat gateway never authenticated the connection');
    } finally {
        socket.close();
    }
}

try {
    const { accessToken: token } = await request('/auth/staff/login', { method: 'POST', body: STAFF });

    // GET /orders/:id only returns the caller's own orders, so staff read from the admin list
    const orders = await request('/orders/admin/all?limit=50', { token });
    const wanted = option('--order');
    const order = wanted
        ? orders.find((o) => o.id === wanted)
        : orders.find((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));
    if (!order) {
        throw new Error(wanted ? `Order ${wanted} not found.` : 'No active order found. Place an order in the web app first.');
    }
    const orderId = order.id;
    console.log(`Order #${orderId.slice(0, 8)} (${order.status})`);

    const say = option('--say');
    if (say) {
        await sendChat(token, orderId, say);
        console.log(`Kitchen: ${say}`);
        process.exit(0);
    }

    const current = order.status;
    const remaining = FLOW.slice(FLOW.indexOf(current) + 1);
    if (remaining.length === 0) throw new Error(`Order is already ${current}.`);

    await sendChat(token, orderId, "Thanks for your order! We're starting on it now.");
    console.log("Kitchen: Thanks for your order! We're starting on it now.");

    for (const status of remaining) {
        await sleep(STEP_DELAY_MS);
        await request(`/orders/${orderId}/status`, { method: 'PATCH', body: { status }, token });
        console.log(`→ ${status}`);
    }
    process.exit(0);
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
