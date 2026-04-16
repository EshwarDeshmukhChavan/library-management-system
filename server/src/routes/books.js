const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const prisma = new PrismaClient();

// GET /api/books - List all books/movies with optional filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, categoryId, status } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (status) where.status = status;

    const books = await prisma.bookMovie.findMany({
      where,
      include: { category: true },
      orderBy: { serialNo: 'asc' }
    });
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});

// GET /api/books/search - Search books by name or author
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { bookName, authorName } = req.query;

    if (!bookName && !authorName) {
      return res.status(400).json({ error: 'Please enter a book name or author name to search.' });
    }

    const where = { type: 'BOOK' };
    const conditions = [];

    if (bookName) {
      conditions.push({ name: { contains: bookName, mode: 'insensitive' } });
    }
    if (authorName) {
      conditions.push({ authorName: { contains: authorName, mode: 'insensitive' } });
    }

    if (conditions.length > 0) {
      where.OR = conditions;
    }

    const books = await prisma.bookMovie.findMany({
      where,
      include: { category: true },
      orderBy: { serialNo: 'asc' }
    });

    res.json(books);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ error: 'Failed to search books.' });
  }
});

// GET /api/books/names - Get distinct book names for dropdown
router.get('/names', authenticateToken, async (req, res) => {
  try {
    const books = await prisma.bookMovie.findMany({
      select: { id: true, name: true, authorName: true, serialNo: true, status: true, type: true },
      orderBy: { name: 'asc' }
    });
    res.json(books);
  } catch (err) {
    console.error('Error fetching book names:', err);
    res.status(500).json({ error: 'Failed to fetch book names.' });
  }
});

// GET /api/books/categories - Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// POST /api/books - Add new book/movie (Admin only)
router.post('/', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { name, authorName, type, categoryId, cost, procurementDate, quantity } = req.body;

    if (!name || !authorName || !type || !categoryId || !procurementDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Get category for serial number prefix
    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    if (!category) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    const typeSuffix = type === 'BOOK' ? 'B' : 'M';
    const prefix = `${category.codePrefix}${typeSuffix}`;

    // Find the last serial number for this prefix
    const lastBook = await prisma.bookMovie.findFirst({
      where: { serialNo: { startsWith: prefix } },
      orderBy: { serialNo: 'desc' }
    });

    let nextNum = 1;
    if (lastBook) {
      const lastNum = parseInt(lastBook.serialNo.replace(prefix, ''));
      nextNum = lastNum + 1;
    }

    const qty = parseInt(quantity) || 1;
    const createdBooks = [];

    for (let i = 0; i < qty; i++) {
      const serialNo = `${prefix}${String(nextNum + i).padStart(6, '0')}`;
      const book = await prisma.bookMovie.create({
        data: {
          serialNo,
          name,
          authorName,
          type,
          categoryId: parseInt(categoryId),
          cost: parseFloat(cost) || 0,
          procurementDate: new Date(procurementDate),
          quantity: 1
        },
        include: { category: true }
      });
      createdBooks.push(book);
    }

    res.status(201).json(createdBooks);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ error: 'Failed to add book/movie.' });
  }
});

// PUT /api/books/:id - Update book/movie (Admin only)
router.put('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, serialNo, status, date, type } = req.body;

    if (!name || !serialNo || !status) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const book = await prisma.bookMovie.update({
      where: { id: parseInt(id) },
      data: {
        name,
        serialNo,
        status,
        procurementDate: date ? new Date(date) : undefined
      },
      include: { category: true }
    });

    res.json(book);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ error: 'Failed to update book/movie.' });
  }
});

module.exports = router;
