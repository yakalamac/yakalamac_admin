<script setup>


import $ from '../../../bootstrap/assets/js/jquery.min.js'
import '../../../bootstrap/assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js';
import '../../../bootstrap/assets/plugins/metismenu/metisMenu.min.js';
import ApexCharts from '../../../bootstrap/assets/plugins/apexchart/apexcharts.min.js';

import '../../../bootstrap/assets/plugins/simplebar/js/simplebar.min.js';

$(function () {
    "use strict";


    // chart 1

    var options = {
        series: [{
            name: "Desktops",
            data: [4, 10, 25, 12, 25, 18, 40, 22, 7]
        }],
        chart: {
            foreColor: "#9ba7b2",
            height: 350,
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: !1,
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4,
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ff0080'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 0.8,
                opacityTo: 0.1,
                stops: [0, 100, 100, 100]
            },
        },
        colors: ["#ffd200"],
        grid: {
            show: true,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "dark",
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        markers: {
            show: !1,
            size: 5,
        },
    };

    var chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();




    // chart 2

    var options = {
        series: [{
            name: "Desktops",
            //ata: [10, 41, 35, 51, 49, 82, 69, 91, 18],
            data: [4, 25, 14, 34, 10, 39, 20, 53, 10]
        }],
        chart: {
            foreColor: "#9ba7b2",
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: !1,
            },
            dropShadow: {
                enabled: !0,
                top: 3,
                left: 14,
                blur: 4,
                opacity: .12,
                color: "#fc185a"
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#7928ca'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 1,
                opacityTo: 1,
                // stops: [0, 100, 100, 100]
            },
        },
        colors: ["#ff0080"],
        grid: {
            show: true,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "dark",
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();



    // chart 3

    var options = {
        series: [{
            name: "Total Sales",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: "Customers",
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: "Store Visitores",
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        chart: {
            foreColor: "#9ba7b2",
            height: 380,
            type: 'bar',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: !1,
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ffd200', '#00c6fb', '#7928ca'],
                shadeIntensity: 1,
                type: 'vertical',
                //opacityFrom: 0.8,
                //opacityTo: 0.1,
                stops: [0, 100, 100, 100]
            },
        },
        colors: ['#ff6a00', "#005bea", "#ff0080"],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'last',
                columnWidth: '45%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: !0,
            width: 4,
            colors: ["transparent"]
        },
        grid: {
            show: true,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "dark",
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart3"), options);
    chart.render();


    // chart 4

    var options = {
        series: [44, 55, 13, 43],
        chart: {
            foreColor: "#9ba7b2",
            height: 400,
            type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ee0979', '#17ad37', '#ec6ead', '#00c6fb'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 1,
                opacityTo: 1,
                //stops: [0, 100, 100, 100]
            },
        },
        colors: ["#ff6a00", "#98ec2d", "#3494e6", "#005bea"],
        legend: {
            position: "bottom",
            show: !0
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    var chart = new ApexCharts(document.querySelector("#chart4"), options);
    chart.render();




    // chart 5

    var options = {
        series: [44, 55, 13, 43, 22],
        chart: {
            foreColor: "#9ba7b2",
            height: 380,
            type: 'donut',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#ee0979', '#17ad37', '#ec6ead', '#00c6fb'],
                shadeIntensity: 1,
                type: 'vertical',
                opacityFrom: 1,
                opacityTo: 1,
                //stops: [0, 100, 100, 100]
            },
        },
        colors: ["#ff6a00", "#98ec2d", "#3494e6", "#005bea"],
        legend: {
            position: "bottom",
            show: !0
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    var chart = new ApexCharts(document.querySelector("#chart5"), options);
    chart.render();





    // chart 6

    var options = {
        series: [75],
        chart: {
            height: 350,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                //startAngle: -135,
                //endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '80%',
                    background: 'transparent',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: false,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.24
                    }
                },
                track: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: false,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function (val) {
                            return parseInt(val);
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#2af598'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: ["#009efd"],
        stroke: {
            lineCap: 'round'
        },
        labels: ['Total Leads'],
    };

    var chart = new ApexCharts(document.querySelector("#chart6"), options);
    chart.render();



    // chart 7

    var options = {
        series: [67],
        chart: {
            height: 370,
            type: 'radialBar',
            offsetY: -10
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120
                    },
                    value: {
                        offsetY: 76,
                        fontSize: '22px',
                        color: undefined,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }
                },
                track: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: false,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35
                    }
                },
            },

        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#ff0080'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: ["#7928ca"],
        stroke: {
            dashArray: 4
        },
        labels: ['Median Ratio'],
    };

    var chart = new ApexCharts(document.querySelector("#chart7"), options);
    chart.render();





});

// import { onMounted } from 'vue';
// const loadScripts = () => {
//     const scripts = [
//         import bootstrap/assets/js/bootstrap.bundle.min.js
//         import bootstrap/assets/js/jquery.min.js
//         import bootstrap/assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js
//         import bootstrap/assets/plugins/metismenu/metisMenu.min.js
//         import bootstrap/assets/plugins/apexchart/apexcharts.min.js
//         import bootstrap/assets/plugins/apexchart/apex-custom-chart.js
//         import bootstrap/assets/plugins/simplebar/js/simplebar.min.js
//         '../../../bootstrap/assets/js/main.js'
//     ];

//     scripts.forEach(src => {
//         const script = document.createElement('script');
//         script.src = src;
//         script.async = true;
//         document.head.appendChild(script);
//     });
// };

// // Bileşen DOM'a eklendiğinde loadScripts çağrılacak
// onMounted(() => {
//     loadScripts();
// });
</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="row">
                <div class="col-12 col-xl-12">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Area Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart1"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-12">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Line Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart2"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-12">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Bar Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart3"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Pie Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart4"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Donught Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart5"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Radial Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart6"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-header py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="mb-0">Radial Bar Chart</h5>
                                <div class="dropdown">
                                    <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                                        data-bs-toggle="dropdown">
                                        <span class="material-icons-outlined fs-5">more_vert</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="chart7"></div>
                        </div>
                    </div>
                </div>


            </div><!--end row-->

        </div>
    </main>
    <!--end main wrapper-->
</template>