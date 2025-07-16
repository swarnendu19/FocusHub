import { motion } from 'framer-motion';
import { LeaderboardSkeleton } from '../components/layout';

export function Leaderboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Leaderboard
                </h1>
                <p className="text-gray-600">
                    See how you rank against other productive warriors!
                </p>
            </div>

            {/* Temporary skeleton to show layout */}
            <LeaderboardSkeleton />
        </motion.div>
    );
}