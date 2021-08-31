const s3 = require('aws-sdk/clients/s3');  // npm install aws-sdk

async function readFile(bucketName, fileName) {
    try {
        var s3Data = await readTxtFile(bucketName, fileName)
        console.log(s3Data);
        return s3Data
    } catch (err) {
        console.log('Error:', err);
        throw err
    }
}

const readTxtFile = async (BUCKET_NAME, KEY) => {
    return new Promise(function (resolve, reject) {
        var s3Bkt = new s3();
        var params = { Bucket: BUCKET_NAME, Key: KEY };
        s3Bkt.getObject(params, function (err, data) {
            if (err) {
                reject(err.message);
            } else {
                var data = Buffer.from(data.Body).toString('utf8');
                resolve(data);
            }
        });
    });
}

module.exports = {
    readFromBucket: readFile
}