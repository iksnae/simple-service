const s3 = require('aws-sdk/clients/s3');  // npm install aws-sdk
const {Base64} = require('js-base64');

const uploadToS3 = async (BUCKET_NAME, KEY, CONTENT) => {
    
    return new Promise((resolve, reject) => {
        var s3Bucket = new s3();
        let decodedContent = Base64.decode(CONTENT)
        const params = {
            Bucket: BUCKET_NAME,
            Key: KEY,
            Body: decodedContent
        };
        console.log("putting decodedContent:",decodedContent)
        s3Bucket.putObject(params, function(err, data) {
            if (err) {
                reject(err)
            }
            resolve("ok")
        });
    })
};


module.exports = {
    writeToS3: uploadToS3
}