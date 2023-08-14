import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'vue-chartjs';

export default defineNuxtPlugin(nuxtApp => {

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        PointElement,
        BarElement,
        CategoryScale,
        LinearScale,
        LineElement,
        ArcElement
    );

    nuxtApp.vueApp.component('chart-bar', Bar);
    nuxtApp.vueApp.component('chart-line', Line);
    nuxtApp.vueApp.component('chart-doughnut', Doughnut);

});