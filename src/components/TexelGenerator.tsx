import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Image, Video, Sparkles, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { texelService } from '@/services/texelService';
import { TexelGenerationRequest, TexelImageResponse, TexelVideoResponse, TexelJobStatus } from '@/types/texel';

interface TexelGeneratorProps {
  eventId?: string;
}

export const TexelGenerator: React.FC<TexelGeneratorProps> = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [generationSettings, setGenerationSettings] = useState({
    width: 1024,
    height: 768,
    steps: 15,
    cfg_scale: 7.5,
    model: 'realistic' as const,
    duration: 5,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [result, setResult] = useState<TexelImageResponse | TexelVideoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<TexelJobStatus | null>(null);

  const presets = texelService.getPresets();

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setPrompt(preset.prompt_template);
      setNegativePrompt(preset.negative_prompt || '');
      setGenerationSettings(prev => ({
        ...prev,
        model: preset.model as any,
        width: preset.width,
        height: preset.height,
        steps: preset.steps,
        cfg_scale: preset.cfg_scale,
      }));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!texelService.validateApiKey()) {
      setError('Texel API key not configured');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setJobStatus(null);
    setGenerationProgress(0);

    const request: TexelGenerationRequest = {
      prompt,
      negative_prompt: negativePrompt,
      ...generationSettings,
    };

    try {
      let response: TexelImageResponse | TexelVideoResponse;
      
      if (activeTab === 'image') {
        response = await texelService.generateImage(request);
      } else {
        response = await texelService.generateVideo(request);
      }

      if (response.success) {
        setResult(response);
        setGenerationProgress(100);
        
        // If it's a video with a job_id, poll for status
        if ('job_id' in response && response.job_id) {
          pollJobStatus(response.job_id);
        }
      } else {
        setError(response.error || 'Generation failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const status = await texelService.checkJobStatus(jobId);
      setJobStatus(status);
      
      if (status.status === 'processing') {
        setGenerationProgress(status.progress || 50);
        setTimeout(() => pollJobStatus(jobId), 5000);
      } else if (status.status === 'completed') {
        setGenerationProgress(100);
        setResult(prev => prev ? { ...prev, video_url: status.result_url } : prev);
      } else if (status.status === 'failed') {
        setError(status.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Error polling job status:', error);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Generation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'image' && 'image_url' in result && result.image_url && (
            <div className="space-y-4">
              <img 
                src={result.image_url} 
                alt="Generated content" 
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {result.generation_time ? `${result.generation_time}s` : 'Generated'}
                </Badge>
                <Button 
                  onClick={() => window.open(result.image_url, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  Open Full Size
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'video' && 'video_url' in result && result.video_url && (
            <div className="space-y-4">
              <video 
                src={result.video_url} 
                controls 
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {result.generation_time ? `${result.generation_time}s` : 'Generated'}
                </Badge>
                <Button 
                  onClick={() => window.open(result.video_url, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  Download Video
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Texel AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate AI-powered images and videos for your events using Texel.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'video')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image Generation
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Generation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preset">Quick Start Presets</Label>
                  <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a preset or create custom" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {preset.category}
                            </Badge>
                            {preset.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                  <Textarea
                    id="negative-prompt"
                    placeholder="What to avoid in the generation..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Select 
                      value={generationSettings.model} 
                      onValueChange={(value) => setGenerationSettings(prev => ({ ...prev, model: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={generationSettings.width}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={generationSettings.height}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="steps">Steps</Label>
                    <Input
                      id="steps"
                      type="number"
                      value={generationSettings.steps}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, steps: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-prompt">Video Prompt</Label>
                  <Textarea
                    id="video-prompt"
                    placeholder="Describe the video you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="video-negative-prompt">Negative Prompt (Optional)</Label>
                  <Textarea
                    id="video-negative-prompt"
                    placeholder="What to avoid in the video..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video-model">Model</Label>
                    <Select 
                      value={generationSettings.model} 
                      onValueChange={(value) => setGenerationSettings(prev => ({ ...prev, model: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="framepack">Framepack (High Quality)</SelectItem>
                        <SelectItem value="ltxv">LTXV (Fast)</SelectItem>
                        <SelectItem value="wan">Wan (Smooth Motion)</SelectItem>
                        <SelectItem value="hunyuan">Hunyuan (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={generationSettings.duration}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isGenerating && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
              {jobStatus && (
                <p className="text-sm text-muted-foreground">
                  Status: {jobStatus.status}
                  {jobStatus.progress && ` (${jobStatus.progress}%)`}
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : `Generate ${activeTab === 'image' ? 'Image' : 'Video'}`}
            </Button>
          </div>

          {renderResult()}
        </CardContent>
      </Card>
    </div>
  );
};