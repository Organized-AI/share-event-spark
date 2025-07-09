import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image, 
  Video, 
  Camera, 
  Eye,
  Download,
  Grid,
  List
} from 'lucide-react';

interface EventContentManagerProps {
  eventId: string;
}

const EventContentManager: React.FC<EventContentManagerProps> = ({ eventId }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMediaTab, setActiveMediaTab] = useState('all');

  const handleFileUpload = (type: 'photo' | 'video') => {
    console.log(`Uploading ${type} for event:`, eventId);
    // TODO: Implement file upload functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
                  <Camera className="h-5 w-5 text-yellow-400" />
                </div>
                Event Content
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                Upload and manage photos and videos from your event
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Upload Content</CardTitle>
          <CardDescription className="text-gray-300">
            Upload photos and videos captured during the event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              onClick={() => handleFileUpload('photo')}
              className="h-20 flex flex-col gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <Image className="h-6 w-6" />
              Upload Photos
            </Button>
            <Button 
              onClick={() => handleFileUpload('video')}
              className="h-20 flex flex-col gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <Video className="h-6 w-6" />
              Upload Videos
            </Button>
          </div>
          <div className="mt-4 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-400">
              Drag and drop files here, or click the buttons above to select files
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max 100MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Gallery */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Content Gallery</CardTitle>
          <CardDescription className="text-gray-300">
            Browse and manage uploaded content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMediaTab} onValueChange={setActiveMediaTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300"
              >
                All Content
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300"
              >
                Photos
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-300"
              >
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="text-center py-12">
                <Camera className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No content uploaded yet</h3>
                <p className="text-gray-400 mb-4">Start by uploading photos or videos from your event</p>
                <Button 
                  onClick={() => handleFileUpload('photo')}
                  className="bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <div className="text-center py-12">
                <Image className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No photos uploaded yet</h3>
                <p className="text-gray-400">Upload photos to see them here</p>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="text-center py-12">
                <Video className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No videos uploaded yet</h3>
                <p className="text-gray-400">Upload videos to see them here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventContentManager;