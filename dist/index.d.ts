/// <reference types="node" />
import S3 from 'aws-sdk/clients/s3';
export interface fileUploadOptions {
    buffer: Buffer;
    filePath: string;
}
export declare class AwsDAO {
    s3: S3;
    private bucket;
    private access_key;
    private secretAccessKey;
    constructor();
    private connectS3;
    /**
     * Upload files to AWS S3 bucket
     *
     * @param  {fileUploadOptions} file
     */
    fileUpload(file: fileUploadOptions): Promise<S3.ManagedUpload.SendData>;
    getFileSignedUrl(Key: string): Promise<string | any>;
    getFileAsBuffer(Key: string): Promise<Buffer | any>;
}
