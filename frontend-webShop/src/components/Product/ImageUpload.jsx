import { Upload, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export function ImageUpload({ register, watch, setValue }) {
  const [localPreview, setLocalPreview] = useState(null);
  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0 && imageFile[0] instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalPreview(reader.result);
      reader.readAsDataURL(imageFile[0]);
    } else if (typeof imageFile === 'string') {
      setLocalPreview(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="w-full space-y-4 text-left">
      <div className="relative aspect-3/4 w-full border border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden group">
        {/* Esquinas decorativas */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/30 group-hover:border-primary" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/30 group-hover:border-primary" />

        {localPreview ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={localPreview} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0" 
              alt="Preview" 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="p-4 bg-muted/20 border border-border">
              <Upload className="w-8 h-8 text-muted-foreground opacity-30 group-hover:text-primary group-hover:opacity-100" />
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                WAITING_FOR_MEDIA
              </span>
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          {...register("image")} 
          onChange={(e) => { register("image").onChange(e); }}
          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
          accept="image/*"
        />
        
        {/* Overlay: bg-background/80 para que se adapte al modo claro */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
          <div className="bg-foreground text-background px-6 py-3 flex items-center gap-3">
             {localPreview ? <RefreshCw size={14} /> : <Upload size={14} />}
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">
               {localPreview ? "REPLACE_SOURCE" : "LINK_MEDIA"}
             </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1 opacity-60">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-none ${localPreview ? 'bg-primary' : 'bg-muted-foreground'}`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
            {localPreview ? "STATUS: LINKED" : "STATUS: EMPTY"}
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase text-muted-foreground">Channel_02</span>
      </div>
    </div>
  );
}