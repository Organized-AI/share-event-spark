
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LumaIntegration from '@/components/LumaIntegration';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Upload, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">EventShare MVP</h1>
          <p className="text-xl text-muted-foreground">
            Template-based event content management with Luma integration
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/events">
              <Button size="lg" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Manage Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/texel">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Content Generator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get started with EventShare in three simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">1. Create Event</h3>
                <p className="text-sm text-muted-foreground">Set up your event with basic details</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">2. Sync from Luma</h3>
                <p className="text-sm text-muted-foreground">Import attendees and event details</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">3. Organize Content</h3>
                <p className="text-sm text-muted-foreground">Use template folders to manage content</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Luma Integration Demo */}
        <div className="flex justify-center">
          <LumaIntegration eventId="demo-event-123" />
        </div>
        
        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">📢 Speakers</h3>
            <p className="text-sm text-muted-foreground">
              Speaker presentations, bios, and photos
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">🤝 Sponsors</h3>
            <p className="text-sm text-muted-foreground">
              Sponsor logos, materials, and promotional content
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">🎭 Attendees</h3>
            <p className="text-sm text-muted-foreground">
              Attendee photos, networking materials
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">🙋 Volunteers</h3>
            <p className="text-sm text-muted-foreground">
              Volunteer coordination and resources
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">🌟 Atmosphere</h3>
            <p className="text-sm text-muted-foreground">
              Event photos, videos, and atmosphere content
            </p>
          </div>
          <Link to="/texel" className="p-6 border rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              🤖 AI Content
              <Sparkles className="h-4 w-4" />
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-generated content via Texel.ai integration
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
