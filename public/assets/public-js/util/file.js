export default {
    onData : (file, callback)=>{
        if(file && file.type === 'application/json') {
            // use blob to read file
            const blob = new Blob(
                [
                    file
                ]
            );
            // Use text method to get string data with promise structure
            return blob
                .text()
                .then(callback);
        }
        else
        {
            $('#json-output').html('<span class="text-danger">Please upload a valid JSON file.</span>');
            return null;
        }
    }
}
