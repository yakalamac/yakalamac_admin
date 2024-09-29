import Parser from "../../../../http/elasticsearch/Parser.js";
const buildTemplate = (query, currentPage, pageSize, paginationSize)=>{
    let template = `
    <div class="float-start w-100 mt-3">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" href="?page=1">
                        <<
                    </a>
                </li>
    `;
    if(currentPage < pageSize)
        for(let i = currentPage; i <= pageSize; i++){
            template+=`
                <li class="page-item">
                    <a class="page-link" href="?per_page=${paginationSize}&page=${i}&query=">
                        ${i}
                    </a>
                </li>
            `;
        }
    else
        template+=`
            <li class="page-item"><a class="page-link" href="?page=${pageSize}&query=${query}">
                Son
                </a>
            </li>`;

    template += `<li class="page-item"><a class="page-link" href="?page=${pageSize}">
                            >>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>`;

    return template;
};
export default {
  pushPages : function(data, paginationSize = 15) {
      $('div#pagination').html(
          buildTemplate(
              '',
              1,
              Math.ceil(Parser.extractResponseItemCount(data)/paginationSize),
              paginationSize
          )
      );
  }
};
