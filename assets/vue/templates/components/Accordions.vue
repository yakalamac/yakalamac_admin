<script setup>

const props = defineProps(
    {
        title: {
            type: String,
            required: true
        },
        accordions: {
            type: Array,
            required: false
        }
    }
);


const onCollapseHeader = (event) => {
    const body = event.target.parentNode.parentNode.querySelector('div[data-bs-parent="#accordionExample"]');
    if (event.target.classList.contains('collapsed')) {
        event.target.classList.remove('collapsed');
        body.classList.remove('show');
    }
    else {
        event.target.classList.add('collapsed');
        body.classList.add('show');
    }
};

const onCollapseBody = (event) => {

    if (event.target.classList.contains('show')) event.target.classList.remove('show');
    else event.target.classList.add('show');
};

</script>

<template>
    <main class="main-wrapper">
        <div class="main-content">
            <!-- Card Zone -->
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ props.title }} </h5>
                    <hr>
                    <div class="accordion" id="accordionExample">

                        <div v-for="accordion in props.accordions" class="accordion-item">

                            <h2 class="accordion-header" id="headingOne">
                                <button @click="onCollapseHeader" class="accordion-button" type="button"
                                    data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false"
                                    aria-controls="collapseOne">
                                    {{ accordion.title }}
                                </button>
                            </h2>

                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    {{ accordion.body }}
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
            <!-- Card Zone / -->
        </div>
    </main>
    <!--end main wrapper-->
</template>