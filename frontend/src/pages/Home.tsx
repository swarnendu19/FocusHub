import { motion } from 'framer-motion';
import { DashboardSkeleton } from '../components/layout';

export function Home() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome to FocusHub
                </h1>
                <p className="text-gray-600">
                    Track your time, level up your productivity, and compete with friends!
                </p>
            </div>

            {/* Temporary skeleton to show layout */}
            <DashboardSkeleton />
        </motion.div>
    );
}