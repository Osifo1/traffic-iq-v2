import { Upload, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveFeedProps {
  videoURL: string | null;
  videoName: string | null;
  setVideoURL: (url: string | null) => void;
  setVideoName: (name: string | null) => void;
}

import { useState, useRef } from "react";

const LiveFeed = ({ videoURL, videoName, setVideoURL, setVideoName }: LiveFeedProps) => {
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type === "video/mp4") {
      setSelectedFile(file);
      setVideoURL(URL.createObjectURL(file));
      setVideoName(file.name);
      setProgress(0);
    } else {
      alert("Please select a valid MP4 file.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRunDetection = () => {
    if (!selectedFile && !videoURL) {
      alert("Please upload an MP4 clip first.");
      return;
    }
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(false);
          return 100;
        }
        return p + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Feed</h1>
        <p className="text-sm text-muted-foreground">
          Upload a road footage clip and run vehicle detection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main video player */}
        <div className="lg:col-span-2">
          <div className="glow-card overflow-hidden">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {videoURL ? (
                <video
                  src={videoURL}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">No clip loaded</p>
                  <p className="text-xs text-muted-foreground/60">
                    Upload an MP4 file to begin
                  </p>
                </div>
              )}
              {videoURL && (
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] font-mono text-primary">
                  TRAFFICIQ V1 • {videoName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload panel */}
        <div className="space-y-4">
          <div className="glow-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Upload Video Clip
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={handleInputChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-primary bg-primary/10"
                  : videoURL
                  ? "border-primary/60 bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Upload className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              {videoURL ? (
                <>
                  <p className="text-sm text-primary font-medium truncate px-2">
                    {videoName}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Click to replace
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an MP4 file
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    or click to browse
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleRunDetection}
              disabled={processing || !videoURL}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              {processing ? "Processing..." : "Run Detection"}
            </Button>
          </div>

          {(processing || progress > 0) && (
            <div className="glow-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Processing</h3>
                <span className="text-xs font-mono text-primary">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress < 100
                  ? "Analyzing frames for vehicle and plate detection..."
                  : "Detection complete — results ready"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;