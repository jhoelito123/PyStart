import { useRef, useState, useCallback, useEffect } from 'react';
import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Path,
} from 'react-hook-form';

interface UploadCoverProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentImage?: string;
  isOptional?: boolean;
}

const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const VALID_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

const validateImageFile = (file: File): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return (
    VALID_IMAGE_TYPES.includes(file.type) ||
    VALID_EXTENSIONS.includes(fileExtension || '')
  );
};

export const UploadCover = <T extends FieldValues>({
  name,
  register,
  error,
  onChange,
  currentImage,
  isOptional = false,
}: UploadCoverProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(currentImage || null);
      return;
    }

    if (!validateImageFile(file)) {
      setPreview(currentImage || null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      setPreview(currentImage || null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFile(file);

      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
    onChange?.(e);
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-3/12 flex flex-col gap-2">
      <label htmlFor={name as string}>
        Portada {!isOptional && <span className="text-red-400">*</span>}
      </label>
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`w-full h-64 border-[1px] rounded-md cursor-pointer 
        flex items-center justify-center relative overflow-hidden bg-neutral-50
        hover:bg-neutral-100 transition ${
          error ? 'border-red-400' : 'border-slate-900'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-center text-neutral-500 px-4">
            <p>Haz clic o arrastra una imagen aquí</p>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          {...register(name, {
            required: isOptional ? false : 'Por favor selecciona una imagen',
            validate: (fileList: FileList) => {
              if (isOptional && (!fileList || fileList.length === 0)) {
                return true;
              }

              if (!fileList || fileList.length === 0) {
                return 'Por favor selecciona una imagen';
              }

              const file = fileList[0];
              if (!validateImageFile(file)) {
                return 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP, SVG)';
              }

              return true;
            },
          })}
          ref={fileInputRef}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <span className="text-red-400 subtitle-sm text-wrap text-center">
          {String(error.message)}
        </span>
      )}
    </div>
  );
};
