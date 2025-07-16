import { motion } from 'framer-motion';
import { PageSkeleton } from '../components/layout';

export function XP() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    XP & Achievements
                </h1>
                <p className="text-gray-600">
                    Level up and unlock achievements for your productivity!
                </p>
            </div>

            {/* Temporary skeleton to show layout */}
            <PageSkeleton />
        </motion.div>
    );
}