<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let isDragging = false;

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      dispatch('fileSelected', { file });
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      dispatch('fileSelected', { file });
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
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  role="button"
  tabindex="0"
  aria-label="File upload dropzone"
>
  <input 
    type="file" 
    accept="image/*" 
    on:change={handleImageUpload} 
    id="fileInput"
    class="file-input"
  />
  <label for="fileInput" class="dropzone-label">
    {#if isDragging}
      Drop your image here
    {:else}
      Drag and drop an image here or click to upload
    {/if}
  </label>
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
  }

  .dropzone.dragging {
    border-color: #4caf50;
    background-color: #f0f8f0;
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
</style> 