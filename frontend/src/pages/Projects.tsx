import { motion } from 'framer-motion';
import { ProjectsPageSkeleton } from '../components/layout';

export function Projects() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Projects
                </h1>
                <p className="text-gray-600">
                    Manage your projects and track time like a game!
                </p>
            </div>

            {/* Temporary skeleton to show layout */}
            <ProjectsPageSkeleton />
        </motion.div>
    );
}