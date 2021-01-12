import Ticket from '../Ticket';

it('implement optimistic concurrency control', async (done) => {
  // create an instance on ticket
  const ticket = Ticket.build({ title: 'title', price: 45, userId: '465' });

  // save the ticket on database
  await ticket.save();

  // fetch the ticket twice
  const firstCall = await Ticket.findById(ticket.id);
  const secondCall = await Ticket.findById(ticket.id);

  // make two separate changes
  firstCall!.set({ price: 10 });
  secondCall!.set({ price: 15 });

  // save the first fetched ticket
  await firstCall?.save();

  // save the second fetched ticket and [it should get erorr 🙏]
  try {
    await secondCall?.save();
  } catch (err) {
    return done();
  }

  throw new Error(' Error here 👋');
});

it('icrements the version number on update a ticket', async () => {
  const ticket = Ticket.build({ title: 'title', price: 45, userId: '465' });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
