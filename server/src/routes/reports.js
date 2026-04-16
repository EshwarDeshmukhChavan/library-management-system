const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const { calculateFine } = require('../utils/fineCalculator');

const prisma = new PrismaClient();

// GET /api/reports/books - Master List of Books
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await prisma.bookMovie.findMany({
      where: { type: 'BOOK' },
      include: { category: true },
      orderBy: { serialNo: 'asc' }
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books report.' });
  }
});

// GET /api/reports/movies - Master List of Movies
router.get('/movies', authenticateToken, async (req, res) => {
  try {
    const movies = await prisma.bookMovie.findMany({
      where: { type: 'MOVIE' },
      include: { category: true },
      orderBy: { serialNo: 'asc' }
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies report.' });
  }
});

// GET /api/reports/memberships - Master List of Memberships
router.get('/memberships', authenticateToken, async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { membershipId: 'asc' }
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch memberships report.' });
  }
});

// GET /api/reports/active-issues - Active Issues
router.get('/active-issues', authenticateToken, async (req, res) => {
  try {
    const activeIssues = await prisma.transaction.findMany({
      where: { status: 'ACTIVE' },
      include: {
        bookMovie: true,
        member: true
      },
      orderBy: { issueDate: 'desc' }
    });
    res.json(activeIssues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active issues report.' });
  }
});

// GET /api/reports/overdue-returns - Overdue Returns with fine calculations
router.get('/overdue-returns', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTransactions = await prisma.transaction.findMany({
      where: {
        status: 'ACTIVE',
        returnDate: { lt: today }
      },
      include: {
        bookMovie: true,
        member: true
      },
      orderBy: { returnDate: 'asc' }
    });

    // Calculate fines for each overdue transaction
    const overdueWithFines = overdueTransactions.map(t => ({
      ...t,
      fineCalculated: calculateFine(t.returnDate, today)
    }));

    res.json(overdueWithFines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overdue returns report.' });
  }
});

// GET /api/reports/issue-requests - Issue Requests
router.get('/issue-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await prisma.issueRequest.findMany({
      include: {
        member: true,
        bookMovie: true
      },
      orderBy: { requestedDate: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch issue requests report.' });
  }
});

module.exports = router;
