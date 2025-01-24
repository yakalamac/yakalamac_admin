import {ApifyPlace} from "../../modules/tool/apify/ApifyPlace.js";
import {OctoparsePlace} from "../../modules/tool/octoparse/OctoparsePlace.js";
import {GoogleV2Place} from "../../modules/tool/google/GoogleV2Place.js";


export class Converter {
    /**
     *
     * @param {string} adaptor
     * @param {FormData} data
     */
    constructor(adaptor, data) {
        switch (adaptor) {
            case 'apify':
                this._adaptor = ApifyPlace;
                break;
            case 'octoparse':
                this._adaptor = OctoparsePlace;
                break;
            case 'google-version-2':
                this._adaptor = GoogleV2Place;
                break;
            default:
                throw new Error('Invalid adaptor name provided.');
        }
        this._ops = undefined;
        this._files = undefined;
        this._data = data;
    }

    _extractFiles() {
        this._files = this._data.getAll('files');

        return this;
    }

    _extractOptions() {
        this._ops = {
            saveFiles: {
                value: this._data.get('saveFiles'),
                stage: 'afterConvert1'
            },
            saveResults: {
                value: this._data.get('saveResults'),
                stage: 'afterConvert2'
            },
            downloadImages: {
                value: this._data.get('downloadImages'),
                stage: 'afterConvert3'
            },
            report: {
                value: this._data.get('report'),
                stage: 'onProcess'
            }
        };

        return this;
    }

    run() {
        this._extractFiles()
            ._extractOptions();
        console.log(this._files)
    }


    _runner(){
        const fr = new FileReader();
        fr.readAsText()
    }

}

window.Converter = Converter;