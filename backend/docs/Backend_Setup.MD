# 

## 1.INSTALL DEPENDENCIES.

    npm install africastalking

    npm install langchain @langchain/core @langchain/openai

    npm install ai

    npm install zod

    npm install cors

    npm install -D @types/cors

    npm install axios
    //can be used to stream responses directly to an API

    npm install -D @types/axios

    npm install @safaricom-et/mpesa-node-js-sdk

## 2. .env SETUP.

    SUPABASE_URL=project URL here
    DATABASE_URL=Transaction Pooler URL
    DIRECT_URL=Session Pooler URL.
    SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=


### 2.1. Drizzle.config setup.

-The file is at the root of our folder.

-It's structure is as follows:

    import { defineConfig } from 'drizzle-kit';
    import * as dotenv from 'dotenv';

    // Load environment variables from your .env file
    dotenv.config();

    // Ensure the Direct URL is available before Drizzle tries to connect
    if (!process.env.DIRECT_URL) {
    throw new Error('DIRECT_URL is missing in your .env file!');
    }

    export default defineConfig({
    // Path to your Drizzle schema file(s)
    schema: './src/db/dbConnection.ts', 
    
    // Where Drizzle will output your generated SQL migration files
    out: './drizzle/migrations', 
    
    // We are using Supabase, which is Postgres
    dialect: 'postgresql',
    
    dbCredentials: {
        // 🚨 IMPORTANT: Always use the DIRECT_URL for migrations!
        url: process.env.DIRECT_URL,
    },
    
    // Print all SQL statements being executed (great for hackathon debugging)
    verbose: true,
    
    // Prompt for confirmation before dropping any tables/columns
    strict: true, 
    });


### 2.2. Schema Creation

-The tables are created in the schema folder.

-The index.ts file at the root of the db folder is the database connection, while the one in the schema folder is the one exporting all tables.

### 2.3 RLS Policies.

-Setting up RLS via the Supabase dahsboard then defining the policies on table creation.

-Note that if RLS is enabled but no policy is set, nobody using the ANON_KEY can make any changes to our db.

-The general template for handling this on table creation would be:

    export const myTable = pgTable("table_name", {
 

