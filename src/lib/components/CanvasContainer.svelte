<script>
  import Canvas from "./Canvas.svelte";
  import FileDropzone from "./FileDropzone.svelte";
  import ActionMenu from "./ActionMenu.svelte";
  import { annotations } from "$lib/stores/annotations";

  export let imageUrl = null;

  function handleFileSelected(event) {
    const { imageUrl: newImageUrl } = event.detail;
    imageUrl = "http://localhost:8000/" + newImageUrl;
  }

  function handleReupload() {
    imageUrl = null;
    annotations.set([]);
    document.getElementById('fileInput').click();
  }

  function handleExport() {
    // Transform annotations into the required format
    const fieldOfInterests = $annotations
      .filter(annotation => annotation.type === 'label')
      .map(annotation => ({
        label: annotation.fieldName,
        label_name: null,
        label_rect: {
          x0: annotation.coordinates.x,
          y0: annotation.coordinates.y,
          x1: annotation.coordinates.x + annotation.coordinates.width,
          y1: annotation.coordinates.y + annotation.coordinates.height
        }
      }));

    // Find the single end of table annotation
    const endOfTableAnnotation = $annotations.find(a => a.type === 'end_of_table');

    const tableAnnotations = {
      columns_list: $annotations
        .filter(annotation => annotation.type === 'table_header')
        .map(annotation => ({
          column: annotation.fieldName,
          column_name: null,
          colummn_rect: {
            x0: annotation.coordinates.x,
            y0: annotation.coordinates.y,
            x1: annotation.coordinates.x + annotation.coordinates.width,
            y1: annotation.coordinates.y + annotation.coordinates.height
          }
        })),
      end_of_table_name: null,
      end_of_table_rect: endOfTableAnnotation ? {
        x0: endOfTableAnnotation.coordinates.x,
        y0: endOfTableAnnotation.coordinates.y,
        x1: endOfTableAnnotation.coordinates.x + endOfTableAnnotation.coordinates.width,
        y1: endOfTableAnnotation.coordinates.y + endOfTableAnnotation.coordinates.height
      } : null
    };

    const exportData = {
      field_of_interests: fieldOfInterests,
      table_annotations: tableAnnotations
    };

    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="canvas-container">
  {#if imageUrl}
    <Canvas {imageUrl} />
    <ActionMenu on:reupload={handleReupload} on:export={handleExport} />
  {:else}
    <FileDropzone on:fileSelected={handleFileSelected} />
  {/if}
</div>

<style>
  .canvas-container {
    flex: 2;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
</style> 