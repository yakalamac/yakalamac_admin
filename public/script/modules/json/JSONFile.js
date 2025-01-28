export default class JSONFile {
    constructor() {
        this.file = undefined;
        this.content = undefined;
    }

    load() {
        return new Promise((resolve, reject) => {
            // Create a new FileReader instance for each load
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    this.content = event.target.result;
                    resolve(this.content); // Resolve with file content
                } catch (error) {
                    reject('Error reading file: ' + error); // Reject if reading fails
                }
            };

            reader.onerror = (error) => {
                reject('Error reading file: ' + error.target.error);
            };

            reader.readAsText(this.file); // Start reading the file as text
        });
    }

    getContent() {
        return this.content;
    }

    /**
     * @returns {Object}
     * @throws {Error}
     */
    getJsonContent() {
        try {
            return JSON.parse(this.content);
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    }

    getFileName() {
        return this.file.name;
    }

    getFileExtension() {
        return this.file.name.split('.').pop();
    }

    getFile() {
        return this.file;
    }

    setFile(file) {
        this.file = file;
        if (this.getFileExtension() !== 'json') {
            throw new Error('File extension must be .json');
        }

        return this;
    }
}
