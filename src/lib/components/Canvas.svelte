<script>
  import { onMount } from 'svelte';
  import { annotations } from '$lib/stores/annotations';
  import { fieldSelection } from '$lib/stores/fieldSelection';

  export let imageUrl;
  
  let canvas;
  let ctx;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentRect = { x: 0, y: 0, width: 0, height: 0 };
  let hoveredAnnotation = null;
  let tableMode = false;

  // Subscribe to annotations changes
  $: if ($annotations) {
    drawAnnotations();
  }

  onMount(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      drawAnnotations();
    };
  });

  function isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
  }

  function handleMouseMove(e) {
    if (isDrawing) {
      draw(e);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is over any annotation
    hoveredAnnotation = $annotations.find(annotation => 
      isPointInRect(x, y, annotation.coordinates)
    );

    // Redraw to show hover effect
    drawAnnotations();
  }

  function handleMouseLeave() {
    if (isDrawing) {
      endDrawing();
    }
    hoveredAnnotation = null;
    drawAnnotations();
  }

  function drawAnnotations() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = imageUrl;
    ctx.drawImage(img, 0, 0);

    $annotations.forEach(annotation => {
      const isHovered = hoveredAnnotation === annotation;
      const scale = isHovered ? 1.1 : 1;
      const { x, y, width, height } = annotation.coordinates;
      
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      const scaledX = x - (scaledWidth - width) / 2;
      const scaledY = y - (scaledHeight - height) / 2;

      if (annotation.type === 'table_header') {
        ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
        ctx.strokeStyle = '#87CEEB';
      } else if (annotation.type === 'label') {
        ctx.fillStyle = 'rgba(240, 230, 140, 0.2)';
        ctx.strokeStyle = '#F0E68C';
      } else {
        ctx.fillStyle = 'rgba(144, 238, 144, 0.2)';
        ctx.strokeStyle = '#90EE90';
      }
      
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

      if (isHovered) {
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText(annotation.fieldName, scaledX, scaledY - 5);
      }
    });
  }

  function startDrawing(e) {
    if (!$fieldSelection.selectedField) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    currentRect = { x: startX, y: startY, width: 0, height: 0 };
  }

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    currentRect.width = currentX - startX;
    currentRect.height = currentY - startY;

    drawAnnotations();
    
    if ($fieldSelection.annotationType === 'table_header') {
      ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
      ctx.strokeStyle = '#87CEEB';
    } else if ($fieldSelection.annotationType === 'label') {
      ctx.fillStyle = 'rgba(240, 230, 140, 0.2)';
      ctx.strokeStyle = '#F0E68C';
    } else {
      ctx.fillStyle = 'rgba(144, 238, 144, 0.2)';
      ctx.strokeStyle = '#90EE90';
    }
    
    ctx.lineWidth = 2;
    ctx.fillRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
    ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
  }

  function endDrawing() {
    if (!isDrawing) return;
    isDrawing = false;

    const annotation = {
      id: crypto.randomUUID(),
      type: $fieldSelection.annotationType,
      fieldName: $fieldSelection.selectedField,
      coordinates: {
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.width,
        height: currentRect.height
      }
    };

    annotations.add(annotation);
    drawAnnotations();
  }
</script>

<div class="canvas-wrapper">
  <canvas
    bind:this={canvas}
    on:mousedown={startDrawing}
    on:mousemove={handleMouseMove}
    on:mouseup={endDrawing}
    on:mouseleave={handleMouseLeave}
  ></canvas>
</div>

<style>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  canvas {
    display: block;
  }
</style> 