import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    let query: FirebaseFirestore.Query = adminDb.collection('applications').orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Firestore search is limited. If search is provided, we might have to fetch and filter in memory if we don't use Algolia.
    // For a simple implementation, if there is a search term, we might fetch a larger set or use a specific field.
    // Given the prompt: "Search/filter phải thực hiện ở backend/database", we will fetch and filter here.
    
    const snapshot = await query.get();
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter((app: any) => 
        (app.fullName && app.fullName.toLowerCase().includes(lowerSearch)) ||
        (app.applicationId && app.applicationId.toLowerCase().includes(lowerSearch)) ||
        (app.cccd && app.cccd.includes(search)) ||
        (app.phone && app.phone.includes(search))
      );
    }

    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginatedResults,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
