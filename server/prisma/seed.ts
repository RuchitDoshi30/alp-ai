import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Venue ─────────────────────────────────
  const venue = await prisma.venue.create({
    data: {
      name: 'Wankhede Stadium',
      city: 'Mumbai',
      capacity: 33000,
      lat: 18.9388,
      lng: 72.8258,
      sportType: 'cricket',
    },
  });
  console.log('✅ Venue created:', venue.name);

  // ─── Create Crowd Zones ──────────────────────────
  const zones = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
  for (const name of zones) {
    await prisma.crowdZone.create({
      data: {
        venueId: venue.id,
        zoneName: name,
        density: Math.random() * 0.6 + 0.2,
        riskLevel: 'normal',
      },
    });
  }
  console.log('✅ Crowd zones created:', zones.length);

  // ─── Create Gates ────────────────────────────────
  const gateData = [
    { name: 'Gate A', direction: 'North Main', congestion: 0.45 },
    { name: 'Gate B', direction: 'East Side', congestion: 0.72 },
    { name: 'Gate C', direction: 'South Stand', congestion: 0.35 },
    { name: 'Gate D', direction: 'West Pavilion', congestion: 0.58 },
  ];
  for (const g of gateData) {
    await prisma.gate.create({
      data: { venueId: venue.id, ...g },
    });
  }
  console.log('✅ Gates created:', gateData.length);

  // ─── Create Event ────────────────────────────────
  const event = await prisma.event.create({
    data: {
      venueId: venue.id,
      title: 'MI vs CSK — IPL 2025',
      sport: 'cricket',
      homeTeamName: 'Mumbai Indians',
      homeTeamShort: 'MI',
      homeTeamLogo: '🏏',
      awayTeamName: 'Chennai Super Kings',
      awayTeamShort: 'CSK',
      awayTeamLogo: '🦁',
      homeScore: 186,
      awayScore: 142,
      period: '2nd Innings',
      status: 'live',
      startTime: new Date(),
    },
  });
  console.log('✅ Event created:', event.title);

  // ─── Create Users ────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);

  const attendee = await prisma.user.create({
    data: {
      email: 'attendee@venueiq.com',
      passwordHash,
      name: 'Ruchit Doshi',
      phone: '+91 98765 43210',
      role: 'attendee',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@venueiq.com',
      passwordHash,
      name: 'Staff Member',
      role: 'staff',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@venueiq.com',
      passwordHash,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✅ Users created: attendee, staff, admin');

  // ─── Create Ticket ───────────────────────────────
  await prisma.ticket.create({
    data: {
      userId: attendee.id,
      eventId: event.id,
      bookingRef: 'VIQ-2025-MI-CSK-001',
      section: 'B2',
      row: 'R12',
      seat: '18',
      gate: 'Gate D',
      qrCode: 'qr-viq-2025-001',
      status: 'valid',
    },
  });
  console.log('✅ Ticket created for attendee');

  // ─── Create Food Vendors ─────────────────────────
  const vendorData = [
    { name: 'Stadium Bites', location: 'Section A - Ground Floor', cuisineType: 'Fast Food' },
    { name: 'Chai & Snacks', location: 'Section B - Level 1', cuisineType: 'Indian Snacks' },
    { name: 'Pizza Corner', location: 'Section C - Ground Floor', cuisineType: 'Italian' },
    { name: 'Hydration Station', location: 'Section D - All Levels', cuisineType: 'Beverages' },
  ];

  const vendors = [];
  for (const v of vendorData) {
    const vendor = await prisma.foodVendor.create({
      data: { venueId: venue.id, ...v, isActive: true },
    });
    vendors.push(vendor);
  }
  console.log('✅ Food vendors created:', vendors.length);

  // ─── Create Menu Items ───────────────────────────
  const menuData: { vendorIdx: number; items: { name: string; price: number; category: string }[] }[] = [
    {
      vendorIdx: 0,
      items: [
        { name: 'Classic Burger', price: 249, category: 'Burgers' },
        { name: 'Cheese Loaded Fries', price: 179, category: 'Sides' },
        { name: 'Chicken Wings (6pc)', price: 329, category: 'Starters' },
        { name: 'Veg Wrap', price: 199, category: 'Wraps' },
        { name: 'Cold Coffee', price: 149, category: 'Beverages' },
      ],
    },
    {
      vendorIdx: 1,
      items: [
        { name: 'Masala Chai', price: 49, category: 'Beverages' },
        { name: 'Samosa (2pc)', price: 79, category: 'Snacks' },
        { name: 'Vada Pav', price: 59, category: 'Snacks' },
        { name: 'Pav Bhaji', price: 149, category: 'Main' },
        { name: 'Cutting Chai', price: 29, category: 'Beverages' },
      ],
    },
    {
      vendorIdx: 2,
      items: [
        { name: 'Margherita Pizza', price: 299, category: 'Pizza' },
        { name: 'Pepperoni Pizza', price: 399, category: 'Pizza' },
        { name: 'Garlic Bread', price: 149, category: 'Sides' },
        { name: 'Pasta Alfredo', price: 279, category: 'Pasta' },
      ],
    },
    {
      vendorIdx: 3,
      items: [
        { name: 'Water Bottle', price: 30, category: 'Water' },
        { name: 'Soft Drink', price: 60, category: 'Beverages' },
        { name: 'Energy Drink', price: 120, category: 'Beverages' },
        { name: 'Fresh Lime Soda', price: 89, category: 'Beverages' },
      ],
    },
  ];

  for (const group of menuData) {
    for (const item of group.items) {
      await prisma.menuItem.create({
        data: {
          vendorId: vendors[group.vendorIdx].id,
          name: item.name,
          price: item.price,
          category: item.category,
          isAvailable: true,
        },
      });
    }
  }
  console.log('✅ Menu items created');

  // ─── Create Queue Statuses ───────────────────────
  for (const vendor of vendors) {
    await prisma.queueStatus.create({
      data: {
        vendorId: vendor.id,
        eventId: event.id,
        waitMinutes: Math.floor(Math.random() * 15) + 2,
        queueLength: Math.floor(Math.random() * 30) + 5,
      },
    });
  }
  console.log('✅ Queue statuses created');

  // ─── Create Alerts ───────────────────────────────
  await prisma.alert.createMany({
    data: [
      {
        eventId: event.id,
        type: 'info',
        message: 'Welcome to Wankhede Stadium! MI vs CSK is live now.',
        priority: 'normal',
        isActive: true,
      },
      {
        eventId: event.id,
        type: 'crowd',
        message: 'Section A1 is reaching high density. Consider alternative routes.',
        priority: 'high',
        isActive: true,
      },
    ],
  });
  console.log('✅ Alerts created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('────────────────────────────────');
  console.log('Test accounts:');
  console.log('  Attendee: attendee@venueiq.com / password123');
  console.log('  Staff:    staff@venueiq.com / password123');
  console.log('  Admin:    admin@venueiq.com / password123');
  console.log('  Booking:  VIQ-2025-MI-CSK-001');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
