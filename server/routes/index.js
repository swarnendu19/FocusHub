const express = require('express');
const router = express.Router();
const userRoutes = require('./users/users.routes');
const leaderboardRoutes = require('./leaderboard/leaderboard.routes');
const feedbackRoutes = require('./feedback/feedback.routes');
const aiRoutes = require('./ai/ai.routes');
const collaborationRoutes = require('./collaboration/collaboration.routes')

router.use('/users', userRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/ai', aiRoutes);
router.use('/collaboration', collaborationRoutes);

module.exports = router;
