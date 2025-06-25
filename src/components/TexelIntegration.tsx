import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, Key, Zap, History, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { texelService } from '@/services/texelService';
import { TexelGenerator } from './TexelGenerator';

interface TexelIntegrationProps {
  eventId?: string;
}

export const TexelIntegration: React.FC<TexelIntegrationProps> = ({ eventId }) => {
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generator');

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = () => {
    setLoading(true);
    const isValid = texelService.validateApiKey();
    setApiKeyValid(isValid);
    setLoading(false);
  };

  const renderApiKeyStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Configuration
        </CardTitle>
        <CardDescription>
          Configure your Texel.ai API access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {apiKeyValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">API key configured</span>
                <Badge variant="secondary">Connected</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">API key missing</span>
                <Badge variant="destructive">Not Connected</Badge>
              </>
            )}
          </div>

          {!apiKeyValid && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To use Texel.ai features, add your API key to the environment variables:
                <br />
                <code className="bg-muted px-2 py-1 rounded text-sm mt-2 block">
                  VITE_TEXEL_API_KEY=your_api_key_here
                </code>
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://docs.texel.ai/authentication', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Get API Key
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFeatureOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Image Generation</CardTitle>
          <CardDescription>
            Create stunning AI-generated images for your events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Realistic and anime models</li>
            <li>• Custom dimensions and quality</li>
            <li>• Human-robot interaction presets</li>
            <li>• Corporate and tech themes</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Video Generation</CardTitle>
          <CardDescription>
            Transform ideas into dynamic video content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Multiple AI models (Framepack, LTXV, Wan, Hunyuan)</li>
            <li>• Image-to-video conversion</li>
            <li>• Customizable duration</li>
            <li>• Professional quality output</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Smart Presets</CardTitle>
          <CardDescription>
            Pre-configured templates for common scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Corporate AI handshake scenes</li>
            <li>• Tech partnership visuals</li>
            <li>• Quick demo generations</li>
            <li>• Event-specific content</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsageGuidelines = () => (
    <Card>
      <CardHeader>
        <CardTitle>Usage Guidelines</CardTitle>
        <CardDescription>
          Best practices for generating high-quality content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Image Generation Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use detailed, descriptive prompts</li>
              <li>• Include lighting and environment details</li>
              <li>• Specify material contrasts (human skin vs metal)</li>
              <li>• Add negative prompts to avoid unwanted elements</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Video Generation Notes</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Video generation takes 2-10 minutes</li>
              <li>• Start with image generation for better results</li>
              <li>• Use Framepack for detailed control</li>
              <li>• LTXV model is fastest for iterations</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Cost Optimization</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use smaller dimensions for testing (512x512)</li>
              <li>• Reduce steps for faster generation</li>
              <li>• Save successful prompts for reuse</li>
              <li>• Use presets to avoid trial and error</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Texel integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Zap className="h-8 w-8" />
          Texel.ai Integration
        </h1>
        <p className="text-muted-foreground">
          Generate AI-powered visual content for your events
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {apiKeyValid ? (
            <TexelGenerator eventId={eventId} />
          ) : (
            <div className="space-y-6">
              {renderApiKeyStatus()}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please configure your Texel.ai API key to access the generator.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-6">
            {renderFeatureOverview()}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {apiKeyValid ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready to Use
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Configuration Required
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={checkApiKey}>
                    Refresh Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {renderApiKeyStatus()}
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          {renderUsageGuidelines()}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/docs/Human-Robot-Handshake-Prompts-Texel-AI.md', '_blank')}
                  className="justify-start"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Prompt Documentation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://docs.texel.ai', '_blank')}
                  className="justify-start"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Texel.ai API Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};