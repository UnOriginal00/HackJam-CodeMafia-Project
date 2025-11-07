import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function CollabResources() {
  const outlet = useOutletContext ? useOutletContext() : {};
  const selectedGroup = outlet?.selectedGroup ?? null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">Group Resources</h3>
        <p className="text-sm text-gray-600">Placeholder resource area for the selected group.</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <div className="mb-4">
          <div className="text-sm text-gray-500">Group</div>
          <div className="text-lg font-medium">{selectedGroup?.name ?? 'No group selected'}</div>
        </div>

        <div className="mt-4 text-gray-700">
          <p>This is a placeholder for group-specific resources (documents, links, files).</p>
          <p className="mt-2 text-sm text-gray-500">You can implement uploads, links, and integrations here later.</p>
        </div>
      </div>
    </div>
  );
}
