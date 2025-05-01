<script>
    import { onMount } from 'svelte';
    import Canvas from '$lib/components/Canvas.svelte';
    import FieldList from '$lib/components/FieldList.svelte';
    import { annotations } from '$lib/stores/annotations';

    let imageFile = null;
    let imageUrl = null;

    function handleImageUpload(event) {
        const target = event.target;
        const file = target.files?.[0];
        if (file) {
            imageFile = file;
            imageUrl = URL.createObjectURL(file);
        }
    }

    function exportAnnotations() {
        const data = JSON.stringify($annotations, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        a.click();
        URL.revokeObjectURL(url);
    }
</script>

<div class="container">
    <div class="header">
        <input type="file" accept="image/*" on:change={handleImageUpload} />
        <button on:click={exportAnnotations}>Export Annotations</button>
    </div>
    
    <div class="main-content">
        <div class="canvas-container">
            {#if imageUrl}
                <Canvas {imageUrl} />
            {:else}
                <div class="placeholder">Upload an image to begin annotation</div>
            {/if}
        </div>
        
        <div class="field-list-container">
            <FieldList />
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem;
    }

    .header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .main-content {
        display: flex;
        gap: 1rem;
        flex: 1;
        min-height: 0;
    }

    .canvas-container {
        flex: 2;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
    }

    .field-list-container {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 1rem;
    }

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #666;
    }
</style>