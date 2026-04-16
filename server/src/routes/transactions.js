const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const { calculateFine } = require('../utils/fineCalculator');

const prisma = new PrismaClient();

// POST /api/transactions/issue - Issue a book
router.post('/issue', authenticateToken, async (req, res) => {
  try {
    const { bookMovieId, memberId, issueDate, returnDate, remarks } = req.body;

    if (!bookMovieId || !memberId || !issueDate || !returnDate) {
      return res.status(400).json({ error: 'Book, member, issue date, and return date are required.' });
    }

    // Validate issue date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issueDt = new Date(issueDate);
    issueDt.setHours(0, 0, 0, 0);

    if (issueDt < today) {
      return res.status(400).json({ error: 'Issue date cannot be before today.' });
    }

    // Validate return date <= issue date + 15 days
    const maxReturn = new Date(issueDt);
    maxReturn.setDate(maxReturn.getDate() + 15);
    const returnDt = new Date(returnDate);
    returnDt.setHours(0, 0, 0, 0);

    if (returnDt > maxReturn) {
      return res.status(400).json({ error: 'Return date cannot be more than 15 days from issue date.' });
    }

    // Check book availability
    const book = await prisma.bookMovie.findUnique({ where: { id: parseInt(bookMovieId) } });
    if (!book) {
      return res.status(404).json({ error: 'Book/movie not found.' });
    }
    if (book.status === 'ISSUED') {
      return res.status(400).json({ error: 'This book/movie is already issued.' });
    }

    // Check member exists and is active
    const member = await prisma.member.findUnique({ where: { id: parseInt(memberId) } });
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    if (member.status === 'INACTIVE') {
      return res.status(400).json({ error: 'Member membership is inactive.' });
    }

    // Create transaction and update book status
    const transaction = await prisma.$transaction(async (tx) => {
      const trans = await tx.transaction.create({
        data: {
          bookMovieId: parseInt(bookMovieId),
          memberId: parseInt(memberId),
          issueDate: new Date(issueDate),
          returnDate: new Date(returnDate),
          remarks: remarks || null,
          status: 'ACTIVE'
        },
        include: { bookMovie: true, member: true }
      });

      await tx.bookMovie.update({
        where: { id: parseInt(bookMovieId) },
        data: { status: 'ISSUED' }
      });

      // Fulfill any issue request
      await tx.issueRequest.updateMany({
        where: {
          bookMovieId: parseInt(bookMovieId),
          memberId: parseInt(memberId),
          fulfilledDate: null
        },
        data: { fulfilledDate: new Date() }
      });

      return trans;
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error issuing book:', err);
    res.status(500).json({ error: 'Failed to issue book.' });
  }
});

// POST /api/transactions/return - Return a book (calculates fine)
router.post('/return', authenticateToken, async (req, res) => {
  try {
    const { transactionId, actualReturnDate, remarks } = req.body;

    if (!transactionId || !actualReturnDate) {
      return res.status(400).json({ error: 'Transaction ID and actual return date are required.' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: { bookMovie: true, member: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    if (transaction.status === 'RETURNED') {
      return res.status(400).json({ error: 'This book has already been returned.' });
    }

    // Calculate fine
    const fine = calculateFine(transaction.returnDate, actualReturnDate);

    // Update transaction with fine info (but don't complete yet - goes to PayFine)
    const updated = await prisma.transaction.update({
      where: { id: parseInt(transactionId) },
      data: {
        actualReturnDate: new Date(actualReturnDate),
        fineCalculated: fine,
        remarks: remarks || transaction.remarks
      },
      include: { bookMovie: true, member: true }
    });

    res.json({
      transaction: updated,
      fine,
      requiresFinePaid: fine > 0
    });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).json({ error: 'Failed to process return.' });
  }
});

// POST /api/transactions/pay-fine - Complete return with fine payment
router.post('/pay-fine', authenticateToken, async (req, res) => {
  try {
    const { transactionId, finePaid, remarks } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: { bookMovie: true, member: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    if (transaction.fineCalculated > 0 && !finePaid) {
      return res.status(400).json({ error: 'Fine must be paid before completing the return.' });
    }

    // Complete the return
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id: parseInt(transactionId) },
        data: {
          finePaid: finePaid || false,
          remarks: remarks || transaction.remarks,
          status: 'RETURNED'
        },
        include: { bookMovie: true, member: true }
      });

      // Update book status back to available
      await tx.bookMovie.update({
        where: { id: transaction.bookMovieId },
        data: { status: 'AVAILABLE' }
      });

      // Update member pending fine
      if (transaction.fineCalculated > 0 && finePaid) {
        await tx.member.update({
          where: { id: transaction.memberId },
          data: { pendingFine: { decrement: transaction.fineCalculated } }
        });
      }

      return updated;
    });

    res.json(result);
  } catch (err) {
    console.error('Error paying fine:', err);
    res.status(500).json({ error: 'Failed to process fine payment.' });
  }
});

// GET /api/transactions/active - Get active issues (optionally by member)
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const { memberId } = req.query;
    const where = { status: 'ACTIVE' };
    if (memberId) where.memberId = parseInt(memberId);

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        bookMovie: { include: { category: true } },
        member: true
      },
      orderBy: { issueDate: 'desc' }
    });

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching active transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// GET /api/transactions/by-book - Get active transaction for a specific book
router.get('/by-book', authenticateToken, async (req, res) => {
  try {
    const { bookMovieId } = req.query;
    const transaction = await prisma.transaction.findFirst({
      where: {
        bookMovieId: parseInt(bookMovieId),
        status: 'ACTIVE'
      },
      include: { bookMovie: true, member: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'No active transaction found for this book.' });
    }

    res.json(transaction);
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(500).json({ error: 'Failed to fetch transaction.' });
  }
});

module.exports = router;
