import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { readFromBucket } from './read-version'
import { writeToS3 } from './write-version'


console.log('initializing service')
const BUCKET_NAME = "my-bucket"
const bucket = new aws.s3.Bucket(BUCKET_NAME);


export = async () => {
    const endpoint = new awsx.apigateway.API("my-service", {
        routes: [
            {
                path: "/{key}",
                method: "GET",
                eventHandler: async (event) => {
                    console.log('handle get')
                    const key = String(event.pathParameters!["key"]);
                    const bucket_name = await bucket.id.get()
                    console.log(`reading value from ${bucket_name}/${key}`)
                    const value = await readFromBucket(bucket_name, key)
                    console.log('got:',value)
                    return {
                        statusCode: 200,
                        body: value
                    }
                },
            },
            {
                path: "/{key}",
                method: "PUT",
                eventHandler: async (event) => {
                    console.log('handle put')
                    const key = String(event.pathParameters!["key"]);
                    const value = String(event.body!)
                    const bucket_name = await bucket.id.get()
                    console.log(`updating value at ${bucket_name}/${key}`)
                    let result = await writeToS3(bucket_name, key, value)
                    console.log(`updated value.`)
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ "result": result })
                    }
                },
            }
        ]
    });
    return {
        bucket_id: bucket.id,
        endpoint: endpoint.url
    }
}