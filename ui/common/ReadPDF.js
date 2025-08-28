import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

const ReadPDF = ({ label, onChange, accept }) => {
  const handleDrop = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Convertir el archivo a base64 y pasar el resultado al onChange
          const base64Data = Buffer.from(reader.result).toString('base64');
          const fileInfo = {
            name: file.name,
            base64Data: base64Data,
          };

          onChange(fileInfo);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error al leer el archivo:', error);
      }
    }
  };

  const handleFileRemove = () => {
    onChange(null);
  };

  return (
    <>
      <DropzoneArea
        acceptedFiles={accept ? [accept] : undefined}
        filesLimit={1}
        maxFileSize={838860800}
        onDrop={handleDrop}
        dropzoneText={label}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview
        previewGridProps={{
          container: { spacing: 1, direction: 'row' },
        }}
        previewText="Archivo(s) cargado(s):"
        onDelete={handleFileRemove} // Asigna handleFileRemove a onDelete
      />
    </>
  );
};

export default ReadPDF;
