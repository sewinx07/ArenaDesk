import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('password123', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@arenadesk.com' },
    update: {},
    create: { name: 'Alex Owner', email: 'owner@arenadesk.com', passwordHash, role: 'owner' },
  });

  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@arenadesk.com' },
    update: {},
    create: { name: 'John Staff', email: 'staff1@arenadesk.com', passwordHash, role: 'staff' },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@arenadesk.com' },
    update: {},
    create: { name: 'Jane Staff', email: 'staff2@arenadesk.com', passwordHash, role: 'staff' },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: { name: 'Bob Smith', email: 'customer1@example.com', passwordHash, role: 'customer' },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: { name: 'Alice Johnson', email: 'customer2@example.com', passwordHash, role: 'customer' },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: 'customer3@example.com' },
    update: {},
    create: { name: 'Charlie Brown', email: 'customer3@example.com', passwordHash, role: 'customer' },
  });

  const cafe = await prisma.cafe.create({
    data: { name: 'ArenaDesk Downtown', location: '123 Gaming Street', ownerId: owner.id },
  });

  await prisma.cafe.update({ where: { id: cafe.id }, data: { staff: { connect: [{ id: staff1.id }, { id: staff2.id }] } } });

  const pcs = await Promise.all([
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-01', hourlyRate: 5.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-02', hourlyRate: 5.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-03', hourlyRate: 5.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-04', hourlyRate: 8.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-05', hourlyRate: 8.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-06', hourlyRate: 4.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-07', hourlyRate: 4.00 } }),
    prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-08', hourlyRate: 6.00 } }),
  ]);

  const activeSessions = await Promise.all([
    prisma.session.create({ data: { pcId: pcs[0].id, userId: customer1.id, startTime: new Date(Date.now() - 30 * 60000), status: 'active' } }),
    prisma.session.create({ data: { pcId: pcs[1].id, userId: customer2.id, startTime: new Date(Date.now() - 60 * 60000), status: 'active' } }),
    prisma.session.create({ data: { pcId: pcs[3].id, userId: customer3.id, startTime: new Date(Date.now() - 15 * 60000), status: 'active' } }),
    prisma.session.create({ data: { pcId: pcs[4].id, userId: customer1.id, startTime: new Date(Date.now() - 120 * 60000), status: 'active' } }),
    prisma.session.create({ data: { pcId: pcs[5].id, userId: customer2.id, startTime: new Date(Date.now() - 45 * 60000), status: 'active' } }),
  ]);

  await Promise.all([
    prisma.pC.update({ where: { id: pcs[0].id }, data: { status: 'in_use' } }),
    prisma.pC.update({ where: { id: pcs[1].id }, data: { status: 'in_use' } }),
    prisma.pC.update({ where: { id: pcs[3].id }, data: { status: 'in_use' } }),
    prisma.pC.update({ where: { id: pcs[4].id }, data: { status: 'in_use' } }),
    prisma.pC.update({ where: { id: pcs[5].id }, data: { status: 'in_use' } }),
  ]);

  const completedSession = await prisma.session.create({
    data: {
      pcId: pcs[2].id, userId: customer3.id,
      startTime: new Date(Date.now() - 3 * 3600000),
      endTime: new Date(Date.now() - 2 * 3600000),
      totalPrice: 5.00, status: 'completed',
    },
  });

  const tomorrow = new Date(Date.now() + 24 * 3600000);
  await Promise.all([
    prisma.reservation.create({ data: { userId: customer1.id, pcId: pcs[6].id, startTime: new Date(tomorrow.getTime() + 10 * 3600000), endTime: new Date(tomorrow.getTime() + 12 * 3600000), status: 'confirmed' } }),
    prisma.reservation.create({ data: { userId: customer2.id, pcId: pcs[7].id, startTime: new Date(tomorrow.getTime() + 14 * 3600000), endTime: new Date(tomorrow.getTime() + 16 * 3600000), status: 'pending' } }),
    prisma.reservation.create({ data: { userId: customer3.id, pcId: pcs[2].id, startTime: new Date(tomorrow.getTime() + 18 * 3600000), endTime: new Date(tomorrow.getTime() + 20 * 3600000), status: 'confirmed' } }),
  ]);

  const txnData = [
    { sessionId: completedSession.id, userId: customer3.id, amount: 5.00, paymentMethod: 'cash' },
  ];

  for (const txn of txnData) {
    await prisma.transaction.create({ data: txn });
  }

  for (const session of activeSessions) {
    await prisma.auditLog.create({
      data: { userId: session.userId, cafeId: cafe.id, action: 'session_started', details: { sessionId: session.id, pcId: session.pcId } },
    });
  }

  await prisma.auditLog.create({
    data: { userId: customer3.id, cafeId: cafe.id, action: 'session_ended', details: { sessionId: completedSession.id, totalPrice: 5.00, durationHours: 1 } },
  });

  const tournament = await prisma.tournament.create({
    data: { cafeId: cafe.id, name: 'Weekend Valorant Cup', game: 'Valorant', status: 'registration' },
  });

  const tournamentUsers = [customer1, customer2, customer3, owner];
  for (let i = 0; i < tournamentUsers.length; i++) {
    await prisma.tournamentParticipant.create({
      data: { tournamentId: tournament.id, userId: tournamentUsers[i].id, teamName: `Team ${i + 1}` },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error('Seeding failed:', e); await prisma.$disconnect(); process.exit(1); });
