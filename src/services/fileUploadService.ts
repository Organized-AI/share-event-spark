import { supabase } from '@/integrations/supabase/client';

export interface FileUploadResult {
  id: string;
  fileName: string;
  storagePath: string;
  thumbnailPath?: string;
}

export class FileUploadService {
  static async uploadFile(
    file: File,
    eventId: string,
    folderName: string = 'general'
  ): Promise<FileUploadResult> {
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const storagePath = `${eventId}/${folderName}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-files')
        .upload(storagePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Determine file type
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document';

      // Insert file record
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          event_id: eventId,
          uploader_id: '00000000-0000-0000-0000-000000000000', // placeholder since auth is disabled
          file_name: file.name,
          file_size: file.size,
          file_type: fileType,
          folder_name: folderName,
          mime_type: file.type,
          storage_path: storagePath,
          upload_completed: true
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return {
        id: fileRecord.id,
        fileName: file.name,
        storagePath: storagePath
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  static async getEventFiles(eventId: string, fileType?: 'image' | 'video' | 'document') {
    let query = supabase
      .from('files')
      .select('*')
      .eq('event_id', eventId)
      .eq('upload_completed', true)
      .order('created_at', { ascending: false });

    if (fileType) {
      query = query.eq('file_type', fileType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async getFileUrl(storagePath: string) {
    const { data } = await supabase.storage
      .from('event-files')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    return data?.signedUrl;
  }

  static async deleteFile(fileId: string) {
    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('storage_path')
      .eq('id', fileId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('event-files')
      .remove([fileData.storage_path]);

    if (storageError) {
      throw storageError;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw dbError;
    }
  }
}