class PathInterface {
    constructor(basePath) {
        if (typeof basePath !== 'string') {
            throw new Error('Invalid base path provided');
        }

        this.basePath = basePath;
    }

    userAdd() {
        return this.generator(['add']);
    }

    userDetail(userId) {
        return this.generator(['detail', userId]);
    }

    userDelete(userId) {
        return this.generator(['delete', userId]);
    }

    userEdit(userId) {
        return this.generator(['edit', userId]);
    }

    userList() {
        return this.generator(['list']);
    }

    /**
     *
     * @param {Array} array
     * @returns {string}
     */
    generator(array) {
        return [this.basePath, ...array].join('/')
    }
}

export default PathInterface;