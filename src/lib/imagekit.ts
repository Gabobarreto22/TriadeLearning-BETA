import { supabase } from './supabase';

export type ResourceType = 'image' | 'video' | 'pdf' | 'powerpoint';

export type UploadedFile = {
  url: string;
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
  fileType: string;
};

export function detectResourceType(mimeType: string | undefined | null, fileName?: string): ResourceType {
  const normalizedMime = (mimeType ?? '').toLowerCase();
  const normalizedName = (fileName ?? '').toLowerCase();

  if (normalizedMime.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)$/i.test(normalizedName)) return 'image';
  if (normalizedMime.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv|wmv|m4v|flv)$/i.test(normalizedName)) return 'video';
  if (normalizedMime === 'application/pdf' || normalizedName.endsWith('.pdf')) return 'pdf';
  if (normalizedMime.includes('presentation') || normalizedMime.includes('powerpoint') || /\.(ppt|pptx)$/i.test(normalizedName)) return 'powerpoint';

  return 'pdf';
}

export async function uploadToImageKit(file: File, folder: string = 'general'): Promise<UploadedFile> {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error('No autenticado');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('folder', folder);

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-imagekit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Error de subida' }));
    throw new Error(err.error ?? `Error ${response.status}`);
  }

  const result = await response.json();
  if (!result.url) throw new Error('Respuesta inválida del servidor');

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
    size: result.size,
    mimeType: result.mimeType,
    fileType: result.fileType,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error('No autenticado');

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-imagekit`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Error de eliminación' }));
    throw new Error(err.error ?? `Error ${response.status}`);
  }
}
