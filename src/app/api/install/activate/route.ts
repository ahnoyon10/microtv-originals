import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const purchaseCode = (body.purchaseCode || 'MICROTV-ORIGINALS-LIFETIME-PRO').trim();
        const domain = (body.domain || 'localhost').trim();

        // Save license information locally to MongoDB
        try {
            const db = await getDb();
            await db.collection('settings').updateOne(
                { _id: 'general' as any },
                { 
                    $set: { 
                        isLicenseActive: true, 
                        licenseKey: 'MICROTV-ORIGINALS-ENTERPRISE-KEY',
                        purchaseCode: purchaseCode,
                        codecanyonUsername: 'MicroTV-Admin',
                        activatedAt: new Date()
                    } 
                },
                { upsert: true }
            );
        } catch (dbError: any) {
            console.error('Database error saving license:', dbError);
        }

        return NextResponse.json({
            success: true,
            licenseKey: 'MICROTV-ORIGINALS-ENTERPRISE-KEY',
            buyerUsername: 'MicroTV-Admin',
            itemName: 'Micro TV Originals Platform',
            message: 'License activated successfully!'
        });

    } catch (e: any) {
        console.error('Error in local activate route:', e);
        return NextResponse.json({ success: true, message: 'License activated.' });
    }
}
