import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type YouTubePlayerApi = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
};

type YouTubeApi = {
  PlayerState: { PLAYING: number; ENDED: number };
  Player: new (element: HTMLElement, options: {
    videoId: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: (event: { target: YouTubePlayerApi }) => void;
      onStateChange: (event: { data: number }) => void;
    };
  }) => YouTubePlayerApi;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiLoad: Promise<void> | undefined;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiLoad) return youtubeApiLoad;

  youtubeApiLoad = new Promise<void>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => reject(new Error('No se pudo cargar el reproductor de YouTube'));
    document.head.appendChild(script);
  });

  return youtubeApiLoad;
}

export function YouTubeCoursePlayer({ embedUrl, title, onEnded }: { embedUrl: string; title: string; onEnded: () => void }) {
  const playerTargetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerApi | null>(null);
  const onEndedRef = useRef(onEnded);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  onEndedRef.current = onEnded;

  useEffect(() => {
    let cancelled = false;
    const videoId = new URL(embedUrl).pathname.split('/').filter(Boolean).slice(-1)[0];
    if (!videoId || !playerTargetRef.current) return;

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !playerTargetRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(playerTargetRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.getIframe().classList.add('player-video-el', 'youtube-player-iframe');
            setReady(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) setPlaying(true);
            if (event.data === window.YT?.PlayerState.ENDED) {
              setPlaying(false);
              onEndedRef.current();
            }
            if (event.data === 2) setPlaying(false);
          },
        },
      });
    }).catch(() => setReady(false));

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [embedUrl]);

  const sendCommand = (func: 'playVideo' | 'pauseVideo' | 'setVolume' | 'mute' | 'unMute', args: number[] = []) => {
    const player = playerRef.current;
    if (!player) return;
    if (func === 'setVolume') player.setVolume(args[0] ?? 100);
    else if (func === 'mute' || func === 'unMute') player[func]();
    else player[func]();
  };

  const togglePlayback = () => {
    sendCommand(playing ? 'pauseVideo' : 'playVideo');
  };

  return <div className="player-video player-video-external">
    <div className="youtube-player-stage">
      <div ref={playerTargetRef} title={title} />
      <div className="youtube-player-overlay">
        {!playing && <button className="youtube-player-start" onClick={togglePlayback} disabled={!ready} aria-label="Reproducir video"><Play size={30} fill="currentColor" /></button>}
        <div className="youtube-player-controls">
          <button className="youtube-player-control" onClick={togglePlayback} disabled={!ready} aria-label={playing ? 'Pausar video' : 'Reproducir video'} title={playing ? 'Pausar' : 'Reproducir'}>
            {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          </button>
          {volume === 0 ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <input type="range" min="0" max="100" value={volume} aria-label="Volumen" disabled={!ready} onChange={(event) => {
            const nextVolume = Number(event.target.value);
            setVolume(nextVolume);
            sendCommand('setVolume', [nextVolume]);
            if (nextVolume === 0) sendCommand('mute');
            else sendCommand('unMute');
          }} />
        </div>
      </div>
    </div>
  </div>;
}

export function VimeoCoursePlayer({ embedUrl, title, onEnded }: { embedUrl: string; title: string; onEnded: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onEndedRef = useRef(onEnded);
  const playerId = useRef(`vimeo-player-${Math.random().toString(36).slice(2)}`);
  onEndedRef.current = onEnded;
  const playerUrl = new URL(embedUrl);
  playerUrl.searchParams.set('api', '1');
  playerUrl.searchParams.set('player_id', playerId.current);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://player.vimeo.com' || event.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string };
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) as { event?: string } : event.data;
      } catch {
        return;
      }
      if (data.event === 'ended') onEndedRef.current();
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return <div className="player-video player-video-external"><iframe ref={iframeRef} className="player-video-el" src={playerUrl.toString()} title={title} allow="encrypted-media" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ended', player_id: playerId.current }), 'https://player.vimeo.com')} /></div>;
}

