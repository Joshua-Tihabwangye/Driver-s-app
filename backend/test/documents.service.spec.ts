import { DocumentsService } from '../src/documents/documents.service';
import { InMemoryStoreService } from '../src/storage/in-memory-store.service';

describe('DocumentsService', () => {
  it('rejects non-future expiry date', () => {
    const store = new InMemoryStoreService();
    const service = new DocumentsService(store);

    expect(() =>
      service.upsert('driver-demo-001', {
        documentType: 'drivers_license',
        fileUrl: 'https://example.com/license.pdf',
        expiryDate: '2000-01-01',
      }),
    ).toThrow();
  });

  it('reports expired status when existing document has past date', () => {
    const store = new InMemoryStoreService();
    const service = new DocumentsService(store);

    store.driverDocuments.push({
      id: 'doc-1',
      driverId: 'driver-demo-001',
      documentType: 'drivers_license',
      fileUrl: 'https://example.com/license.pdf',
      expiryDate: '2000-01-01',
      status: 'verified',
      updatedAt: Date.now(),
    });

    const status = service.getDocumentsStatus('driver-demo-001');
    const license = status.documents.find((item) => item.documentType === 'drivers_license');

    expect(license?.expiryStatus).toBe('expired');
  });
});
