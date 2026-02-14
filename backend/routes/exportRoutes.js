const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

router.use(protect);

// @desc    Export tasks to CSV
// @route   GET /api/export/csv
router.get('/csv', async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        let query = { user: req.user.id };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) query.title = { $regex: search, $options: 'i' };

        const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

        const fields = ['title', 'description', 'priority', 'status', 'dueDate', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(tasks);

        res.header('Content-Type', 'text/csv');
        res.attachment('tasks-export.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Export tasks to PDF
// @route   GET /api/export/pdf
router.get('/pdf', async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        let query = { user: req.user.id };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) query.title = { $regex: search, $options: 'i' };

        const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks-export.pdf');
        doc.pipe(res);

        doc.fontSize(20).text('QuickTask - Tasks Export', { align: 'center' });
        doc.moveDown();

        tasks.forEach((task, index) => {
            doc.fontSize(12).text(`${index + 1}. ${task.title}`, { underline: true });
            doc.fontSize(10).text(`Status: ${task.status} | Priority: ${task.priority}`);
            doc.fontSize(10).text(`Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}`);
            doc.fontSize(10).text(`Description: ${task.description || 'N/A'}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
