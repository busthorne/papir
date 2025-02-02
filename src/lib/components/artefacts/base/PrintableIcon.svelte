<script lang="ts">
    import { onMount } from 'svelte';
    import { AwesomeQR } from 'awesome-qr';
    import QRCode from '@castlenine/svelte-qrcode';
    
    export let id: string = '';
    export let url: string = '';
    
    let qrCode: string = '';
    let iconElement: HTMLElement;
    
    // QR параметри з повзунками
    let size = 500;
    let opacity = 0.5;
    let dotScale = 0.5;
    let logoImage = '';
    
    async function generateAwesomeQR() {
        if (!url || !iconElement) {
            console.log('Missing url or iconElement:', { url, iconElement });
            return;
        }
        
        // Отримуємо src зображення з img тегу
        const imgElement = iconElement.querySelector('img');
        if (!imgElement) {
            console.log('No img element found');
            return;
        }
        
        logoImage = imgElement.src;
        
        console.log('Creating QR with logo:', logoImage);
        const qr = await new AwesomeQR({
            text: url,
            size: size,
            backgroundImage: logoImage,
            backgroundDimming: `rgba(0,0,0,${opacity})`,
            dotScale: dotScale,
        }).draw();
        
        qrCode = qr as string;
        console.log('QR generated:', qrCode ? 'success' : 'failed', qrCode);
    }
    
    // Rerender QR when parameters change
    $: if (iconElement && (size || opacity || dotScale)) {
        generateAwesomeQR();
    }
    
    onMount(() => {
        generateAwesomeQR();
    });
</script>

<div class="icon" {id}>
    {#if url}
        <!-- <a href={url}> -->
            <span class="print-icon">
                {#if qrCode}
                    <div class="qr-container">
                        <img src={qrCode} alt="QR Code" width="100" height="100" />
                        <div class="qr-controls">
                            <label>
                                Size: {size}
                                <input type="range" bind:value={size} min="50" max="1000" step="50" />
                            </label>
                            <label>
                                Opacity: {opacity}
                                <input type="range" bind:value={opacity} min="0" max="1" step="0.1" />
                            </label>
                            <label>
                                Dot Scale: {dotScale}
                                <input type="range" bind:value={dotScale} min="0.1" max="1" step="0.1" />
                            </label>
                        </div>
                    </div>
                    <QRCode data={url} size={150} logoInBase64={logoImage} />
                {:else}
                    <slot />
                {/if}
            </span>
            <span class="default-icon" bind:this={iconElement}>
                <slot />
            </span>
        <!-- </a> -->
    {:else}
        <span class="print-icon">
            <slot />
        </span>
        <span class="default-icon">

            <slot name="print" />
        </span>
    {/if}
</div>


<style lang="scss">
    .print-icon {
        display: block;
        
        img {
            object-fit: contain;
        }
    }

    
    .default-icon {
        display: none;
    }
    
    @media print {
        .default-icon {
            display: none;
        }
        .print-icon {
            display: block;
            
            .qr-controls {
                display: none;
            }
        }
    }

    .qr-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .qr-controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        label {
            display: flex;
            flex-direction: column;
            font-size: 0.8rem;
            
            input {
                width: 100%;
            }
        }
    }

    .icon {
        cursor: pointer;
        
        a {
            color: inherit;
            text-decoration: none;
        }
    }
</style> 