import { useRef, useState, useCallback, useEffect } from 'react';
import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Path,
  UseFormSetValue,
  useFormContext,
  UseFormTrigger,
} from 'react-hook-form';

interface UploadVideoProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  error?: FieldError;
  currentVideo?: string;
  trigger?: UseFormTrigger<T>; // <- así, con el tipo correcto
}

export const UploadVideo = <T extends FieldValues>({
  name,
  register,
  setValue,
  error,
  currentVideo,
  trigger, // <- desestructurado correctamente
}: UploadVideoProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(currentVideo || null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (currentVideo) {
      setVideoUrl(currentVideo);
    }
  }, [currentVideo]);

  const handleFile = async (file: File | null) => {
    if (!file) {
      setVideoUrl(currentVideo || null);
      setValue(name, null as any);
      if (trigger) await trigger(name);
      return;
    }

    if (!file.type.startsWith('video/')) {
      setFileError('Solo se permiten archivos de video (MP4, WebM, OGG, etc.)');
      setVideoUrl(currentVideo || null);
      setValue(name, null as any);
      if (trigger) await trigger(name);
      return;
    }

    setFileError(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setValue(name, [file] as any);
    if (trigger) await trigger(name); // validamos manualmente para que react-hook-form actualice su estado
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
    handleFile(file);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    await handleFile(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name as string}>
        Video {!currentVideo && <span className="text-red-400">*</span>}
      </label>
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`w-full h-56 border-[1px] rounded-md cursor-pointer 
        flex items-center justify-center relative overflow-hidden bg-neutral-50
        hover:bg-neutral-100 transition ${
          fileError || error ? 'border-red-400' : 'border-slate-900'
        }`}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-neutral-500 px-4">
            <p>Haz clic o arrastra un archivo de video aquí</p>
          </div>
        )}
        <input
          type="file"
          accept="video/*"
          {...register(name, {
            required: currentVideo ? false : 'Por favor selecciona un video',
            validate: (fileList) => {
              if (currentVideo && (!fileList || fileList.length === 0)) {
                return true;
              }
              return (
                fileList?.[0]?.type.startsWith('video/') ||
                'Solo se permiten archivos de video (MP4, WebM, etc.)'
              );
            },
          })}
          ref={(e) => {
            fileInputRef.current = e;
          }}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {fileError && (
        <span className="text-red-400 subtitle-sm text-wrap text-center">
          {fileError}
        </span>
      )}

      {error && (
        <span className="text-red-400 subtitle-sm text-wrap text-center">
          {String(error.message)}
        </span>
      )}
    </div>
  );
};
