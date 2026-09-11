class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) {
      return true;
    }

    const inputChannel = input[0];
    const currentSampleRate = sampleRate; // Global sampleRate in AudioWorkletGlobalScope
    const sampleRateRatio = currentSampleRate / this.targetSampleRate;

    const resampledLength = Math.floor(inputChannel.length / sampleRateRatio);
    if (resampledLength <= 0) {
      return true;
    }

    const pcm16 = new Int16Array(resampledLength);

    for (let i = 0; i < resampledLength; i++) {
      const srcIndex = i * sampleRateRatio;
      const index1 = Math.floor(srcIndex);
      const index2 = Math.min(index1 + 1, inputChannel.length - 1);
      const interpolation = srcIndex - index1;

      const s1 = inputChannel[index1] || 0;
      const s2 = inputChannel[index2] || 0;
      const sample = s1 + (s2 - s1) * interpolation;

      // Clamp float sample [-1.0, 1.0] to signed 16-bit PCM integer [-32768, 32767]
      const clamped = Math.max(-1, Math.min(1, sample));
      pcm16[i] = clamped < 0 ? Math.round(clamped * 32768) : Math.round(clamped * 32767);
    }

    // Transfer the underlying ArrayBuffer for zero-copy efficiency
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
