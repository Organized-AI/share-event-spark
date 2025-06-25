
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Upload, Share, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">EventShare</h1>
        <Link to="/events">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            Go to Events
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Organize & Share Your
          <br />
          <span className="text-yellow-400">Event Content</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          The ultimate platform for event organizers to collect, organize, and share photos, 
          videos, and content from speakers, sponsors, and attendees.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/events">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose EventShare?</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-black" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Event Organization</h4>
            <p className="text-gray-300">
              Create organized folder structures for different types of content - speakers, 
              sponsors, attendees, and more.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-black" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Easy Upload</h4>
            <p className="text-gray-300">
              Simple drag-and-drop interface for uploading photos, videos, and documents 
              from all your event participants.
            </p>
          </div>
<<<<<<< HEAD
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
=======
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share className="h-8 w-8 text-black" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Secure Sharing</h4>
            <p className="text-gray-300">
              Control who can access what content with role-based permissions and 
              secure sharing capabilities.
>>>>>>> 9d162421b4edfb31d50006aa60c10a366c72c835
            </p>
          </Link>
        </div>
      </section>

      {/* Security Notice */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
          <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-2xl font-semibold mb-3">Enterprise-Grade Security</h4>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your event content is protected with industry-standard security measures, 
            including authentication, role-based access control, and encrypted data storage.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-gray-800">
        <p>&copy; 2024 EventShare. Built with security and privacy in mind.</p>
      </footer>
    </div>
  );
};

export default Index;
