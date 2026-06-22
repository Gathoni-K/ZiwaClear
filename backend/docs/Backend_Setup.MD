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
    // Columns...
    }, (table) => [
    pgPolicy("clear_descriptive_name", {
        for: "select" | "insert" | "update" | "delete" | "all",
        to: "anon" | "authenticated" | "public",
        using: sql`boolean_expression`,
        withCheck: sql`boolean_expression` // Optional: Only for write verification (INSERT/UPDATE)
    })
    ]).enableRLS();


## 3.Creating a Seed Script.

-The standard database-first workflow follows the order below:

1.Define schema and migration tables.
2.Seed the sample data.
3.Build the app architecture(Services,Controllers etc etc)

### 3.1.Create the Seed Script.

-The goal is to write a self-contained script that inserts a dummy harvester first, then creates 5 sample batches mapped to real coordinates around the Kisumu region on our Leaflet map.

-When writing a seed script, always ensure to follow the rules below:

1. Honor the foreign key constraints. You cannot insert data into a column dependent on another if the item does not already exist on the former table.

2. Enable idempotency - no matter how many times the script is run, the result is the same.
-A great seed script either cleans up before it runs or uses 'upserts' - on conflict it should do nothing.

3. Cleanly terminate the process - 'process.exit(0)' at the very end should be included at the very end of our script.

-Create a new file:

    //src/db/seed/ts
    import { db } from "./index";
    import { harvesters, biomassBatches } from "./schema";

    async function main() {
    console.log("⏳ Seeding database...");

    // 1. Insert a mock harvester so our batches can reference them
    const [mockHarvester] = await db.insert(harvesters).values({
        phoneNumber: "+254712345678",
        name: "John Omondi",
        location: "Dunga Beach",
    }).returning({ id: harvesters.id });

    if (!mockHarvester) {
        throw new Error("Failed to create mock harvester for seeding.");
    }

    // 2. Insert 5 sample biomass batches around Lake Victoria coordinates
    await db.insert(biomassBatches).values([
        {
        harvesterId: mockHarvester.id,
        weightKg: "45.5",
        locationCoordinates: "-0.1432,34.7391", // Dunga Beach area
        status: "available",
        },
        {
        harvesterId: mockHarvester.id,
        weightKg: "120.0",
        locationCoordinates: "-0.1032,34.7521", // Kisumu City Pier area
        status: "available",
        },
        {
        harvesterId: mockHarvester.id,
        weightKg: "75.2",
        locationCoordinates: "-0.1194,34.7314", // Hippo Point area
        status: "claimed",
        },
        {
        harvesterId: mockHarvester.id,
        weightKg: "90.3",
        locationCoordinates: "-0.0512,34.6012", // Kombewa area
        status: "available",
        },
        {
        harvesterId: mockHarvester.id,
        weightKg: "60.0",
        locationCoordinates: "-0.2831,34.3412", // Homa Bay area
        status: "paid",
        },
    ]);

    console.log("✅ Database seeded successfully with 5 sample batches!");
    process.exit(0);
    }

    main().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
    });


-Add a seed shortcut to package.json file.

    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts"
    }

-Run the seed script using:

    npm run db:seed

## 4.Setting Up Africa's Talking API.

-Install using:

    npm install africastalking

-Environment variables needed:



-Ngrok is also needed, install globally, follow instuctions in the official docs. We installed using Microsoft store.

-On installation, add the authToken to the project.