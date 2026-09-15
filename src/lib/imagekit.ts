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

export function detectResourceType(mimeType: string | undefined | null): ResourceType {
  if (!mimeType) return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'powerpoint';
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
