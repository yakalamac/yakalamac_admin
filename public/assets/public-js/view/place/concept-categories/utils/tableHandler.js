import ElasticsearchParser from '../../../../http/elasticsearch/Parser.js';

/**
 *
 * @param {array} hits
 */
const buildTemplate = (hits)=> {

    if(hits.length === 0)
        return `
        <tr>
            <td colspan="4">İşletme Kategorisi Bulunamadı</td>
        </tr>
        `;

    let template = '';

    hits.forEach(
        hit => {
            hit = ElasticsearchParser.extractSourceFromHit(hit);
          template+= `
            <tr>
                <td>
                    ${hit.title ?? ''}
                </td>
                <td>
                    ${hit.description}
                </td>
                <td>
                    <a href=${window.Laravel.editCategory(hit.id)}>
                        <i class="ti ti-pencil me-1"></i>
                    </a>
                    <a href="#" class="trash-me-element" id="${hit.id}"><i
                        class="ti ti-trash me-1" id="${hit.id}"></i></a>
                </td>
            </tr>
          `;
        }
    );
// ${window.Laravel.deleteCategory(hit.id)}
    return template;
}

export default {
    pushCategories: (categories) => {

        // Append the generated template to the tbody
        $('tbody.table-border-bottom-0').html(
            buildTemplate(
                ElasticsearchParser.extractHits(
                    categories
                )
            )
        );
    }
}
