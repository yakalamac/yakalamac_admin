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
                    ${hit.title ?? 'Ünvan yok'}
                </td>
                <td>
                    ${hit.description ?? 'Açıklama yok'}
                </td>
                <td>
                    <a href=${window.Laravel.editCategory(hit.id)}>
                        <i class="ti ti-pencil me-1"></i>
                    </a>
                    <a href=${window.Laravel.deleteCategory(hit.id)}
                    onClick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')"><i
                        class="ti ti-trash me-1"></i></a>
                </td>
            </tr>
          `;
        }
    );

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
