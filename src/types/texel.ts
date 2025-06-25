export interface TexelGenerationRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  model?: 'realistic' | 'anime' | 'framepack' | 'ltxv' | 'wan' | 'hunyuan';
  image_url?: string;
  duration?: number;
}

export interface TexelImageResponse {
  success: boolean;
  image_url?: string;
  job_id?: string;
  error?: string;
  generation_time?: number;
}

export interface TexelVideoResponse {
  success: boolean;
  video_url?: string;
  job_id?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  generation_time?: number;
  estimated_completion?: string;
}

export interface TexelJobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result_url?: string;
  error?: string;
  created_at?: string;
  completed_at?: string;
}

export interface TexelPreset {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  negative_prompt?: string;
  model: string;
  width: number;
  height: number;
  steps: number;
  cfg_scale: number;
  category: 'human-robot' | 'corporate' | 'tech' | 'custom';
}

export interface TexelGenerationHistory {
  id: string;
  event_id: string;
  prompt: string;
  model: string;
  result_url?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  job_id?: string;
}