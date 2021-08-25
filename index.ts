import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

console.log('initializing service')

const BUCKET_NAME = "my-bucket"

const writeValue = async (key: string, value: string) => {
    const obj = new aws.s3.BucketObject("examplebucketObject", {
        key: key,
        bucket: BUCKET_NAME,
        content: value
    });
    return {
        statusCode: 200,
        body: JSON.stringify({ "result": `value written for: ${key}` })
    };
}
const readValue = async (key: string) => {
    const obj = await aws.s3.getBucketObject({
        bucket: BUCKET_NAME,
        key: key
    })
    return {
        statusCode: 200,
        body: JSON.stringify({ "result": `value read for: ${key}`, "value": obj })
    };
}

export = async () => {
    const endpoint = new awsx.apigateway.API("my-service", {
        routes: [
            {
                path: "/{key}",
                method: "GET",
                eventHandler: async (event) => {
                    console.log('handle get:', event)
                    const key = String(event.pathParameters!["key"]);
                    return readValue(key)
                },
            },
            {
                path: "/{key}",
                method: "PUT",
                eventHandler: async (event) => {
                    console.log('handle put:', event)
                    const key = String(event.pathParameters!["key"]);
                    const value = String(event.body!)
                    return writeValue(key, value)
                },
            }
        ]
    });
    return {
        endpoint: endpoint.url
    }
}