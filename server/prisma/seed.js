const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.issueRequest.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bookMovie.deleteMany();
  await prisma.member.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.createMany({
    data: [
      { username: 'admin', password: adminPassword, name: 'Administrator', isActive: true, isAdmin: true },
      { username: 'user', password: userPassword, name: 'Regular User', isActive: true, isAdmin: false }
    ]
  });
  console.log('  ✓ Users created');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Science', codePrefix: 'SC' } }),
    prisma.category.create({ data: { name: 'Economics', codePrefix: 'EC' } }),
    prisma.category.create({ data: { name: 'Fiction', codePrefix: 'FC' } }),
    prisma.category.create({ data: { name: 'Children', codePrefix: 'CH' } }),
    prisma.category.create({ data: { name: 'Personal Development', codePrefix: 'PD' } })
  ]);
  console.log('  ✓ Categories created');

  const [science, economics, fiction, children, personalDev] = categories;

  // Create Books (4 per category = 20 books)
  const booksData = [
    // Science Books
    { serialNo: 'SCB000001', name: 'A Brief History of Time', authorName: 'Stephen Hawking', type: 'BOOK', categoryId: science.id, cost: 450, procurementDate: new Date('2024-01-15') },
    { serialNo: 'SCB000002', name: 'The Selfish Gene', authorName: 'Richard Dawkins', type: 'BOOK', categoryId: science.id, cost: 380, procurementDate: new Date('2024-02-10') },
    { serialNo: 'SCB000003', name: 'Cosmos', authorName: 'Carl Sagan', type: 'BOOK', categoryId: science.id, cost: 520, procurementDate: new Date('2024-03-05') },
    { serialNo: 'SCB000004', name: 'The Origin of Species', authorName: 'Charles Darwin', type: 'BOOK', categoryId: science.id, cost: 600, procurementDate: new Date('2024-01-20') },
    // Economics Books
    { serialNo: 'ECB000001', name: 'Wealth of Nations', authorName: 'Adam Smith', type: 'BOOK', categoryId: economics.id, cost: 550, procurementDate: new Date('2024-02-15') },
    { serialNo: 'ECB000002', name: 'Freakonomics', authorName: 'Steven Levitt', type: 'BOOK', categoryId: economics.id, cost: 350, procurementDate: new Date('2024-03-10') },
    { serialNo: 'ECB000003', name: 'Capital in the 21st Century', authorName: 'Thomas Piketty', type: 'BOOK', categoryId: economics.id, cost: 700, procurementDate: new Date('2024-01-25') },
    { serialNo: 'ECB000004', name: 'Thinking Fast and Slow', authorName: 'Daniel Kahneman', type: 'BOOK', categoryId: economics.id, cost: 480, procurementDate: new Date('2024-02-20') },
    // Fiction Books
    { serialNo: 'FCB000001', name: 'To Kill a Mockingbird', authorName: 'Harper Lee', type: 'BOOK', categoryId: fiction.id, cost: 320, procurementDate: new Date('2024-03-15') },
    { serialNo: 'FCB000002', name: '1984', authorName: 'George Orwell', type: 'BOOK', categoryId: fiction.id, cost: 280, procurementDate: new Date('2024-01-10') },
    { serialNo: 'FCB000003', name: 'Pride and Prejudice', authorName: 'Jane Austen', type: 'BOOK', categoryId: fiction.id, cost: 300, procurementDate: new Date('2024-02-05') },
    { serialNo: 'FCB000004', name: 'The Great Gatsby', authorName: 'F. Scott Fitzgerald', type: 'BOOK', categoryId: fiction.id, cost: 340, procurementDate: new Date('2024-03-20') },
    // Children Books
    { serialNo: 'CHB000001', name: 'Charlotte\'s Web', authorName: 'E.B. White', type: 'BOOK', categoryId: children.id, cost: 250, procurementDate: new Date('2024-01-05') },
    { serialNo: 'CHB000002', name: 'Harry Potter and the Sorcerer\'s Stone', authorName: 'J.K. Rowling', type: 'BOOK', categoryId: children.id, cost: 400, procurementDate: new Date('2024-02-25') },
    { serialNo: 'CHB000003', name: 'The Cat in the Hat', authorName: 'Dr. Seuss', type: 'BOOK', categoryId: children.id, cost: 200, procurementDate: new Date('2024-03-10') },
    { serialNo: 'CHB000004', name: 'Matilda', authorName: 'Roald Dahl', type: 'BOOK', categoryId: children.id, cost: 280, procurementDate: new Date('2024-01-15') },
    // Personal Development Books
    { serialNo: 'PDB000001', name: 'Atomic Habits', authorName: 'James Clear', type: 'BOOK', categoryId: personalDev.id, cost: 350, procurementDate: new Date('2024-02-10') },
    { serialNo: 'PDB000002', name: 'The 7 Habits of Highly Effective People', authorName: 'Stephen Covey', type: 'BOOK', categoryId: personalDev.id, cost: 420, procurementDate: new Date('2024-03-05') },
    { serialNo: 'PDB000003', name: 'How to Win Friends and Influence People', authorName: 'Dale Carnegie', type: 'BOOK', categoryId: personalDev.id, cost: 300, procurementDate: new Date('2024-01-20') },
    { serialNo: 'PDB000004', name: 'Rich Dad Poor Dad', authorName: 'Robert Kiyosaki', type: 'BOOK', categoryId: personalDev.id, cost: 380, procurementDate: new Date('2024-02-15') }
  ];

  // Create Movies (4 per category = 20 movies)
  const moviesData = [
    // Science Movies
    { serialNo: 'SCM000001', name: 'Interstellar', authorName: 'Christopher Nolan', type: 'MOVIE', categoryId: science.id, cost: 200, procurementDate: new Date('2024-01-10') },
    { serialNo: 'SCM000002', name: 'The Martian', authorName: 'Ridley Scott', type: 'MOVIE', categoryId: science.id, cost: 180, procurementDate: new Date('2024-02-05') },
    { serialNo: 'SCM000003', name: 'Gravity', authorName: 'Alfonso Cuaron', type: 'MOVIE', categoryId: science.id, cost: 220, procurementDate: new Date('2024-03-01') },
    { serialNo: 'SCM000004', name: 'Apollo 13', authorName: 'Ron Howard', type: 'MOVIE', categoryId: science.id, cost: 190, procurementDate: new Date('2024-01-25') },
    // Economics Movies
    { serialNo: 'ECM000001', name: 'The Big Short', authorName: 'Adam McKay', type: 'MOVIE', categoryId: economics.id, cost: 250, procurementDate: new Date('2024-02-20') },
    { serialNo: 'ECM000002', name: 'Wall Street', authorName: 'Oliver Stone', type: 'MOVIE', categoryId: economics.id, cost: 180, procurementDate: new Date('2024-03-15') },
    { serialNo: 'ECM000003', name: 'The Wolf of Wall Street', authorName: 'Martin Scorsese', type: 'MOVIE', categoryId: economics.id, cost: 280, procurementDate: new Date('2024-01-10') },
    { serialNo: 'ECM000004', name: 'Moneyball', authorName: 'Bennett Miller', type: 'MOVIE', categoryId: economics.id, cost: 200, procurementDate: new Date('2024-02-05') },
    // Fiction Movies
    { serialNo: 'FCM000001', name: 'The Shawshank Redemption', authorName: 'Frank Darabont', type: 'MOVIE', categoryId: fiction.id, cost: 150, procurementDate: new Date('2024-03-10') },
    { serialNo: 'FCM000002', name: 'Inception', authorName: 'Christopher Nolan', type: 'MOVIE', categoryId: fiction.id, cost: 300, procurementDate: new Date('2024-01-20') },
    { serialNo: 'FCM000003', name: 'The Lord of the Rings', authorName: 'Peter Jackson', type: 'MOVIE', categoryId: fiction.id, cost: 350, procurementDate: new Date('2024-02-15') },
    { serialNo: 'FCM000004', name: 'Fight Club', authorName: 'David Fincher', type: 'MOVIE', categoryId: fiction.id, cost: 200, procurementDate: new Date('2024-03-05') },
    // Children Movies
    { serialNo: 'CHM000001', name: 'Finding Nemo', authorName: 'Andrew Stanton', type: 'MOVIE', categoryId: children.id, cost: 180, procurementDate: new Date('2024-01-15') },
    { serialNo: 'CHM000002', name: 'Toy Story', authorName: 'John Lasseter', type: 'MOVIE', categoryId: children.id, cost: 200, procurementDate: new Date('2024-02-10') },
    { serialNo: 'CHM000003', name: 'The Lion King', authorName: 'Roger Allers', type: 'MOVIE', categoryId: children.id, cost: 220, procurementDate: new Date('2024-03-20') },
    { serialNo: 'CHM000004', name: 'Up', authorName: 'Pete Docter', type: 'MOVIE', categoryId: children.id, cost: 190, procurementDate: new Date('2024-01-05') },
    // Personal Development Movies
    { serialNo: 'PDM000001', name: 'The Pursuit of Happyness', authorName: 'Gabriele Muccino', type: 'MOVIE', categoryId: personalDev.id, cost: 250, procurementDate: new Date('2024-02-25') },
    { serialNo: 'PDM000002', name: 'The Social Network', authorName: 'David Fincher', type: 'MOVIE', categoryId: personalDev.id, cost: 220, procurementDate: new Date('2024-03-15') },
    { serialNo: 'PDM000003', name: 'Soul', authorName: 'Pete Docter', type: 'MOVIE', categoryId: personalDev.id, cost: 200, procurementDate: new Date('2024-01-10') },
    { serialNo: 'PDM000004', name: 'Dead Poets Society', authorName: 'Peter Weir', type: 'MOVIE', categoryId: personalDev.id, cost: 180, procurementDate: new Date('2024-02-05') }
  ];

  await prisma.bookMovie.createMany({ data: [...booksData, ...moviesData] });
  console.log('  ✓ Books & Movies created (40 items)');

  // Create Members
  const membersData = [
    { membershipId: 'MEM000001', firstName: 'Rahul', lastName: 'Sharma', contactNumber: '9876543210', contactAddress: '123 MG Road, Hyderabad', aadharCardNo: '1234-5678-9012', startDate: new Date('2024-01-01'), endDate: new Date('2024-07-01'), status: 'ACTIVE', pendingFine: 0 },
    { membershipId: 'MEM000002', firstName: 'Priya', lastName: 'Patel', contactNumber: '9876543211', contactAddress: '456 Tank Bund, Hyderabad', aadharCardNo: '2345-6789-0123', startDate: new Date('2024-02-15'), endDate: new Date('2025-02-15'), status: 'ACTIVE', pendingFine: 0 },
    { membershipId: 'MEM000003', firstName: 'Amit', lastName: 'Kumar', contactNumber: '9876543212', contactAddress: '789 Jubilee Hills, Hyderabad', aadharCardNo: '3456-7890-1234', startDate: new Date('2024-03-01'), endDate: new Date('2026-03-01'), status: 'ACTIVE', pendingFine: 0 },
    { membershipId: 'MEM000004', firstName: 'Sneha', lastName: 'Reddy', contactNumber: '9876543213', contactAddress: '321 Banjara Hills, Hyderabad', aadharCardNo: '4567-8901-2345', startDate: new Date('2023-06-01'), endDate: new Date('2024-06-01'), status: 'ACTIVE', pendingFine: 0 },
    { membershipId: 'MEM000005', firstName: 'Vikram', lastName: 'Singh', contactNumber: '9876543214', contactAddress: '654 Secunderabad, Hyderabad', aadharCardNo: '5678-9012-3456', startDate: new Date('2023-01-01'), endDate: new Date('2024-01-01'), status: 'INACTIVE', pendingFine: 25 }
  ];

  await prisma.member.createMany({ data: membersData });
  console.log('  ✓ Members created (5 members)');

  // Create some sample transactions
  const books = await prisma.bookMovie.findMany();
  const members = await prisma.member.findMany({ where: { status: 'ACTIVE' } });

  // Active issue - Rahul has "1984"
  const book1984 = books.find(b => b.name === '1984');
  if (book1984 && members[0]) {
    await prisma.transaction.create({
      data: {
        bookMovieId: book1984.id,
        memberId: members[0].id,
        issueDate: new Date('2026-04-10'),
        returnDate: new Date('2026-04-25'),
        status: 'ACTIVE'
      }
    });
    await prisma.bookMovie.update({
      where: { id: book1984.id },
      data: { status: 'ISSUED' }
    });
  }

  // Active issue - Priya has "Atomic Habits"
  const bookAtomic = books.find(b => b.name === 'Atomic Habits');
  if (bookAtomic && members[1]) {
    await prisma.transaction.create({
      data: {
        bookMovieId: bookAtomic.id,
        memberId: members[1].id,
        issueDate: new Date('2026-04-01'),
        returnDate: new Date('2026-04-16'),
        status: 'ACTIVE'
      }
    });
    await prisma.bookMovie.update({
      where: { id: bookAtomic.id },
      data: { status: 'ISSUED' }
    });
  }

  // Completed transaction - Amit returned "Cosmos" on time
  const bookCosmos = books.find(b => b.name === 'Cosmos');
  if (bookCosmos && members[2]) {
    await prisma.transaction.create({
      data: {
        bookMovieId: bookCosmos.id,
        memberId: members[2].id,
        issueDate: new Date('2026-03-01'),
        returnDate: new Date('2026-03-16'),
        actualReturnDate: new Date('2026-03-14'),
        fineCalculated: 0,
        finePaid: false,
        status: 'RETURNED'
      }
    });
  }

  // Issue request
  const bookGatsby = books.find(b => b.name === 'The Great Gatsby');
  if (bookGatsby && members[3]) {
    await prisma.issueRequest.create({
      data: {
        memberId: members[3].id,
        bookMovieId: bookGatsby.id,
        requestedDate: new Date('2026-04-15')
      }
    });
  }

  console.log('  ✓ Sample transactions & requests created');
  console.log('\n✅ Database seeded successfully!');
  console.log('\nDefault logins:');
  console.log('  Admin: username=admin, password=admin123');
  console.log('  User:  username=user,  password=user123');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
