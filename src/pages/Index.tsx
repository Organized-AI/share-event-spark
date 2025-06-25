
import LumaIntegration from '@/components/LumaIntegration';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">EventShare MVP</h1>
          <p className="text-xl text-muted-foreground">
            Template-based event content management with Luma integration
          </p>
        </div>
        
        <div className="flex justify-center">
          <LumaIntegration eventId="demo-event-123" />
        </div>
        
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
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">🤖 AI Content</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated content via Texel.ai integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
