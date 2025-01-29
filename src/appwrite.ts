import { Client, Account, Databases, Storage, Functions, Messaging, Avatars} from 'appwrite';
import AppwriteConsts from './appwrite-variables';

export const client = new Client();

client
    .setEndpoint(AppwriteConsts.endpoint)
    .setProject(AppwriteConsts.projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const messaging = new Messaging(client);
export const avatars = new Avatars(client);
export { ID } from 'appwrite';