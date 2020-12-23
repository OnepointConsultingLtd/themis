/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
const { BlobServiceClient } = require('@azure/storage-blob');
const express = require('express');
const app = express();
const timestamp = require('time-stamp');

const account = process.env.RULES_AZURE_ACCOUNT;
const sas = process.env.RULES_AZURE_SAS;
const containerName = process.env.RULES_AZURE_CONTAINER;

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);

async function uploadBlob(content, fileName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = `${timestamp.utc('YYYYMMDDHHmmss')}_${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  console.log(content.length);
  let blobList = [];
  try {
    const uploadRes = await blockBlobClient.upload(content, content.length);
    console.log(uploadRes);
    const blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {
      console.log(blob.name);
      blobList.push(blob.name);
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  console.log(blobList);
  if (blobList.includes(blobName)) {
    console.log('Found file in AazureStorage!', blobName);
    return true;
  }
  return false;
//   console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}

/** receive and upload rules dslr text file */
app.post('/api/deploy/azure-storage/:fileName', async (req, res) => {
  const uploadResponse = await uploadBlob(req.body, req.params.fileName);
  console.log('Return: ', uploadResponse);
  // if (err /* || stderr */) res.status(404).send({ message: `${err} ${stderr}` }); // TODO: we need to get feedback from Azure Storage
  if (!uploadResponse) res.status(404).send({ message: 'File was not deployed' });
  else res.status(200).send({ response: 'File was succesfully deployed!' });
});

module.exports = app;
