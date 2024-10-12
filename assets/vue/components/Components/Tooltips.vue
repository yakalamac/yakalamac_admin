<script setup>
</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">

            <div class="card">
                <div class="card-body">
                    <h5 class="mb-0">Tooltips Examples</h5>
                    <hr>
                    <div class="row row-cols-auto g-3">
                        <div class="col">
                            <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip"
                                data-bs-placement="top" title="Tooltip on top">Tooltip on top</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip"
                                data-bs-placement="right" title="Tooltip on right">Tooltip on right</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip"
                                data-bs-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip"
                                data-bs-placement="left" title="Tooltip on left">Tooltip on left</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!--end main wrapper-->
</template>