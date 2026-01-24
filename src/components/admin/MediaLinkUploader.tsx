import React, { useState } from 'react';
import { Plus, X, Link, Youtube, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { ProjectMedia } from '../../types';

interface MediaLinkUploaderProps {
  images: ProjectMedia[];
  videos: ProjectMedia[];
  onImagesChange: (images: ProjectMedia[]) => void;
  onVideosChange: (videos: ProjectMedia[]) => void;
  maxImages?: number;
  maxVideos?: number;
}

const MediaLinkUploader: React.FC<MediaLinkUploaderProps> = ({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  maxImages = 6,
  maxVideos = 2,
}) => {
  const [showLinkModal, setShowLinkModal] = useState<'image' | 'video' | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [error, setError] = useState('');

  // Validar URLs
  const validateUrl = (url: string, type: 'image' | 'video'): string | null => {
    try {
      new URL(url);
    } catch {
      return 'URL inválida. Certifique-se de incluir http:// ou https://';
    }

    if (type === 'video') {
      const isYoutube = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
      const isVimeo = /vimeo\.com\//.test(url);
      const isDrive = /drive\.google\.com\//.test(url);
      const isDropbox = /dropbox\.com\//.test(url);
      const isOneDrive = /onedrive\.live\.com\//.test(url);
      
      if (!isYoutube && !isVimeo && !isDrive && !isDropbox && !isOneDrive) {
        return 'Para vídeos, use links do YouTube, Vimeo, Google Drive, Dropbox ou OneDrive';
      }
    } else {
      const isDrive = /drive\.google\.com\//.test(url);
      const isDropbox = /dropbox\.com\//.test(url);
      const isOneDrive = /onedrive\.live\.com\//.test(url);
      const isDirectImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      
      if (!isDrive && !isDropbox && !isOneDrive && !isDirectImage) {
        return 'Para imagens, use links diretos ou do Google Drive, Dropbox, OneDrive';
      }
    }

    return null;
  };

  // Adicionar link
  const handleAddLink = () => {
    setError('');

    if (!linkUrl.trim()) {
      setError('Por favor, forneça um URL');
      return;
    }

    if (!linkTitle.trim()) {
      setError('Por favor, forneça um título');
      return;
    }

    const validationError = validateUrl(linkUrl, showLinkModal!);
    if (validationError) {
      setError(validationError);
      return;
    }

    const mediaItem: ProjectMedia = {
      id: `${showLinkModal}_${Date.now()}`,
      type: showLinkModal!,
      url: linkUrl,
      title: linkTitle,
      order: showLinkModal === 'image' ? images.length : videos.length,
      uploadedAt: new Date().toISOString(),
      source: 'link'
    };

    if (showLinkModal === 'image') {
      mediaItem.thumbnailUrl = linkUrl;
      mediaItem.alt = linkTitle;
      console.log('Adicionando imagem:', mediaItem);
      onImagesChange([...images, mediaItem]);
    } else {
      console.log('Adicionando vídeo:', mediaItem);
      const newVideos = [...videos, mediaItem];
      console.log('Array de vídeos após adição:', newVideos);
      onVideosChange(newVideos);
    }

    setLinkUrl('');
    setLinkTitle('');
    setShowLinkModal(null);
  };

  // Remover mídia
  const handleRemoveMedia = (id: string, type: 'image' | 'video') => {
    if (type === 'image') {
      onImagesChange(images.filter(img => img.id !== id));
    } else {
      onVideosChange(videos.filter(vid => vid.id !== id));
    }
  };

  // Mover mídia
  const handleMoveMedia = (id: string, direction: 'up' | 'down', type: 'image' | 'video') => {
    const items = type === 'image' ? images : videos;
    const currentIndex = items.findIndex(item => item.id === id);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    // Atualizar ordem
    newItems.forEach((item, index) => {
      item.order = index;
    });

    if (type === 'image') {
      onImagesChange(newItems);
    } else {
      onVideosChange(newItems);
    }
  };

  const getSourceIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <Youtube className="w-4 h-4 text-red-500" />;
    }
    if (url.includes('vimeo.com')) {
      return <Video className="w-4 h-4 text-blue-500" />;
    }
    if (url.includes('drive.google.com')) {
      return <ExternalLink className="w-4 h-4 text-green-500" />;
    }
    if (url.includes('dropbox.com')) {
      return <ExternalLink className="w-4 h-4 text-blue-600" />;
    }
    return <Link className="w-4 h-4 text-stone-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Imagens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-stone-900">
            Imagens ({images.length}/{maxImages})
          </h3>
          <button
            type="button"
            onClick={() => setShowLinkModal('image')}
            disabled={images.length >= maxImages}
            className="flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Link de Imagem
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="border border-stone-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-stone-500" />
                  {getSourceIcon(image.url)}
                  <span className="text-sm font-medium text-stone-900">
                    {image.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(image.id, 'image')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-xs text-stone-600 mb-2 break-all">
                {image.url}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveMedia(image.id, 'up', 'image')}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveMedia(image.id, 'down', 'image')}
                  disabled={index === images.length - 1}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded disabled:opacity-50"
                >
                  ↓
                </button>
                <span className="text-xs text-stone-500">
                  {index === 0 ? '(Principal)' : `Posição ${index + 1}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vídeos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-stone-900">
            Vídeos ({videos.length}/{maxVideos})
          </h3>
          <button
            type="button"
            onClick={() => setShowLinkModal('video')}
            disabled={videos.length >= maxVideos}
            className="flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Link de Vídeo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {videos.map((video, index) => (
            <div key={video.id} className="border border-stone-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-stone-500" />
                  {getSourceIcon(video.url)}
                  <span className="text-sm font-medium text-stone-900">
                    {video.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(video.id, 'video')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-xs text-stone-600 mb-2 break-all">
                {video.url}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveMedia(video.id, 'up', 'video')}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveMedia(video.id, 'down', 'video')}
                  disabled={index === videos.length - 1}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded disabled:opacity-50"
                >
                  ↓
                </button>
                <span className="text-xs text-stone-500">
                  Posição {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para adicionar link */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-stone-900">
                Adicionar {showLinkModal === 'image' ? 'Imagem' : 'Vídeo'}
              </h3>
              <button
                onClick={() => {
                  setShowLinkModal(null);
                  setLinkUrl('');
                  setLinkTitle('');
                  setError('');
                }}
                className="text-stone-500 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={showLinkModal === 'image' 
                    ? 'https://drive.google.com/file/d/...' 
                    : 'https://youtube.com/watch?v=...'
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Nome descritivo para este arquivo"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div className="text-xs text-stone-600">
                {showLinkModal === 'image' ? (
                  <p>Suportado: Google Drive, Dropbox, OneDrive ou links diretos de imagem</p>
                ) : (
                  <p>Suportado: YouTube, Vimeo, Google Drive, Dropbox, OneDrive</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLinkModal(null);
                  setLinkUrl('');
                  setLinkTitle('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLink}
                className="flex-1 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLinkUploader;
