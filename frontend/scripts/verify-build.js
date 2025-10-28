#!/usr/bin/env node

/**
 * Build Verification Script
 * 
 * Verifies the production build meets quality standards
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');

// Build verification configuration
const config = {
    maxBundleSize: 1024 * 1024, // 1MB
    maxChunkSize: 512 * 1024,   // 512KB
    requiredFiles: [
        'index.html',
        'manifest.json',
        'robots.txt',
        'sitemap.xml',
    ],
    requiredDirectories: [
        'js',
        'css',
        'assets',
    ],
    performance: {
        maxJsFiles: 20,
        maxCssFiles: 5,
        maxImageFiles: 50,
    },
};

class BuildVerifier {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalSize: 0,
            jsFiles: 0,
            cssFiles: 0,
            imageFiles: 0,
            otherFiles: 0,
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '✓',
            warn: '⚠',
            error: '✗',
        }[type];

        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    error(message) {
        this.errors.push(message);
        this.log(message, 'error');
    }

    warn(message) {
        this.warnings.push(message);
        this.log(message, 'warn');
    }

    info(message) {
        this.log(message, 'info');
    }

    checkDistExists() {
        if (!existsSync(distPath)) {
            this.error(`Build directory does not exist: ${distPath}`);
            return false;
        }
        this.info('Build directory exists');
        return true;
    }

    checkRequiredFiles() {
        this.info('Checking required files...');

        for (const file of config.requiredFiles) {
            const filePath = join(distPath, file);
            if (!existsSync(filePath)) {
                this.error(`Required file missing: ${file}`);
            } else {
                this.info(`Required file found: ${file}`);
            }
        }
    }

    checkRequiredDirectories() {
        this.info('Checking required directories...');

        for (const dir of config.requiredDirectories) {
            const dirPath = join(distPath, dir);
            if (!existsSync(dirPath)) {
                this.error(`Required directory missing: ${dir}`);
            } else {
                this.info(`Required directory found: ${dir}`);
            }
        }
    }

    analyzeFiles(dir = distPath, relativePath = '') {
        const fs = require('fs');
        const path = require('path');

        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativeItemPath = path.join(relativePath, item);
                const stat = statSync(fullPath);

                if (stat.isDirectory()) {
                    this.analyzeFiles(fullPath, relativeItemPath);
                } else {
                    this.analyzeFile(fullPath, relativeItemPath, stat.size);
                }
            }
        } catch (error) {
            this.error(`Failed to analyze directory ${dir}: ${error.message}`);
        }
    }

    analyzeFile(filePath, relativePath, size) {
        this.stats.totalSize += size;

        // Categorize files
        if (relativePath.endsWith('.js')) {
            this.stats.jsFiles++;

            // Check JS bundle size
            if (size > config.maxChunkSize) {
                this.warn(`Large JS file: ${relativePath} (${this.formatSize(size)})`);
            }
        } else if (relativePath.endsWith('.css')) {
            this.stats.cssFiles++;
        } else if (relativePath.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
            this.stats.imageFiles++;
        } else {
            this.stats.otherFiles++;
        }

        // Check individual file size
        if (size > config.maxBundleSize) {
            this.error(`File too large: ${relativePath} (${this.formatSize(size)})`);
        }
    }

    checkPerformance() {
        this.info('Checking performance metrics...');

        if (this.stats.jsFiles > config.performance.maxJsFiles) {
            this.warn(`Too many JS files: ${this.stats.jsFiles} (max: ${config.performance.maxJsFiles})`);
        }

        if (this.stats.cssFiles > config.performance.maxCssFiles) {
            this.warn(`Too many CSS files: ${this.stats.cssFiles} (max: ${config.performance.maxCssFiles})`);
        }

        if (this.stats.imageFiles > config.performance.maxImageFiles) {
            this.warn(`Too many image files: ${this.stats.imageFiles} (max: ${config.performance.maxImageFiles})`);
        }

        this.info(`Total build size: ${this.formatSize(this.stats.totalSize)}`);
        this.info(`JS files: ${this.stats.jsFiles}`);
        this.info(`CSS files: ${this.stats.cssFiles}`);
        this.info(`Image files: ${this.stats.imageFiles}`);
        this.info(`Other files: ${this.stats.otherFiles}`);
    }

    checkIndexHtml() {
        this.info('Checking index.html...');

        const indexPath = join(distPath, 'index.html');
        if (!existsSync(indexPath)) {
            this.error('index.html not found');
            return;
        }

        try {
            const content = readFileSync(indexPath, 'utf-8');

            // Check for required meta tags
            const requiredMeta = [
                '<meta charset="utf-8"',
                '<meta name="viewport"',
                '<title>',
                '<link rel="manifest"',
            ];

            for (const meta of requiredMeta) {
                if (!content.includes(meta)) {
                    this.warn(`Missing meta tag in index.html: ${meta}`);
                }
            }

            // Check for script and style tags
            if (!content.includes('<script')) {
                this.error('No script tags found in index.html');
            }

            if (!content.includes('<link rel="stylesheet"')) {
                this.warn('No stylesheet links found in index.html');
            }

            this.info('index.html validation completed');
        } catch (error) {
            this.error(`Failed to read index.html: ${error.message}`);
        }
    }

    checkManifest() {
        this.info('Checking PWA manifest...');

        const manifestPath = join(distPath, 'manifest.json');
        if (!existsSync(manifestPath)) {
            this.error('manifest.json not found');
            return;
        }

        try {
            const content = readFileSync(manifestPath, 'utf-8');
            const manifest = JSON.parse(content);

            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];

            for (const field of requiredFields) {
                if (!manifest[field]) {
                    this.error(`Missing required field in manifest.json: ${field}`);
                }
            }

            // Check icons
            if (manifest.icons && Array.isArray(manifest.icons)) {
                for (const icon of manifest.icons) {
                    if (!icon.src || !icon.sizes || !icon.type) {
                        this.warn('Invalid icon entry in manifest.json');
                    }
                }
            }

            this.info('PWA manifest validation completed');
        } catch (error) {
            this.error(`Failed to parse manifest.json: ${error.message}`);
        }
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('BUILD VERIFICATION REPORT');
        console.log('='.repeat(60));

        console.log(`\nBuild Statistics:`);
        console.log(`- Total Size: ${this.formatSize(this.stats.totalSize)}`);
        console.log(`- JavaScript Files: ${this.stats.jsFiles}`);
        console.log(`- CSS Files: ${this.stats.cssFiles}`);
        console.log(`- Image Files: ${this.stats.imageFiles}`);
        console.log(`- Other Files: ${this.stats.otherFiles}`);

        if (this.warnings.length > 0) {
            console.log(`\nWarnings (${this.warnings.length}):`);
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. ${warning}`);
            });
        }

        if (this.errors.length > 0) {
            console.log(`\nErrors (${this.errors.length}):`);
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        console.log('\n' + '='.repeat(60));

        if (this.errors.length === 0) {
            console.log('✅ BUILD VERIFICATION PASSED');
            return true;
        } else {
            console.log('❌ BUILD VERIFICATION FAILED');
            return false;
        }
    }

    async verify() {
        console.log('Starting build verification...\n');

        // Run all checks
        if (!this.checkDistExists()) {
            return this.generateReport();
        }

        this.checkRequiredFiles();
        this.checkRequiredDirectories();
        this.analyzeFiles();
        this.checkPerformance();
        this.checkIndexHtml();
        this.checkManifest();

        return this.generateReport();
    }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const verifier = new BuildVerifier();

    verifier.verify().then((success) => {
        process.exit(success ? 0 : 1);
    }).catch((error) => {
        console.error('Build verification failed:', error);
        process.exit(1);
    });
}

export default BuildVerifier;