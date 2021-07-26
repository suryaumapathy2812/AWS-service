/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import S3 from 'aws-sdk/clients/s3';
require('dotenv').config();

// const s3 = new S3({
//     apiVersion: '2006-03-01',
//     region: 'ap-south-1',
//     credentials: {
//         accessKeyId: config.access_key_id,
//         secretAccessKey: config.secret_access_key,
//     },
//     signatureVersimport config from "./config"ion: 'v4'
// });


export interface fileUploadOptions {
    buffer: Buffer;
    filePath: string;
}


export class AwsDAO {
    s3: S3;
    private bucket: string;
    private access_key: string;
    private secretAccessKey: string;

    constructor() {
        this.s3 = this.connectS3();
        this.bucket = process.env.bucket_name || "";
        this.access_key = process.env.access_key_id || "";
        this.secretAccessKey = process.env.secret_access_key || "";
    }

    private connectS3() {
        return new S3({
            apiVersion: '2006-03-01',
            region: 'ap-south-1',
            credentials: {
                accessKeyId: this.access_key,
                secretAccessKey: this.secretAccessKey,
            },
            signatureVersion: 'v4'
        });
    }


    /**
     * Upload files to AWS S3 bucket
     * 
     * @param  {fileUploadOptions} file
     */
    async fileUpload(file: fileUploadOptions) {
        const params = {
            Bucket: this.bucket,
            Key: file.filePath,
            Body: file.buffer,
        };
        return this.s3.upload(params).promise();
    }


    getFileSignedUrl(Key: string): Promise<string | any> {
        return new Promise((resolve, reject) => {
            console.log('--- getFileSignedUrl : Key :', Key);
            const params = { Bucket: this.bucket, Key };
            this.s3.getSignedUrlPromise('getObject', params)
                .then((res) => {
                    console.log(res);
                    resolve(res);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }


    getFileAsBuffer(Key: string): Promise<Buffer | any> {
        return new Promise((resolve, reject) => {
            try {
                console.log('--- getFileAsBuffer  : Key :', Key);
                const params = {
                    Bucket: this.bucket,
                    Key: Key
                };
                this.s3.getObject(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Body);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }
}