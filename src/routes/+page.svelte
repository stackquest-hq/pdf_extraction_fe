<script>
    import { onMount } from 'svelte';
    import Canvas from '$lib/components/Canvas.svelte';
    import FieldList from '$lib/components/FieldList.svelte';
    import TableExtraction from '$lib/components/TableExtraction.svelte';
    import { annotations } from '$lib/stores/annotations';
    import { fieldSelection } from '$lib/stores/fieldSelection';

    let imageFile = null;
    let imageUrl = null;
    let activeTab = 'fields'; // 'fields' or 'table'

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

    function handleTabChange(tab) {
        activeTab = tab;
        fieldSelection.setMode(tab);
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
        
        <div class="sidebar">
            <div class="tabs">
                <button 
                    class:active={activeTab === 'fields'} 
                    on:click={() => handleTabChange('fields')}
                >
                    Field Extraction
                </button>
                <button 
                    class:active={activeTab === 'table'} 
                    on:click={() => handleTabChange('table')}
                >
                    Table Extraction
                </button>
            </div>

            <div class="tab-content">
                {#if activeTab === 'fields'}
                    <FieldList />
                {:else}
                    <TableExtraction />
                {/if}
            </div>
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

    .sidebar {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid #ccc;
    }

    .tabs button {
        flex: 1;
        padding: 0.75rem;
        border: none;
        background: none;
        cursor: pointer;
        font-weight: 500;
    }

    .tabs button.active {
        background-color: #f0f0f0;
        border-bottom: 2px solid #4CAF50;
    }

    .tab-content {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #666;
    }
</style>