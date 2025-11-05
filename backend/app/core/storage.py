"""
Supabase Storage Service for Persistent Image Uploads

This module handles file uploads to Supabase Storage, ensuring images
persist across Heroku dyno restarts and deployments.
"""

import os
import uuid
from typing import Optional
from supabase import create_client, Client
from app.config import settings
import httpx

class StorageService:
    """Service for managing file uploads to Supabase Storage."""
    
    def __init__(self):
        """Initialize Supabase client if credentials are configured."""
        self.client: Optional[Client] = None
        self.bucket: str = settings.SUPABASE_STORAGE_BUCKET
        
        # Debug: Check what values are being read
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_KEY
        supabase_bucket = settings.SUPABASE_STORAGE_BUCKET
        
        # Also check os.environ directly as fallback
        env_url = os.environ.get('SUPABASE_URL')
        env_key = os.environ.get('SUPABASE_KEY')
        env_bucket = os.environ.get('SUPABASE_STORAGE_BUCKET')
        
        print(f"[DEBUG] Settings.SUPABASE_URL: {supabase_url}")
        print(f"[DEBUG] Settings.SUPABASE_KEY: {supabase_key[:20] if supabase_key else 'None'}...")
        print(f"[DEBUG] Settings.SUPABASE_STORAGE_BUCKET: {supabase_bucket}")
        print(f"[DEBUG] os.environ SUPABASE_URL: {env_url}")
        print(f"[DEBUG] os.environ SUPABASE_KEY: {env_key[:20] if env_key else 'None'}...")
        print(f"[DEBUG] os.environ SUPABASE_STORAGE_BUCKET: {env_bucket}")
        
        # Use os.environ values if settings are still using defaults
        if supabase_url == "https://your-project.supabase.co" and env_url:
            supabase_url = env_url
            print(f"[DEBUG] Using os.environ SUPABASE_URL: {supabase_url}")
        if supabase_key == "your-supabase-anon-key" and env_key:
            supabase_key = env_key
            print(f"[DEBUG] Using os.environ SUPABASE_KEY")
        if env_bucket:
            self.bucket = env_bucket
            print(f"[DEBUG] Using os.environ SUPABASE_STORAGE_BUCKET: {self.bucket}")
        
        # Only initialize if Supabase is configured
        if supabase_url and supabase_key and supabase_url != "https://your-project.supabase.co" and supabase_key != "your-supabase-anon-key":
            try:
                # Simple initialization - newer supabase versions handle this correctly
                self.client = create_client(supabase_url, supabase_key)
                print(f"✅ Supabase Storage initialized (bucket: {self.bucket})")
            except Exception as e:
                print(f"⚠️  Warning: Could not initialize Supabase Storage: {e}")
                import traceback
                print(traceback.format_exc())
                print("⚠️  Images will fall back to local storage (will be lost on dyno restart)")
        else:
            print("⚠️  Warning: Supabase Storage not configured. Images will use local storage.")
            print(f"   URL: {supabase_url}")
            print(f"   Key: {'Set' if supabase_key and supabase_key != 'your-supabase-anon-key' else 'Not set'}")
    
    def upload_file(self, file_content: bytes, filename: str, content_type: str = "image/jpeg") -> Optional[str]:
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_content: The file content as bytes
            filename: The filename to use in storage
            content_type: MIME type of the file
            
        Returns:
            Public URL of the uploaded file, or None if upload failed
        """
        if not self.client:
            return None
        
        try:
            # Upload to Supabase Storage
            # The upload method expects file path and file content
            response = self.client.storage.from_(self.bucket).upload(
                path=filename,
                file=file_content,
                file_options={
                    "content-type": content_type,
                    "upsert": True  # Overwrite if exists
                }
            )
            
            # Check if upload was successful
            if response and not isinstance(response, dict) or response.get('error'):
                raise Exception(f"Upload failed: {response}")
            
            # Get public URL - Supabase returns full URL
            public_url_response = self.client.storage.from_(self.bucket).get_public_url(filename)
            
            # If get_public_url returns a dict, extract the URL
            if isinstance(public_url_response, dict):
                public_url = public_url_response.get('publicUrl') or public_url_response.get('url')
            else:
                public_url = public_url_response
            
            # Fallback: construct URL manually if needed
            if not public_url or not public_url.startswith('http'):
                # Construct URL from Supabase URL
                project_ref = settings.SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
                public_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/{self.bucket}/{filename}"
            
            print(f"✅ File uploaded to Supabase: {filename}")
            return public_url
            
        except Exception as e:
            print(f"❌ Supabase upload failed: {e}")
            import traceback
            print(traceback.format_exc())
            return None
    
    def delete_file(self, filename: str) -> bool:
        """
        Delete a file from Supabase Storage.
        
        Args:
            filename: The filename to delete
            
        Returns:
            True if deletion succeeded, False otherwise
        """
        if not self.client:
            return False
        
        try:
            # Extract filename from URL if full URL is provided
            if filename.startswith("http"):
                filename = filename.split("/")[-1]
            
            self.client.storage.from_(self.bucket).remove([filename])
            print(f"✅ File deleted from Supabase: {filename}")
            return True
        except Exception as e:
            print(f"❌ Supabase delete failed: {e}")
            return False
    
    def is_configured(self) -> bool:
        """Check if Supabase Storage is properly configured."""
        return self.client is not None

# Global storage service instance
_storage_service: Optional[StorageService] = None

def get_storage_service() -> StorageService:
    """Get or create the global storage service instance."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
