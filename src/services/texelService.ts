import { 
  TexelGenerationRequest, 
  TexelImageResponse, 
  TexelVideoResponse, 
  TexelJobStatus,
  TexelPreset
} from '@/types/texel';

class TexelService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_TEXEL_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_TEXEL_BASE_URL || 'https://api.texel.ai/v1';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Texel API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Texel API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async generateImage(request: TexelGenerationRequest): Promise<TexelImageResponse> {
    try {
      const response = await this.makeRequest<TexelImageResponse>('/generate/image', {
        method: 'POST',
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negative_prompt,
          width: request.width || 1024,
          height: request.height || 768,
          steps: request.steps || 15,
          cfg_scale: request.cfg_scale || 7.5,
          seed: request.seed,
          model: request.model || 'realistic',
        }),
      });

      return response;
    } catch (error) {
      console.error('Error generating image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateVideo(request: TexelGenerationRequest): Promise<TexelVideoResponse> {
    try {
      const response = await this.makeRequest<TexelVideoResponse>('/generate/video', {
        method: 'POST',
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negative_prompt,
          image_url: request.image_url,
          model: request.model || 'framepack',
          duration: request.duration || 5,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error generating video:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkJobStatus(jobId: string): Promise<TexelJobStatus> {
    try {
      const response = await this.makeRequest<TexelJobStatus>(`/jobs/${jobId}/status`);
      return response;
    } catch (error) {
      console.error('Error checking job status:', error);
      throw error;
    }
  }

  async retryGeneration(request: TexelGenerationRequest, maxRetries: number = 3): Promise<TexelImageResponse> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.generateImage(request);
        if (result.success) {
          return result;
        }
        lastError = new Error(result.error || 'Generation failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  getPresets(): TexelPreset[] {
    return [
      {
        id: 'corporate-handshake',
        name: 'Corporate AI Handshake',
        description: 'Professional business executive meeting advanced AI',
        prompt_template: 'Professional business executive in tailored navy suit extends hand toward advanced humanoid robot with sleek metallic design and glowing blue accents. Modern corporate boardroom with holographic displays.',
        negative_prompt: 'poor hand anatomy, unrealistic robot design, clunky movements, harsh lighting',
        model: 'framepack',
        width: 1024,
        height: 768,
        steps: 20,
        cfg_scale: 8.0,
        category: 'human-robot'
      },
      {
        id: 'tech-partnership',
        name: 'Next-Gen Tech Partnership',
        description: 'High-detail human-AI collaboration scene',
        prompt_template: 'Distinguished technology executive in elegant business attire engages in groundbreaking handshake with state-of-the-art android featuring premium metallic finish. High-end technology laboratory setting.',
        negative_prompt: 'poor material quality, unconvincing robot design, low detail rendering',
        model: 'wan',
        width: 1024,
        height: 768,
        steps: 25,
        cfg_scale: 8.5,
        category: 'corporate'
      },
      {
        id: 'quick-demo',
        name: 'Quick Tech Demo',
        description: 'Fast generation for concept development',
        prompt_template: 'Business professional shakes hands with sleek robot in modern tech showcase. Clean handshake interaction in simple tech environment.',
        negative_prompt: 'complex background, multiple characters, overdetailed scene',
        model: 'ltxv',
        width: 512,
        height: 512,
        steps: 10,
        cfg_scale: 7.0,
        category: 'tech'
      }
    ];
  }

  validateApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }
}

export const texelService = new TexelService();