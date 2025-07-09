import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileUploadService } from '@/services/fileUploadService';
import { 
  Upload, 
  Image, 
  Video, 
  Camera, 
  Eye,
  Download,
  Grid,
  List,
  Trash2,
  Play,
  X
} from 'lucide-react';

interface EventContentManagerProps {
  eventId: string;
}

const EventContentManager: React.FC<EventContentManagerProps> = ({ eventId }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMediaTab, setActiveMediaTab] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load files when component mounts or eventId changes
  useEffect(() => {
    if (eventId) {
      loadFiles();
    }
  }, [eventId]);

  const loadFiles = async () => {
    try {
      const eventFiles = await FileUploadService.getEventFiles(eventId);
      setFiles(eventFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error loading files",
        description: "Could not load event files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (type: 'photo' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*';
      fileInputRef.current.multiple = true;
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        await FileUploadService.uploadFile(file, eventId, 'general');
      }
      
      toast({
        title: "Upload successful",
        description: `${selectedFiles.length} file(s) uploaded successfully.`,
      });
      
      // Reload files
      await loadFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await FileUploadService.deleteFile(fileId);
      toast({
        title: "File deleted",
        description: "File has been deleted successfully.",
      });
      await loadFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFilteredFiles = () => {
    switch (activeMediaTab) {
      case 'photos':
        return files.filter(file => file.file_type === 'image');
      case 'videos':
        return files.filter(file => file.file_type === 'video');
      default:
        return files;
    }
  };

  const openFilePreview = (file: any) => {
    setSelectedFile(file);
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
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
              disabled={uploading}
              className="h-20 flex flex-col gap-2 bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
            >
              <Image className="h-6 w-6" />
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
            <Button 
              onClick={() => handleFileUpload('video')}
              disabled={uploading}
              className="h-20 flex flex-col gap-2 bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
            >
              <Video className="h-6 w-6" />
              {uploading ? 'Uploading...' : 'Upload Videos'}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <div className="mt-4 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-400">
              Click the buttons above to select files for upload
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
              <FileGrid files={getFilteredFiles()} onPreview={openFilePreview} onDelete={handleDeleteFile} />
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <FileGrid files={getFilteredFiles()} onPreview={openFilePreview} onDelete={handleDeleteFile} />
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <FileGrid files={getFilteredFiles()} onPreview={openFilePreview} onDelete={handleDeleteFile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal 
          file={selectedFile} 
          onClose={closeFilePreview} 
        />
      )}
    </div>
  );
};

// File Grid Component
const FileGrid: React.FC<{
  files: any[];
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
}> = ({ files, onPreview, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="h-12 w-12 mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No content uploaded yet</h3>
        <p className="text-gray-400">Start by uploading photos or videos from your event</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// File Card Component
const FileCard: React.FC<{
  file: any;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
}> = ({ file, onPreview, onDelete }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const loadImageUrl = async () => {
      try {
        const url = await FileUploadService.getFileUrl(file.storage_path);
        if (url) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error('Error loading file URL:', error);
      }
    };

    loadImageUrl();
  }, [file.storage_path]);

  return (
    <div className="relative group bg-gray-800 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        {file.file_type === 'image' ? (
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={file.file_name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onPreview(file)}
          />
        ) : (
          <div 
            className="w-full h-full bg-gray-700 flex items-center justify-center cursor-pointer"
            onClick={() => onPreview(file)}
          >
            <Play className="h-8 w-8 text-white" />
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onPreview(file)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <p className="text-white text-sm truncate">{file.file_name}</p>
        <p className="text-gray-400 text-xs">
          {(file.file_size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
};

// File Preview Modal
const FilePreviewModal: React.FC<{
  file: any;
  onClose: () => void;
}> = ({ file, onClose }) => {
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    const loadFileUrl = async () => {
      try {
        const url = await FileUploadService.getFileUrl(file.storage_path);
        if (url) {
          setFileUrl(url);
        }
      } catch (error) {
        console.error('Error loading file URL:', error);
      }
    };

    loadFileUrl();
  }, [file.storage_path]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {file.file_type === 'image' ? (
          <img 
            src={fileUrl} 
            alt={file.file_name}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <video 
            src={fileUrl} 
            controls
            className="w-full h-full rounded-lg"
          />
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded">
          <p className="font-medium">{file.file_name}</p>
          <p className="text-sm text-gray-300">
            {(file.file_size / 1024 / 1024).toFixed(1)} MB • {file.file_type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventContentManager;