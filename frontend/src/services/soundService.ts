export type SoundType =
    | 'xp-gain'
    | 'level-up'
    | 'achievement-unlock'
    | 'task-complete'
    | 'button-click'
    | 'timer-start'
    | 'timer-stop'
    | 'notification'
    | 'success'
    | 'error'
    | 'celebration';

interface SoundConfig {
    volume: number;
    playbackRate: number;
    loop: boolean;
}

class SoundService {
    private audioContext: AudioContext | null = null;
    private sounds: Map<SoundType, AudioBuffer> = new Map();
    private isEnabled: boolean = true;
    private masterVolume: number = 0.7;

    constructor() {
        this.initializeAudioContext();
        this.loadSounds();
    }

    private initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    private async loadSounds() {
        // Generate synthetic sounds using Web Audio API
        if (!this.audioContext) return;

        const soundDefinitions: Record<SoundType, () => AudioBuffer> = {
            'xp-gain': () => this.generateTone(800, 0.1, 'sine'),
            'level-up': () => this.generateChord([523.25, 659.25, 783.99], 0.5), // C major chord
            'achievement-unlock': () => this.generateArpeggio([523.25, 659.25, 783.99, 1046.50], 0.8),
            'task-complete': () => this.generateTone(1000, 0.2, 'triangle'),
            'button-click': () => this.generateTone(400, 0.05, 'square'),
            'timer-start': () => this.generateTone(600, 0.15, 'sine'),
            'timer-stop': () => this.generateTone(400, 0.15, 'sine'),
            'notification': () => this.generateTone(800, 0.1, 'sine'),
            'success': () => this.generateChord([523.25, 659.25], 0.3),
            'error': () => this.generateTone(200, 0.3, 'sawtooth'),
            'celebration': () => this.generateFireworks()
        };

        for (const [soundType, generator] of Object.entries(soundDefinitions)) {
            try {
                const audioBuffer = generator();
                this.sounds.set(soundType as SoundType, audioBuffer);
            } catch (error) {
                console.warn(`Failed to generate sound for ${soundType}:`, error);
            }
        }
    }

    private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
        if (!this.audioContext) throw new Error('AudioContext not available');

        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            let sample = 0;

            switch (type) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
                    break;
                case 'triangle':
                    sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'sawtooth':
                    sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
                    break;
            }

            // Apply envelope (fade in/out)
            const envelope = Math.min(1, Math.min(i / (sampleRate * 0.01), (length - i) / (sampleRate * 0.05)));
            data[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    private generateChord(frequencies: number[], duration: number): AudioBuffer {
        if (!this.audioContext) throw new Error('AudioContext not available');

        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            let sample = 0;

            // Sum all frequencies
            for (const freq of frequencies) {
                sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
            }

            // Apply envelope
            const envelope = Math.min(1, Math.min(i / (sampleRate * 0.01), (length - i) / (sampleRate * 0.1)));
            data[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    private generateArpeggio(frequencies: number[], duration: number): AudioBuffer {
        if (!this.audioContext) throw new Error('AudioContext not available');

        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        const noteLength = length / frequencies.length;

        for (let i = 0; i < length; i++) {
            const noteIndex = Math.floor(i / noteLength);
            const frequency = frequencies[noteIndex] || frequencies[frequencies.length - 1];
            const t = i / sampleRate;

            const sample = Math.sin(2 * Math.PI * frequency * t);

            // Apply envelope for each note
            const noteProgress = (i % noteLength) / noteLength;
            const envelope = Math.sin(noteProgress * Math.PI); // Bell curve envelope

            data[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    private generateFireworks(): AudioBuffer {
        if (!this.audioContext) throw new Error('AudioContext not available');

        const sampleRate = this.audioContext.sampleRate;
        const duration = 1.5;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            let sample = 0;

            // Multiple bursts
            const burstCount = 5;
            for (let burst = 0; burst < burstCount; burst++) {
                const burstTime = (burst / burstCount) * duration;
                const timeSinceBurst = t - burstTime;

                if (timeSinceBurst >= 0 && timeSinceBurst < 0.3) {
                    const frequency = 1000 + Math.sin(timeSinceBurst * 50) * 500;
                    const envelope = Math.exp(-timeSinceBurst * 10);
                    sample += Math.sin(2 * Math.PI * frequency * timeSinceBurst) * envelope;
                }
            }

            data[i] = Math.max(-1, Math.min(1, sample * 0.2));
        }

        return buffer;
    }

    public async play(soundType: SoundType, config: Partial<SoundConfig> = {}) {
        if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundType)) {
            return;
        }

        try {
            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const audioBuffer = this.sounds.get(soundType)!;
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = audioBuffer;
            source.playbackRate.value = config.playbackRate || 1;
            source.loop = config.loop || false;

            gainNode.gain.value = (config.volume || 1) * this.masterVolume;

            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            source.start();
        } catch (error) {
            console.warn(`Failed to play sound ${soundType}:`, error);
        }
    }

    public setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    public setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    public isAudioEnabled(): boolean {
        return this.isEnabled && !!this.audioContext;
    }
}

// Create singleton instance
export const soundService = new SoundService();

// Hook for React components
export function useSound() {
    const playSound = (soundType: SoundType, config?: Partial<SoundConfig>) => {
        soundService.play(soundType, config);
    };

    return {
        playSound,
        setEnabled: soundService.setEnabled.bind(soundService),
        setMasterVolume: soundService.setMasterVolume.bind(soundService),
        isAudioEnabled: soundService.isAudioEnabled.bind(soundService)
    };
}