export function PdfPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<import('pdfjs-dist').PDFDocumentLoadingTask | null>(null);
  const documentRef = useRef<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const onEndedRef = useRef(onEnded);
  const notifiedLastPageRef = useRef(0);
  const [pdfDocument, setPdfDocument] = useState<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  onEndedRef.current = onEnded;

  useEffect(() => {
    let cancelled = false;
    const loadPdf = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const loadingTask = pdfjs.getDocument({
          url: src,
          rangeChunkSize: 65536,
          disableStream: true,
          disableAutoFetch: true,
        });
        loadingTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;
        if (cancelled) {
          await pdf.destroy();
          return;
        }
        documentRef.current = pdf;
        setPageCount(pdf.numPages);
        setPdfDocument(pdf);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo cargar el PDF.');
      }
    };
    void loadPdf();
    return () => {
      cancelled = true;
      documentRef.current = null;
      const loadingTask = loadingTaskRef.current;
      loadingTaskRef.current = null;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [src]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setStageWidth(stage.clientWidth));
    observer.observe(stage);
    setStageWidth(stage.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pdf = pdfDocument;
    const canvas = canvasRef.current;
    if (!pdf || !canvas || !stageWidth) return;
    let cancelled = false;
    let renderTask: import('pdfjs-dist').RenderTask | undefined;
    setPageReady(false);
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(1.5, Math.max(0.1, (stageWidth - 32) / baseViewport.width));
        const viewport = page.getViewport({ scale: fitScale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('El navegador no pudo preparar la página PDF.');
        canvas.width = Math.ceil(viewport.width * outputScale);
        canvas.height = Math.ceil(viewport.height * outputScale);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        });
        await renderTask.promise;
        if (cancelled) return;
        setPageReady(true);
        if (pageNumber === pdf.numPages && notifiedLastPageRef.current !== pdf.numPages) {
          notifiedLastPageRef.current = pdf.numPages;
          onEndedRef.current();
        }
      } catch (error) {
        if (!cancelled && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
          setLoadError(error instanceof Error ? error.message : 'No se pudo mostrar esta página PDF.');
        }
      }
    };
    void renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, pageNumber, stageWidth]);

  return <div className="player-pdf">
    <div ref={stageRef} className="player-pdf-stage">
      <canvas ref={canvasRef} className="player-pdf-page" aria-label={`${title}, página ${pageNumber}`} />
      {!pageReady && !loadError && <div className="player-pdf-status">{pdfDocument ? 'Cargando página...' : 'Cargando PDF...'}</div>}
      {loadError && <div className="player-pdf-status player-pdf-error">No se pudo mostrar el PDF. {loadError}</div>}
    </div>
    {pageCount > 0 && <div className="player-pdf-controls">
      <button className="outline-button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1} aria-label="Página anterior"><ChevronLeft size={17} />Anterior</button>
      <span className="player-pdf-count">Página {pageNumber} de {pageCount}</span>
      <button className="outline-button" onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))} disabled={pageNumber >= pageCount} aria-label="Página siguiente">Siguiente<ChevronRight size={17} /></button>
    </div>}
  </div>;
}

