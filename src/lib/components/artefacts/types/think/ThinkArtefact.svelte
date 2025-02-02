<script lang="ts">
    import PrintableArtefact from '../../base/PrintableArtefact.svelte';
    import thinkIcon from '../../assets/think_artefact.png';
    

    export let id: string;
    export let url: string;
</script>

<PrintableArtefact 
    {id}
    {url}
    imgSrc={thinkIcon}
    imgAlt="Think artefact"
    size={50}
/> 