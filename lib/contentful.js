import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

// Read-only Delivery API client
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
});

// Read/write Management API client
let _managementClient = null;
export function getManagementClient() {
  if (!_managementClient) {
    _managementClient = createManagementClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });
  }
  return _managementClient;
}

export async function getEnvironment() {
  const client = getManagementClient();
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  return space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
}
