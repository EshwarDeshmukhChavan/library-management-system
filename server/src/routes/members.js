const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const prisma = new PrismaClient();

// GET /api/members - List all members
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const members = await prisma.member.findMany({
      where,
      orderBy: { membershipId: 'asc' }
    });
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Failed to fetch members.' });
  }
});

// GET /api/members/:membershipId - Get member by membership ID
router.get('/:membershipId', authenticateToken, async (req, res) => {
  try {
    const { membershipId } = req.params;
    const member = await prisma.member.findUnique({
      where: { membershipId }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    res.json(member);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Failed to fetch member.' });
  }
});

// POST /api/members - Add new member (Admin only)
router.post('/', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, contactAddress, aadharCardNo, startDate, endDate } = req.body;

    if (!firstName || !lastName || !contactNumber || !contactAddress || !aadharCardNo || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Generate membership ID
    const lastMember = await prisma.member.findFirst({
      orderBy: { membershipId: 'desc' }
    });

    let nextNum = 1;
    if (lastMember) {
      const lastNum = parseInt(lastMember.membershipId.replace('MEM', ''));
      nextNum = lastNum + 1;
    }

    const membershipId = `MEM${String(nextNum).padStart(6, '0')}`;

    const member = await prisma.member.create({
      data: {
        membershipId,
        firstName,
        lastName,
        contactNumber,
        contactAddress,
        aadharCardNo,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
        pendingFine: 0
      }
    });

    res.status(201).json(member);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member.' });
  }
});

// PUT /api/members/:membershipId - Update member (Admin only)
router.put('/:membershipId', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { membershipId } = req.params;
    const { action, extensionMonths } = req.body;

    const member = await prisma.member.findUnique({
      where: { membershipId }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    let updateData = {};

    if (action === 'extend') {
      const months = parseInt(extensionMonths) || 6;
      const newEndDate = new Date(member.endDate);
      newEndDate.setMonth(newEndDate.getMonth() + months);
      updateData = {
        endDate: newEndDate,
        status: 'ACTIVE'
      };
    } else if (action === 'remove') {
      updateData = {
        status: 'INACTIVE'
      };
    }

    const updated = await prisma.member.update({
      where: { membershipId },
      data: updateData
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Failed to update member.' });
  }
});

module.exports = router;