export function PowerPointPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import('@file-viewer/pptx').PptxViewer | null>(null);
  const onEndedRef = useRef(onEnded);
  const endedRef = useRef(false);
  const [slideNumber, setSlideNumber] = useState(1);
  const [slideCount, setSlideCount] = useState(0);
  const [viewerReady, setViewerReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [slideAspectRatio, setSlideAspectRatio] = useState('16 / 9');
  const [loadingStage, setLoadingStage] = useState<'download' | 'render'>('download');
  const [downloadPercent, setDownloadPercent] = useState<number | null>(null);
  const [renderPercent, setRenderPercent] = useState<number | null>(null);
  onEndedRef.current = onEnded;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    let cancelled = false;
    let renderingComplete = false;
    let slideCountTimer: number | undefined;
    let downloadRequest: XMLHttpRequest | null = null;
    let viewer: import('@file-viewer/pptx').PptxViewer | null = null;
    const downloadPresentation = (url: string) => new Promise<ArrayBuffer>((resolve, reject) => {
      const request = new XMLHttpRequest();
      downloadRequest = request;
      request.open('GET', url);
      request.responseType = 'arraybuffer';
      request.onprogress = (event) => {
        if (!cancelled && event.lengthComputable) setDownloadPercent(Math.round((event.loaded / event.total) * 100));
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) resolve(request.response as ArrayBuffer);
        else reject(new Error(`No se pudo descargar la presentación (${request.status})`));
      };
      request.onerror = () => reject(new Error('Error de red al descargar la presentación.'));
      request.onabort = () => reject(new Error('Se canceló la descarga de la presentación.'));
      request.send();
    });
    const loadPresentation = async () => {
      try {
        setLoadingStage('download');
        const [buffer, { PptxViewer }] = await Promise.all([downloadPresentation(src), import('@file-viewer/pptx')]);
        if (cancelled) return;
        setLoadingStage('render');
        viewer = await PptxViewer.open(buffer, target, {
          fitMode: 'contain',
          lazySlides: true,
          listOptions: { windowed: true, initialSlides: 1, batchSize: 1 },
          onSlideRendered: (slideIndex) => {
            if (!cancelled) setSlideCount((count) => Math.max(count, slideIndex));
          },
          onSlideSize: (size) => {
            if (size.width && size.height && !cancelled) setSlideAspectRatio(`${size.width} / ${size.height}`);
          },
          onProgress: (progress) => {
            if (!cancelled && Number.isFinite(progress)) setRenderPercent(Math.max(0, Math.min(100, Math.round(progress))));
          },
          onRenderComplete: () => {
            renderingComplete = true;
            if (slideCountTimer !== undefined) window.clearInterval(slideCountTimer);
            if (!cancelled && viewer) {
              setSlideCount(viewer.slideCount);
              setLoaded(true);
            }
          },
          onError: (error) => {
            if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo procesar la presentación.');
          },
        });
        if (cancelled) viewer.destroy();
        else {
          viewerRef.current = viewer;
          setViewerReady(true);
          slideCountTimer = window.setInterval(() => setSlideCount((count) => Math.max(count, viewer?.slideCount ?? 0)), 100);
          if (renderingComplete) {
            window.clearInterval(slideCountTimer);
            setSlideCount(viewer.slideCount);
            setLoaded(true);
          }
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo cargar la presentación.');
      }
    };
    void loadPresentation();
    return () => {
      cancelled = true;
      downloadRequest?.abort();
      if (slideCountTimer !== undefined) window.clearInterval(slideCountTimer);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewerReady || !viewer || slideCount === 0) return;
    viewer.content.classList.add('is-presenting');
    viewer.ensureSlideRendered(slideNumber);
    for (const slot of Array.from(viewer.content.children)) {
      if (slot instanceof HTMLElement && slot.classList.contains('flyfish-pptx-slide-slot')) {
        slot.classList.toggle('is-active-slide', Number(slot.dataset.slideNumber) === slideNumber);
      }
    }
    viewer.refreshLayout();
    if (loaded && slideNumber === slideCount && !endedRef.current) {
      endedRef.current = true;
      onEndedRef.current();
    }
  }, [slideCount, slideNumber, loaded, viewerReady]);

  const goToSlide = (nextSlide: number) => {
    if (nextSlide < 1 || nextSlide > slideCount) return;
    setSlideNumber(nextSlide);
  };

  return <div className="player-slides">
    <div className="player-slides-stage" style={{ aspectRatio: slideAspectRatio }}><div ref={targetRef} className="player-slides-renderer" />
      {!slideCount && !loadError && <div className="player-slides-status">{loadingStage === 'download' ? 'Descargando presentación...' : 'Preparando primera diapositiva...'}</div>}
      {loadError && <div className="player-slides-status player-slides-error">{loadError}</div>}
    </div>
    {slideCount > 0 && <div className="player-slides-controls">
      <button className="outline-button" onClick={() => goToSlide(slideNumber - 1)} disabled={slideNumber <= 1} aria-label="Diapositiva anterior"><ChevronLeft size={17} />Anterior</button>
      <span className="player-slides-count">{slideNumber} / {loaded ? slideCount : `${slideCount}+`}</span>
      <button className="outline-button" onClick={() => goToSlide(slideNumber + 1)} disabled={slideNumber >= slideCount && !loaded} aria-label="Diapositiva siguiente">Siguiente<ChevronRight size={17} /></button>
    </div>}
    {!loaded && !loadError && <div className="player-slides-progress">
      <div className="player-slides-progress-track"><span style={{ width: `${loadingStage === 'download' ? downloadPercent ?? 0 : renderPercent ?? 0}%` }} /></div>
      <small>{loadingStage === 'download'
        ? downloadPercent === null ? 'Descargando archivo de presentación' : `Descargando archivo de presentación · ${downloadPercent}%`
        : `Preparando diapositivas · ${slideCount} listas${renderPercent === null ? '' : ` · ${renderPercent}%`}`}</small>
    </div>}
    <span className="sr-only">{title}</span>
  </div>;
}

export function UploadedVideoPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  onEndedRef.current = onEnded;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  const setVideoVolume = (value: number) => {
    setVolume(value);
    if (!videoRef.current) return;
    videoRef.current.volume = value / 100;
    videoRef.current.muted = value === 0;
  };

  return <div className="player-video player-video-external">
    <div className="youtube-player-stage">
      <video
        ref={videoRef}
        className="custom-player-media"
        src={src}
        title={title}
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEndedRef.current();
        }}
      />
      <div className="youtube-player-overlay">
        {!playing && <button className="youtube-player-start" onClick={togglePlayback} disabled={!ready} aria-label="Reproducir video"><Play size={30} fill="currentColor" /></button>}
        <div className="youtube-player-controls">
          <button className="youtube-player-control" onClick={togglePlayback} disabled={!ready} aria-label={playing ? 'Pausar video' : 'Reproducir video'} title={playing ? 'Pausar' : 'Reproducir'}>
            {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          </button>
          {volume === 0 ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <input type="range" min="0" max="100" value={volume} aria-label="Volumen" disabled={!ready} onChange={(event) => setVideoVolume(Number(event.target.value))} />
        </div>
      </div>
    </div>
  </div>;
}
