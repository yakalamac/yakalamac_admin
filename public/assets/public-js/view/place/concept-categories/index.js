import fetchCusisineCategories from './utils/get-collection.js';
import pushCuisineCategory from './utils/post.js';

$(document).ready(
    function (){
        fetchCusisineCategories();
    }
);
