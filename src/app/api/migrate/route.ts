import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // We use the non-pooling URL for migrations if available, otherwise fallback to the normal URL
    const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
    
    // Run prisma db push directly in the Vercel environment
    const { stdout, stderr } = await execAsync(`npx prisma db push --accept-data-loss`, {
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
        POSTGRES_PRISMA_URL: dbUrl // Override to non-pooling for push
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema pushed successfully!',
      stdout,
      stderr
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to push schema', details: errorMessage }, { status: 500 });
  }
}
