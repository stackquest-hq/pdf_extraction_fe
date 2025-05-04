<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let isDragging = false;
  let isUploading = false;
  let error = null;

  async function uploadFile(file) {
    if (!file || file.type !== 'application/pdf') {
      error = 'Please upload a PDF file';
      return;
    }

    isUploading = true;
    error = null;

    try {
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('dpi', '300');

      const response = await fetch('http://localhost:8000/api/v1/pdf-to-image-converter', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.image_url) {
        throw new Error('No image URL in response');
      }
      
      dispatch('fileSelected', { imageUrl: data.image_url });
    } catch (err) {
      error = err.message || 'Failed to upload file';
    } finally {
      isUploading = false;
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    isDragging = false;
  }
</script>

<div 
  class="dropzone" 
  class:dragging={isDragging}
  class:uploading={isUploading}
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  role="button"
  tabindex="0"
  aria-label="PDF file upload dropzone"
>
  <input 
    type="file" 
    accept=".pdf,application/pdf" 
    on:change={handleFileUpload} 
    id="fileInput"
    class="file-input"
  />
  <label for="fileInput" class="dropzone-label">
    {#if isUploading}
      Uploading PDF...
    {:else if isDragging}
      Drop your PDF here
    {:else}
      Drag and drop a PDF here or click to upload
    {/if}
  </label>
  {#if error}
    <div class="error-message" role="alert">
      {error}
    </div>
  {/if}
</div>

<style>
  .dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border: 2px dashed #ccc;
    border-radius: 4px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fafafa;
    margin: 1rem;
    position: relative;
  }

  .dropzone.dragging {
    border-color: #4caf50;
    background-color: #f0f8f0;
  }

  .dropzone.uploading {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .dropzone-label {
    display: block;
    cursor: pointer;
    color: #666;
    font-size: 1.2rem;
  }

  .file-input {
    display: none;
  }

  .error-message {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    color: #dc3545;
    font-size: 0.9rem;
    background-color: #fff;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style> 